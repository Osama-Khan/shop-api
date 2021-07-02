export const getBearerFromRequest = (request: any) =>
  request.headers?.authorization;
