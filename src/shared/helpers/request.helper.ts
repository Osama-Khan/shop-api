export const getBearerFromRequest = (request: any): string | undefined =>
  request.headers?.authorization;
