import { env } from './env.js';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
async function bootstrap() {
    if (!env.mongoUri)
        throw new Error('MONGO_URI is missing in backend/.env');
    const app = await NestFactory.create(AppModule, {
        instrument: ObserveInstrument,
    });
    if (env.trustProxy)
        app.set('trust proxy', 1);
    app.enableCors({ origin: env.corsOrigin() });
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.listen(env.port, env.host);
    const logger = new Logger('Bootstrap');
    logger.log(`Listening on ${env.host}:${env.port} (TZ=${process.env.TZ})`);
    if (env.publicUrl)
        logger.log(`Public URL: ${env.publicUrl}`);
}
await bootstrap();
//# sourceMappingURL=main.js.map