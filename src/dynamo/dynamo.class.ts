import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  QueryCommandInput,
} from '@aws-sdk/lib-dynamodb';
import { CONFIG } from '../configs/common.config';
import {
  IFeedbackDynamoDbRecord,
  ICreateFeedbackRequest,
  IGetFeedbackRequest,
} from '../models/feedback.model';
import { v4 as uuidv4 } from 'uuid';
import {
  Category,
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
      // creating params to create & store feedback record in dynamo
      const putItemCommand = new PutCommand({
        TableName: this.tableName,
        Item: {
          id: uuidv4(),
          timestamp: Date.now(),
          category: Category.FEEDBACK,
          ...feedback,
        },
      });
      console.log(`${mn}:`, putItemCommand.input);

      // making send call to execute the PutCommand operation on dynamo
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
      // creating params to fetch all feedback records from dynamo
      const queryCommandParams: QueryCommandInput = {
        TableName: this.tableName,
        KeyConditionExpression: 'category = :category',
        ExpressionAttributeValues: {
          ':category': Category.FEEDBACK,
        },
      };

      // if UI specifically passes the sortBy column then we're using index specific for that column
      if (request.sortBy === FeedbacksTableSortingAttributes.RATING) {
        queryCommandParams.IndexName =
          FeedbacksTableIndexNames.FeedbacksByRatingIndex;
      }

      // if UI specifically passes the descendingSort then we're updating ScanIndexForward to false
      if (request.descendingSort) {
        queryCommandParams.ScanIndexForward = false;
      }

      // generatin a final QueryCommand using params created above
      const getItemCommand = new QueryCommand(queryCommandParams);
      console.log(`${mn}:`, getItemCommand.input);

      // making send call to execute the QueryCommand operation on dynamo
      const response = await this.docClient.send(getItemCommand);
      console.log(`${mn}:`, response.Items);

      // retunrning the feedback list back to the api handler
      return response.Items as IFeedbackDynamoDbRecord[];
    } catch (e: any) {
      console.error(`ERROR ${mn}`, e);
      throw new Error(e);
    }
  }
}
