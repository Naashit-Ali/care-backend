import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { generateText, stepCountIs, tool } from 'ai';
import { Model, Types } from 'mongoose';
import { z } from 'zod';
import { dayString } from '../common/utils/time.js';
import { Dose } from '../doses/dose.schema.js';
import { Parent } from '../parents/parent.schema.js';
import { RealtimeGateway } from '../realtime/realtime.gateway.js';
import { AgentFollowUp } from './agent-follow-up.schema.js';
import { AgentLog, AgentLogType } from './agent-log.schema.js';
import { resolveLlm } from './llm.js';

type MissedDose = {
  _id: Types.ObjectId;
  parentId: Types.ObjectId;
  caregiverId: Types.ObjectId;
  medicineName: string;
  dose: string;
  critical: boolean;
  scheduledAt: Date;
  status: string;
};

@Injectable()
export class AgentService {
  private readonly logger = new Logger(AgentService.name);
  private running = new Set<string>();

  constructor(
    @InjectModel(AgentLog.name) private logs: Model<AgentLog>,
    @InjectModel(AgentFollowUp.name) private followUps: Model<AgentFollowUp>,
    @InjectModel(Dose.name) private doses: Model<Dose>,
    @InjectModel(Parent.name) private parents: Model<Parent>,
    private realtime: RealtimeGateway,
  ) {}

  async listForParent(parentId: string, limit = 50) {
    return this.logs.find({ parentId }).sort({ createdAt: -1 }).limit(limit).lean();
  }

  /** Called when a dose flips to missed (scheduler or demo). */
  async onDoseMissed(dose: MissedDose) {
    const id = String(dose._id);
    if (this.running.has(id)) return;
    this.running.add(id);
    try {
      await this.run(dose, 'missed');
    } catch (e) {
      this.logger.error(`Agent failed for dose ${id}`, e instanceof Error ? e.stack : e);
      await this.writeLog(dose, 'result', `Agent error: ${e instanceof Error ? e.message : 'unknown'}`, undefined);
    } finally {
      this.running.delete(id);
    }
  }

  /** Minute cron: re-run agent for due follow-ups if the dose is still not taken. */
  async processFollowUps() {
    const due = await this.followUps.find({ done: false, runAt: { $lte: new Date() } }).limit(20);
    for (const job of due) {
      job.done = true;
      await job.save();
      const dose = await this.doses.findById(job.doseId).lean();
      if (!dose || dose.status === 'taken') continue;
      await this.onDoseMissed(dose as MissedDose);
    }
  }

  private async run(dose: MissedDose, reason: 'missed' | 'follow_up') {
    const parent = await this.parents.findById(dose.parentId).select('name').lean();
    const parentName = parent?.name ?? 'your parent';
    const history = await this.adherenceHistory(String(dose.parentId), 7);

    await this.writeLog(
      dose,
      'thought',
      reason === 'missed'
        ? `${parentName} missed ${dose.medicineName} (${dose.dose})${dose.critical ? ' — critical medicine' : ''}. Deciding next step.`
        : `Follow-up: ${parentName} still has not taken ${dose.medicineName}.`,
    );

    const llm = resolveLlm();
    if (!llm) {
      await this.fallbackWithoutLlm(dose, parentName, history);
      return;
    }

    await this.writeLog(dose, 'thought', `Using ${llm.provider === 'google' ? 'Gemini (free)' : 'Anthropic'}…`);

    const tools = {
      getAdherenceHistory: tool({
        description: 'Get taken/missed counts and recent missed doses for this parent.',
        inputSchema: z.object({ days: z.number().int().min(1).max(30).default(7) }),
        execute: async ({ days }) => this.adherenceHistory(String(dose.parentId), days),
      }),
      remindParent: tool({
        description: 'Send a short spoken reminder to the parent phone.',
        inputSchema: z.object({ message: z.string().min(5).max(200) }),
        execute: async ({ message }) => {
          this.realtime.toParent(String(dose.parentId), 'agent:remind', {
            message,
            doseId: String(dose._id),
            medicineName: dose.medicineName,
          });
          await this.writeLog(dose, 'tool_call', message, 'remindParent');
          return { ok: true };
        },
      }),
      notifyCaregiver: tool({
        description: 'Alert the family caregiver with a short summary and urgency.',
        inputSchema: z.object({
          summary: z.string().min(5).max(280),
          urgency: z.enum(['low', 'medium', 'high']),
        }),
        execute: async ({ summary, urgency }) => {
          this.realtime.toCaregiver(String(dose.caregiverId), 'agent:alert', {
            parentId: String(dose.parentId),
            parentName,
            doseId: String(dose._id),
            medicineName: dose.medicineName,
            summary,
            urgency,
            critical: dose.critical,
          });
          await this.writeLog(dose, 'tool_call', `[${urgency}] ${summary}`, 'notifyCaregiver');
          return { ok: true };
        },
      }),
      scheduleFollowUp: tool({
        description: 'Check again in N minutes if the dose is still not taken.',
        inputSchema: z.object({ minutes: z.number().int().min(1).max(120) }),
        execute: async ({ minutes }) => {
          await this.followUps.create({
            doseId: dose._id,
            runAt: new Date(Date.now() + minutes * 60_000),
            done: false,
          });
          await this.writeLog(dose, 'tool_call', `Follow up in ${minutes} min`, 'scheduleFollowUp');
          return { ok: true, minutes };
        },
      }),
    };

    const system = `You are MediCare's gentle care agent for a family medicine app.
Rules:
- Escalate slowly: remind the parent first, then remind again, then notify the caregiver.
- Critical medicines (heart, blood pressure) escalate faster — notify caregiver sooner.
- Never give medical advice, never change doses or schedules.
- Keep every message short, kind, and easy for older adults to understand.
- Prefer tools over long explanations. You may call multiple tools.
- Always end with either notifyCaregiver or scheduleFollowUp (or both).`;

    const prompt = `Parent: ${parentName}
Missed medicine: ${dose.medicineName} (${dose.dose})
Critical: ${dose.critical ? 'yes' : 'no'}
Scheduled at: ${dose.scheduledAt.toISOString()}
Reason: ${reason}
7-day adherence: ${JSON.stringify(history)}

Decide what to do now.`;

    const result = await generateText({
      model: llm.model,
      system,
      prompt,
      tools,
      stopWhen: stepCountIs(6),
    });

    if (result.text?.trim()) await this.writeLog(dose, 'thought', result.text.trim());
    await this.writeLog(dose, 'result', `Agent finished (${llm.provider}).`);
  }

