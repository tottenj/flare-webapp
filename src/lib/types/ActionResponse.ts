export interface ActionResponse {
  status?: 'success' | 'error';
  message: string;
  errors?: Record<string, string[]>; // optional object of field errors
  eventId?: string | null
}
