import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { CONFIG } from '../configs/common.config';
import { FeedbackRecord, FeedbackRequest } from '../models/feedback.model';
import { v4 as uuidv4 } from 'uuid';

enum FeedbacksTableIndexNames {
  FeedbacksByTimestampIndex = 'FeedbacksByTimestampIndex',
  FeedbacksByRatingIndex = 'FeedbacksByRatingIndex',
}

enum FeedbacksTableSortingAttributes {
  timestamp = 'timestamp',
  rating = 'rating',
}

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

  async putItemInFeedbacksTable(feedback: FeedbackRequest) {
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
    sortBy: FeedbacksTableSortingAttributes,
    ascendingSort = true,
  ): Promise<FeedbackRecord[]> {
    const mn = this.getFeedbacksFromFeedbacksTable.name;
    try {
      let indexName = FeedbacksTableIndexNames.FeedbacksByTimestampIndex;
      if (sortBy === FeedbacksTableSortingAttributes.rating) {
        indexName = FeedbacksTableIndexNames.FeedbacksByRatingIndex;
      }

      const getItemParams = new QueryCommand({
        TableName: this.tableName,
        IndexName: indexName,
        ScanIndexForward: ascendingSort,
      });
      console.log(`${mn}:`, getItemParams.input);

      const response = await this.docClient.send(getItemParams);
      console.log(`${mn}:`, response.Items);
      return response.Items as FeedbackRecord[];
    } catch (e: any) {
      console.error(`ERROR ${mn}`, e);
      throw new Error(e);
    }
  }
}
