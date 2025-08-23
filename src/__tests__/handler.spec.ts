import { app } from '../handler';
import supertest from 'supertest';
import { mockClient } from 'aws-sdk-client-mock';
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { Status } from '../enums/feedback.enum';
import {
  MOCKED_FEEDBACK_RECORD,
  MOCKED_FEEDBACK_REQUEST,
} from '../__mocks__/handler.mock';
import { normalizeLambdaRequest } from '../utils/utils';

const ddbMock = mockClient(DynamoDBDocumentClient);

describe('handler.ts', () => {
  beforeEach(() => {
    ddbMock.reset();
  });

  it('Should call health-check api', async () => {
    const result = await supertest(app).get('/health-check').expect(200);
    expect(result.body.status).toBe(Status.OK);
  });

  it('Should create feedback and store it in dynamo', async () => {
    ddbMock.on(PutCommand).resolves({});

    const result = await supertest(app)
      .post('/feedback')
      .send(MOCKED_FEEDBACK_REQUEST)
      .expect(200);
    expect(result.body.status).toBe(Status.OK);
  });

  it('Should return 400 when create feedback request validation fails', async () => {
    ddbMock.on(PutCommand).resolves({});
    await supertest(app)
      .post('/feedback')
      .send({ ...MOCKED_FEEDBACK_REQUEST, rating: 6 })
      .expect(400);
  });

  it('Should handle when create feedback dynamo operation fails', async () => {
    ddbMock.on(PutCommand).rejects();
    await supertest(app)
      .post('/feedback')
      .send(MOCKED_FEEDBACK_REQUEST)
      .expect(500);
  });

  it('Should get feedbacks from dynamo', async () => {
    ddbMock.on(QueryCommand).resolves({ Items: [MOCKED_FEEDBACK_RECORD] });

    const result = await supertest(app).get('/feedback').expect(200);
    expect(result.body.status).toBe(Status.OK);
    expect(result.body.body[0].rating).toBe(4);
  });

  it('Should get feedbacks from dynamo with sorting', async () => {
    ddbMock.on(QueryCommand).resolves({ Items: [MOCKED_FEEDBACK_RECORD] });

    const result = await supertest(app)
      .get('/feedback?sortBy=rating&descendingSort=desc')
      .expect(200);
    expect(result.body.status).toBe(Status.OK);
    expect(result.body.body[0].rating).toBe(4);
  });

  it('Should handle when get feedbacks from dynamo fails', async () => {
    ddbMock.on(QueryCommand).rejects();
    await supertest(app).get('/feedback').expect(500);
  });

  it('Should cover normalizeLambdaRequest function with passing event.body as string', () => {
    const request = { body: {} };
    const event = { body: JSON.stringify(MOCKED_FEEDBACK_REQUEST) };

    normalizeLambdaRequest(request, event);
    expect(request.body).toEqual(MOCKED_FEEDBACK_REQUEST);
  });

  it('Should cover normalizeLambdaRequest function with passing event.body as Incorrect JSON string', () => {
    const request = { body: '' };
    const event = { body: 'Incorrect String to be JSON!' };

    normalizeLambdaRequest(request, event);
    expect(request.body).toEqual(event.body);
  });

  it('Should not go inside if condition in normalizeLambdaRequest function when passing event.body as JSON', () => {
    const request = { body: {} };
    const event = { body: MOCKED_FEEDBACK_REQUEST };

    normalizeLambdaRequest(request, event);
    expect(request.body).toEqual({});
  });
});
