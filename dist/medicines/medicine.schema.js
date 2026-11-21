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
export const scheduleStart = (med) => med.scheduleFrom ?? med.createdAt;
let Medicine = class Medicine {
    parentId;
    caregiverId;
    name;
    dose;
    times;
    critical;
    active;
    scheduleFrom;
};
__decorate([
    Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Parent', required: true, index: true }),
    __metadata("design:type", Types.ObjectId)
], Medicine.prototype, "parentId", void 0);
__decorate([
    Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Caregiver', required: true }),
    __metadata("design:type", Types.ObjectId)
], Medicine.prototype, "caregiverId", void 0);
__decorate([
    Prop({ required: true, trim: true }),
    __metadata("design:type", String)
], Medicine.prototype, "name", void 0);
__decorate([
    Prop({ required: true, trim: true }),
    __metadata("design:type", String)
], Medicine.prototype, "dose", void 0);
__decorate([
    Prop({ type: [String], required: true }),
    __metadata("design:type", Array)
], Medicine.prototype, "times", void 0);
__decorate([
    Prop({ default: false }),
    __metadata("design:type", Boolean)
], Medicine.prototype, "critical", void 0);
__decorate([
    Prop({ default: true }),
    __metadata("design:type", Boolean)
], Medicine.prototype, "active", void 0);
__decorate([
    Prop(),
    __metadata("design:type", Date)
], Medicine.prototype, "scheduleFrom", void 0);
Medicine = __decorate([
    Schema({ timestamps: true })
], Medicine);
export { Medicine };
export const MedicineSchema = SchemaFactory.createForClass(Medicine);
//# sourceMappingURL=medicine.schema.js.map