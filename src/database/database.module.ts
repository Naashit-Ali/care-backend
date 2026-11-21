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

/** Registers every model once so any service can inject any model. */
@Global()
@Module({ imports: [models], exports: [models] })
export class DatabaseModule {}
