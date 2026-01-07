export const HTTP_METHOD = {
  POST: 'POST',
  GET: 'GET',
  PUT: 'PUT',
} as const;

export type HttpMethod = (typeof HTTP_METHOD)[keyof typeof HTTP_METHOD];
