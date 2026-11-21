var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsOptional, IsString, Length, Matches } from 'class-validator';
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
export class CreateMedicineDto {
    name;
    dose;
    times;
    critical;
}
__decorate([
    IsString(),
    Length(1, 60),
    __metadata("design:type", String)
], CreateMedicineDto.prototype, "name", void 0);
__decorate([
    IsString(),
    Length(1, 60),
    __metadata("design:type", String)
], CreateMedicineDto.prototype, "dose", void 0);
__decorate([
    IsArray(),
    ArrayMinSize(1),
    ArrayMaxSize(6),
    Matches(TIME_RE, { each: true, message: 'Times must be HH:mm' }),
    __metadata("design:type", Array)
], CreateMedicineDto.prototype, "times", void 0);
__decorate([
    IsOptional(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], CreateMedicineDto.prototype, "critical", void 0);
export class UpdateMedicineDto {
    name;
    dose;
    times;
    critical;
}
__decorate([
    IsOptional(),
    IsString(),
    Length(1, 60),
    __metadata("design:type", String)
], UpdateMedicineDto.prototype, "name", void 0);
__decorate([
    IsOptional(),
    IsString(),
    Length(1, 60),
    __metadata("design:type", String)
], UpdateMedicineDto.prototype, "dose", void 0);
__decorate([
    IsOptional(),
    IsArray(),
    ArrayMinSize(1),
    ArrayMaxSize(6),
    Matches(TIME_RE, { each: true, message: 'Times must be HH:mm' }),
    __metadata("design:type", Array)
], UpdateMedicineDto.prototype, "times", void 0);
__decorate([
    IsOptional(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], UpdateMedicineDto.prototype, "critical", void 0);
//# sourceMappingURL=create-medicine.dto.js.map