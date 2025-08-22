export interface FeedbackRequest {
  name: string;
  message: string;
  rating: number;
}

export interface FeedbackRecord extends FeedbackRequest {
  id: string;
  timestamp: number;
}
