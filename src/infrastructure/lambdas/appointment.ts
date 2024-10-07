import { NestFactory } from '@nestjs/core';
import serverlessExpress from '@codegenie/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';
import { AppModule } from 'src/app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppointmentService } from 'src/application/services/appointment.service';

let server: Handler;

async function bootstrap(): Promise<Handler> {
  const app = await NestFactory.create(AppModule);
  app.useLogger(new Logger());
  app.enableCors({
    origin: ['*'],
    methods: ['*'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  if (event.Records === undefined) {
    server = server ?? (await bootstrap());
    return server(event, context, callback);
  } else {
    const appContext = await NestFactory.createApplicationContext(AppModule);
    const appointmentService = appContext.get(AppointmentService);
    for (const record of event.Records) {
      const body = JSON.parse(record.body);
      await appointmentService.create(body.appointmentId);
    }
    await appContext.close();
  }
};
