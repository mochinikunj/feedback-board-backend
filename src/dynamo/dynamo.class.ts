import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
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
      const putItemParams = new PutCommand({
        TableName: this.tableName,
        Item: {
          id: uuidv4(),
          timestamp: Date.now(),
          ...feedback,
        },
      });
      console.log(`${mn}:`, putItemParams.input);
      await this.docClient.send(putItemParams);
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
      let indexName = FeedbacksTableIndexNames.FeedbacksByTimestampIndex;
      if (request.sortBy === FeedbacksTableSortingAttributes.rating) {
        indexName = FeedbacksTableIndexNames.FeedbacksByRatingIndex;
      }

      const getItemParams = new QueryCommand({
        TableName: this.tableName,
        IndexName: indexName,
        ScanIndexForward: request.ascendingSort,
      });
      console.log(`${mn}:`, getItemParams.input);

      const response = await this.docClient.send(getItemParams);
      console.log(`${mn}:`, response.Items);
      return response.Items as IFeedbackDynamoDbRecord[];
    } catch (e: any) {
      console.error(`ERROR ${mn}`, e);
      throw new Error(e);
    }
  }
}
