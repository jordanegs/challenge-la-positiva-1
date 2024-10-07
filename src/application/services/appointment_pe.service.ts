import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from 'src/domain/models/appointment.entity';
import { SaveAppointmentDto } from '../dto/save-appointment.dto';
import { EventService } from 'src/infrastructure/services/event.service';

@Injectable()
export class AppointmentPeService {
  constructor(
    @InjectRepository(Appointment, process.env.RDS_NAME_PE)
    private readonly appointmentRepository: Repository<Appointment>,
    private readonly eventService: EventService,
  ) {}

  async create(saveAppointmentDto: SaveAppointmentDto): Promise<Appointment> {
    const appointment = this.appointmentRepository.create(saveAppointmentDto);
    const appointmentSaved = await this.appointmentRepository.save(appointment);
    await this.eventService.sendEventCompleted({
      appointmentId: appointment.appointmentId,
    });
    return appointmentSaved;
  }
}
