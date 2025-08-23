import { Category } from '../enums/feedback.enum';

export const MOCKED_FEEDBACK_REQUEST = {
  name: 'Test Name',
  message: 'Test message!',
  rating: 4,
};

export const MOCKED_FEEDBACK_RECORD = {
  ...MOCKED_FEEDBACK_REQUEST,
  id: 'f1d0bf73-9e7d-4706-81ec-0f6abee0a23f',
  category: Category.FEEDBACK,
  timestamp: 1755883841907,
};
