var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Caregiver, CaregiverSchema } from '../caregivers/caregiver.schema.js';
import { Dose, DoseSchema } from '../doses/dose.schema.js';
import { Medicine, MedicineSchema } from '../medicines/medicine.schema.js';
import { PairingCode, PairingCodeSchema } from '../pairing/pairing-code.schema.js';
import { Parent, ParentSchema } from '../parents/parent.schema.js';
const models = MongooseModule.forFeature([
    { name: Caregiver.name, schema: CaregiverSchema },
    { name: PairingCode.name, schema: PairingCodeSchema },
    { name: Parent.name, schema: ParentSchema },
    { name: Medicine.name, schema: MedicineSchema },
    { name: Dose.name, schema: DoseSchema },
]);
let DatabaseModule = class DatabaseModule {
};
DatabaseModule = __decorate([
    Global(),
    Module({ imports: [models], exports: [models] })
], DatabaseModule);
export { DatabaseModule };
//# sourceMappingURL=database.module.js.map