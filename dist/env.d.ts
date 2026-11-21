export declare const env: {
    port: number;
    host: string;
    publicUrl: string;
    mongoUri: string;
    trustProxy: boolean;
    missedGraceMinutes: number;
    takeWindowBeforeMinutes: number;
    pairingCodeTtlMinutes: number;
    corsOrigin(): true | string[];
};
