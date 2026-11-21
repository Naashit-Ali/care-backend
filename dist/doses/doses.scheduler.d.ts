import { OnModuleInit } from '@nestjs/common';
import { DosesService } from './doses.service.js';
export declare class DosesScheduler implements OnModuleInit {
    private doses;
    private readonly logger;
    private checking;
    constructor(doses: DosesService);
    onModuleInit(): Promise<void>;
    generateToday(): Promise<void>;
    checkMissed(): Promise<void>;
}
