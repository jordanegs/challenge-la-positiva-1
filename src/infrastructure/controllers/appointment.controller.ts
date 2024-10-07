import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { CreateInsuredDto } from 'src/application/dto/create-appointment.dto';
import { AppointmentService } from 'src/application/services/appointment.service';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post('')
  async create(@Body() createInsuredDto: CreateInsuredDto) {
    const appointment = await this.appointmentService.create(createInsuredDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Appointment created successfully',
      data: appointment,
    };
  }

  @Get(':id')
  async getByInsuredId(@Param('id') id: string) {
    const appointments = await this.appointmentService.findByInsuredId(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Appointments',
      data: appointments,
    };
  }
}
