import {
  EventBridgeClient,
  PutEventsCommand,
} from '@aws-sdk/client-eventbridge';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EventService {
  private client: EventBridgeClient;

  constructor() {
    this.client = new EventBridgeClient({
      endpoint: process.env.AWS_ENDPOINT,
      region: process.env.AWS_REGION,
    });
  }

  sendEventCompleted(data: Record<string, unknown>) {
    const params = {
      Entries: [
        {
          Source: 'appointment.completed',
          DetailType: 'AppointmentCompleted',
          Detail: JSON.stringify(data),
        },
      ],
    };

    const command = new PutEventsCommand(params);
    return this.client.send(command);
  }
}
