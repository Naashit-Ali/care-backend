import { ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsOptional, IsString, Length, Matches } from 'class-validator';

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

export class CreateMedicineDto {
  @IsString() @Length(1, 60) name: string;
  @IsString() @Length(1, 60) dose: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(6)
  @Matches(TIME_RE, { each: true, message: 'Times must be HH:mm' })
  times: string[];

  @IsOptional() @IsBoolean() critical?: boolean;
}

export class UpdateMedicineDto {
  @IsOptional() @IsString() @Length(1, 60) name?: string;
  @IsOptional() @IsString() @Length(1, 60) dose?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(6)
  @Matches(TIME_RE, { each: true, message: 'Times must be HH:mm' })
  times?: string[];

  @IsOptional() @IsBoolean() critical?: boolean;
}
