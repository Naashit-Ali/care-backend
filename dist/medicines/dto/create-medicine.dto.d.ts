export declare class CreateMedicineDto {
    name: string;
    dose: string;
    times: string[];
    critical?: boolean;
}
export declare class UpdateMedicineDto {
    name?: string;
    dose?: string;
    times?: string[];
    critical?: boolean;
}
