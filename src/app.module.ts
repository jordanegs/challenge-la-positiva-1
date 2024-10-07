import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentController } from './infrastructure/controllers/appointment.controller';
import { SnsService } from './infrastructure/services/sns.service';
import { AppointmentService } from './application/services/appointment.service';
import { DynamodbService } from './infrastructure/services/dynamodb.service';
import { Appointment } from './domain/models/appointment.entity';
import { AppointmentPeService } from './application/services/appointment_pe.service';
import { AppointmentClService } from './application/services/appointment_cl.service';
import { EventService } from './infrastructure/services/event.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      name: process.env.RDS_NAME_PE,
      type: 'mysql',
      port: 3306,
      host: process.env.RDS_HOST_PE,
      username: process.env.RDS_USER_PE,
      password: process.env.RDS_PASSWORD_PE,
      database: process.env.RDS_DB_PE,
      synchronize: true,
      entities: [Appointment],
    }),
    TypeOrmModule.forRoot({
      name: process.env.RDS_NAME_CL,
      type: 'mysql',
      port: 3306,
      host: process.env.RDS_HOST_CL,
      username: process.env.RDS_USER_CL,
      password: process.env.RDS_PASSWORD_CL,
      database: process.env.RDS_DB_CL,
      synchronize: true,
      entities: [Appointment],
    }),
    TypeOrmModule.forFeature([Appointment], process.env.RDS_NAME_PE),
    TypeOrmModule.forFeature([Appointment], process.env.RDS_NAME_CL),
  ],
  controllers: [AppointmentController],
  providers: [
    SnsService,
    AppointmentService,
    DynamodbService,
    AppointmentPeService,
    AppointmentClService,
    EventService,
  ],
})
export class AppModule {}
