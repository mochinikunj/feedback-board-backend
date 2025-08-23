// request transformer for the Lambda to Express bridge
export function normalizeLambdaRequest(req: any, event: any) {
  if (typeof event.body === 'string') {
    try {
      req.body = JSON.parse(event.body);
    } catch {
      req.body = event.body;
    }
  }
}
