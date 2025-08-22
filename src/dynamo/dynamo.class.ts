import { DynamoDBClient, QueryCommandInput } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { CONFIG } from '../configs/common.config';
import {
  IFeedbackDynamoDbRecord,
  ICreateFeedbackRequest,
  IGetFeedbackRequest,
} from '../models/feedback.model';
import { v4 as uuidv4 } from 'uuid';
import {
  FeedbacksTableIndexNames,
  FeedbacksTableSortingAttributes,
} from '../enums/feedback.enum';

export class DynamoDbOperations {
  private readonly client: DynamoDBClient;
  private readonly docClient: DynamoDBDocumentClient;
  private readonly tableName: string;

  constructor() {
    // creating a dynamo client
    this.client = new DynamoDBClient({
      region: CONFIG.REGION,
    });
    this.docClient = DynamoDBDocumentClient.from(this.client);
    this.tableName = process.env.FEEDBACKS_TABLE_NAME as string;
  }

  async putItemInFeedbacksTable(feedback: ICreateFeedbackRequest) {
    const mn = this.putItemInFeedbacksTable.name;
    try {
      const putItemCommand = new PutCommand({
        TableName: this.tableName,
        Item: {
          id: uuidv4(),
          timestamp: Date.now(),
          ...feedback,
        },
      });
      console.log(`${mn}:`, putItemCommand.input);
      await this.docClient.send(putItemCommand);
    } catch (e: any) {
      console.error(`ERROR ${mn}`, e);
      throw new Error(e);
    }
  }

  async getFeedbacksFromFeedbacksTable(
    request: IGetFeedbackRequest,
  ): Promise<IFeedbackDynamoDbRecord[]> {
    const mn = this.getFeedbacksFromFeedbacksTable.name;
    try {
      const getItemParams: QueryCommandInput = {
        TableName: this.tableName,
      };

      if (request.sortBy === FeedbacksTableSortingAttributes.rating) {
        getItemParams.IndexName =
          FeedbacksTableIndexNames.FeedbacksByRatingIndex;
      }
      if (request.descendingSort) {
        getItemParams.ScanIndexForward = false;
      }

      const getItemCommand = new QueryCommand(getItemParams);
      console.log(`${mn}:`, getItemCommand.input);

      const response = await this.docClient.send(getItemCommand);
      console.log(`${mn}:`, response.Items);

      return response.Items as IFeedbackDynamoDbRecord[];
    } catch (e: any) {
      console.error(`ERROR ${mn}`, e);
      throw new Error(e);
    }
  }
}
