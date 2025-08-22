import { FeedbacksTableSortingAttributes } from '../enums/feedback.enum';

export interface ICreateFeedbackRequest {
  name: string;
  message: string;
  rating: number;
}

export interface IFeedbackDynamoDbRecord extends ICreateFeedbackRequest {
  id: string;
  timestamp: number;
}

export interface IGetFeedbackRequest {
  sortBy: FeedbacksTableSortingAttributes;
  ascendingSort: boolean;
}
