var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, Types } from 'mongoose';
let Dose = class Dose {
    medicineId;
    parentId;
    caregiverId;
    medicineName;
    dose;
    critical;
    date;
    scheduledAt;
    status;
    takenAt;
    missedAt;
};
__decorate([
    Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Medicine', required: true }),
    __metadata("design:type", Types.ObjectId)
], Dose.prototype, "medicineId", void 0);
__decorate([
    Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Parent', required: true, index: true }),
    __metadata("design:type", Types.ObjectId)
], Dose.prototype, "parentId", void 0);
__decorate([
    Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Caregiver', required: true, index: true }),
    __metadata("design:type", Types.ObjectId)
], Dose.prototype, "caregiverId", void 0);
__decorate([
    Prop({ required: true }),
    __metadata("design:type", String)
], Dose.prototype, "medicineName", void 0);
__decorate([
    Prop({ required: true }),
    __metadata("design:type", String)
], Dose.prototype, "dose", void 0);
__decorate([
    Prop({ default: false }),
    __metadata("design:type", Boolean)
], Dose.prototype, "critical", void 0);
__decorate([
    Prop({ required: true }),
    __metadata("design:type", String)
], Dose.prototype, "date", void 0);
__decorate([
    Prop({ required: true }),
    __metadata("design:type", Date)
], Dose.prototype, "scheduledAt", void 0);
__decorate([
    Prop({ type: String, enum: ['pending', 'taken', 'missed'], default: 'pending' }),
    __metadata("design:type", String)
], Dose.prototype, "status", void 0);
__decorate([
    Prop(),
    __metadata("design:type", Date)
], Dose.prototype, "takenAt", void 0);
__decorate([
    Prop(),
    __metadata("design:type", Date)
], Dose.prototype, "missedAt", void 0);
Dose = __decorate([
    Schema({ timestamps: true })
], Dose);
export { Dose };
export const DoseSchema = SchemaFactory.createForClass(Dose);
DoseSchema.index({ medicineId: 1, scheduledAt: 1 }, { unique: true });
DoseSchema.index({ status: 1, scheduledAt: 1 });
//# sourceMappingURL=dose.schema.js.map