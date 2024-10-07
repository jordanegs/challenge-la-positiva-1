import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  QueryCommandInput,
  UpdateCommand,
  UpdateCommandInput,
} from '@aws-sdk/lib-dynamodb';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class DynamodbService {
  private readonly dynamoDBClient: DynamoDBDocumentClient;

  constructor() {
    const client = new DynamoDBClient({
      endpoint: process.env.AWS_ENDPOINT,
      region: process.env.AWS_REGION,
    });
    this.dynamoDBClient = DynamoDBDocumentClient.from(client);
  }

  async insertItem(item: Record<string, unknown>, tableName: string) {
    const params = {
      TableName: tableName,
      Item: item,
    };

    await this.dynamoDBClient.send(new PutCommand(params));
    return item;
  }

  async findDataByParams(params: QueryCommandInput) {
    const command = new QueryCommand(params);
    const response = await this.dynamoDBClient.send(command);

    if (!response.Items || response.Items.length === 0) {
      throw new NotFoundException(`No data found by key`);
    }

    return response.Items;
  }

  updateByParams(params: UpdateCommandInput) {
    const command = new UpdateCommand(params);
    return this.dynamoDBClient.send(command);
  }
}
