import { NestFactory } from '@nestjs/core';
import { Handler } from 'aws-lambda';
import { AppModule } from 'src/app.module';
import { AppointmentPeService } from 'src/application/services/appointment_pe.service';
import { Appointment } from 'src/domain/models/appointment.entity';

export const handler: Handler = async (event: any) => {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const appointmentService = appContext.get(AppointmentPeService);

  for (const record of event.Records) {
    const body = JSON.parse(record.body);

    if (body.Type === 'Notification') {
      const message = JSON.parse(body.Message) as Appointment;
      await appointmentService.create(message);
    }
  }

  await appContext.close();
};
