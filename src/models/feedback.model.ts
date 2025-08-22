import {
  FeedbacksTableSortingAttributes,
  SortDirection,
} from '../enums/feedback.enum';

export interface ICreateFeedbackRequest {
  name: string;
  message: string;
  rating: number;
}

export interface IFeedbackDynamoDbRecord extends ICreateFeedbackRequest {
  category: string;
  id: string;
  timestamp: number;
}

export interface IGetFeedbackRequest {
  sortBy?: FeedbacksTableSortingAttributes;
  descendingSort?: SortDirection;
}
