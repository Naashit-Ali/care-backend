try {
    process.loadEnvFile();
}
catch {
}
process.env.TZ ||= 'Europe/Budapest';
export const env = {
    port: Number(process.env.PORT ?? 3000),
    host: process.env.HOST ?? '0.0.0.0',
    publicUrl: process.env.PUBLIC_URL ?? '',
    mongoUri: process.env.MONGO_URI ?? '',
    trustProxy: process.env.TRUST_PROXY === 'true',
    missedGraceMinutes: Number(process.env.MISSED_GRACE_MINUTES ?? 15),
    takeWindowBeforeMinutes: Number(process.env.TAKE_WINDOW_BEFORE_MINUTES ?? 15),
    pairingCodeTtlMinutes: Number(process.env.PAIRING_CODE_TTL_MINUTES ?? 15),
    corsOrigin() {
        const raw = process.env.CORS_ORIGIN?.trim();
        if (!raw || raw === '*')
            return true;
        return raw.split(',').map((o) => o.trim());
    },
};
//# sourceMappingURL=env.js.map