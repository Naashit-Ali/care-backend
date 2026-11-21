import { Model } from 'mongoose';
import { Caregiver } from '../caregivers/caregiver.schema.js';
import { Parent, ParentStatus } from '../parents/parent.schema.js';
export type AuthUser = {
    role: 'caregiver';
    id: string;
    name: string;
} | {
    role: 'parent';
    id: string;
    name: string;
    status: ParentStatus;
    caregiverId: string;
};
export declare class AuthService {
    private caregivers;
    private parents;
    constructor(caregivers: Model<Caregiver>, parents: Model<Parent>);
    findByToken(token: unknown): Promise<AuthUser | null>;
}
