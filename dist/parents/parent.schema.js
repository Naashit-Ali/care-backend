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
let Parent = class Parent {
    name;
    caregiverId;
    token;
    status;
    signedOutAt;
};
__decorate([
    Prop({ required: true, trim: true }),
    __metadata("design:type", String)
], Parent.prototype, "name", void 0);
__decorate([
    Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Caregiver', required: true, index: true }),
    __metadata("design:type", Types.ObjectId)
], Parent.prototype, "caregiverId", void 0);
__decorate([
    Prop({ required: true, unique: true, index: true }),
    __metadata("design:type", String)
], Parent.prototype, "token", void 0);
__decorate([
    Prop({ type: String, enum: ['pending', 'active', 'rejected'], default: 'pending' }),
    __metadata("design:type", String)
], Parent.prototype, "status", void 0);
__decorate([
    Prop(),
    __metadata("design:type", Date)
], Parent.prototype, "signedOutAt", void 0);
Parent = __decorate([
    Schema({ timestamps: true })
], Parent);
export { Parent };
export const ParentSchema = SchemaFactory.createForClass(Parent);
//# sourceMappingURL=parent.schema.js.map