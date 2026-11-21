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
let PairingCode = class PairingCode {
    code;
    caregiverId;
    parentId;
    expiresAt;
    usedAt;
};
__decorate([
    Prop({ required: true, index: true }),
    __metadata("design:type", String)
], PairingCode.prototype, "code", void 0);
__decorate([
    Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Caregiver', required: true }),
    __metadata("design:type", Types.ObjectId)
], PairingCode.prototype, "caregiverId", void 0);
__decorate([
    Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Parent' }),
    __metadata("design:type", Types.ObjectId)
], PairingCode.prototype, "parentId", void 0);
__decorate([
    Prop({ required: true }),
    __metadata("design:type", Date)
], PairingCode.prototype, "expiresAt", void 0);
__decorate([
    Prop(),
    __metadata("design:type", Date)
], PairingCode.prototype, "usedAt", void 0);
PairingCode = __decorate([
    Schema({ timestamps: true })
], PairingCode);
export { PairingCode };
export const PairingCodeSchema = SchemaFactory.createForClass(PairingCode);
//# sourceMappingURL=pairing-code.schema.js.map