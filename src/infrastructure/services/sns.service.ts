import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SnsService {
  private readonly snsClient: SNSClient;

  constructor() {
    this.snsClient = new SNSClient({
      endpoint: process.env.AWS_ENDPOINT,
      region: process.env.AWS_REGION,
    });
  }

  async publish(message: string, type: string) {
    await this.snsClient.send(
      new PublishCommand({
        Message: message,
        TopicArn: process.env.SNS_APPOINTMENT,
        MessageAttributes: {
          type: {
            DataType: 'String',
            StringValue: type,
          },
        },
      }),
    );
  }
}