  /** No API key: still remind + notify so the demo flow works without an LLM. */
  private async fallbackWithoutLlm(dose: MissedDose, parentName: string, history: Awaited<ReturnType<AgentService['adherenceHistory']>>) {
    const message = dose.critical
      ? `${parentName}, please take your ${dose.medicineName} now. It is important.`
      : `${parentName}, it is time for your ${dose.medicineName}.`;
    this.realtime.toParent(String(dose.parentId), 'agent:remind', {
      message,
      doseId: String(dose._id),
      medicineName: dose.medicineName,
    });
    await this.writeLog(dose, 'tool_call', message, 'remindParent');

    const summary = dose.critical
      ? `${parentName} missed critical ${dose.medicineName}. Please check in.`
      : `${parentName} missed ${dose.medicineName}. Reminded them once.`;
    this.realtime.toCaregiver(String(dose.caregiverId), 'agent:alert', {
      parentId: String(dose.parentId),
      parentName,
      doseId: String(dose._id),
      medicineName: dose.medicineName,
      summary,
      urgency: dose.critical ? 'high' : 'medium',
      critical: dose.critical,
    });
    await this.writeLog(dose, 'tool_call', summary, 'notifyCaregiver');

    const minutes = dose.critical ? 5 : 15;
    await this.followUps.create({
      doseId: dose._id,
      runAt: new Date(Date.now() + minutes * 60_000),
      done: false,
    });
    await this.writeLog(dose, 'tool_call', `Follow up in ${minutes} min`, 'scheduleFollowUp');
    await this.writeLog(
      dose,
      'result',
      `Fallback agent (no LLM key). Set GEMINI_API_KEY (free) or ANTHROPIC_API_KEY. Adherence 7d: ${history.taken} taken / ${history.missed} missed.`,
    );
  }

  private async adherenceHistory(parentId: string, days: number) {
    const from = new Date();
    from.setDate(from.getDate() - (days - 1));
    from.setHours(0, 0, 0, 0);
    const fromDay = dayString(from);
    const doses = await this.doses
      .find({ parentId, date: { $gte: fromDay } })
      .select('status medicineName scheduledAt')
      .lean();
    const taken = doses.filter((d) => d.status === 'taken').length;
    const missed = doses.filter((d) => d.status === 'missed').length;
    const pending = doses.filter((d) => d.status === 'pending').length;
    return {
      days,
      taken,
      missed,
      pending,
      recentMissed: doses
        .filter((d) => d.status === 'missed')
        .slice(-5)
        .map((d) => ({ medicineName: d.medicineName, scheduledAt: d.scheduledAt })),
    };
  }

  private async writeLog(dose: MissedDose, type: AgentLogType, message: string, toolName?: string) {
    const doc = await this.logs.create({
      parentId: dose.parentId,
      caregiverId: dose.caregiverId,
      doseId: dose._id,
      type,
      tool: toolName,
      message,
    });
    const payload = {
      _id: String(doc._id),
      parentId: String(dose.parentId),
      caregiverId: String(dose.caregiverId),
      doseId: String(dose._id),
      type,
      tool: toolName,
      message,
      createdAt: (doc as { createdAt?: Date }).createdAt?.toISOString?.() ?? new Date().toISOString(),
    };
    this.realtime.toCaregiver(String(dose.caregiverId), 'agent:log', payload);
    return doc;
  }
}
