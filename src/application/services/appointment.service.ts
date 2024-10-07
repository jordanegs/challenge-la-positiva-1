import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { DynamodbService } from 'src/infrastructure/services/dynamodb.service';
import { CreateInsuredDto } from '../dto/create-appointment.dto';
import { SnsService } from 'src/infrastructure/services/sns.service';
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';

@Injectable()
export class AppointmentService {
  constructor(
    private readonly dynamoDB: DynamodbService,
    private readonly snsService: SnsService,
  ) {}

  async create(createInsuredDto: CreateInsuredDto) {
    const appointmentId = uuidv4();
    const data = { ...createInsuredDto, appointmentId, state: 'pending' };
    const appointment = await this.dynamoDB.insertItem(
      data,
      process.env.APPOINTMENT_TABLE,
    );
    await this.snsService.publish(
      JSON.stringify(appointment),
      createInsuredDto.countryISO,
    );
    return appointment;
  }

  findByInsuredId(insuredId: string) {
    const params = {
      TableName: process.env.APPOINTMENT_TABLE,
      IndexName: 'InsuredIdIndex',
      KeyConditionExpression: 'insuredId = :insuredId',
      ExpressionAttributeValues: {
        ':insuredId': insuredId,
      },
    };
    return this.dynamoDB.findDataByParams(params);
  }

  async updateAppointmentCompleted(appointmentId: string): Promise<void> {
    const params = {
      TableName: process.env.APPOINTMENT_TABLE,
      Key: {
        appointmentId,
      },
      UpdateExpression: 'SET #state = :state',
      ExpressionAttributeNames: {
        '#state': 'state',
      },
      ExpressionAttributeValues: {
        ':state': 'completed',
      },
    };

    await this.dynamoDB.updateByParams(params);
  }
}
