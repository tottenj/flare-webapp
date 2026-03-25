import { ClientErrors } from "@/lib/errors/clientErrors/ClientErrors";
import mapApiErrorToClientError from "@/lib/mappers/mapApiErrorToClientError/mapApiErrorToClientError";
import { EditEventData, editEventDataSchema } from "@/lib/schemas/event/editEventDataSchema";
import { ApiResponse } from "@/lib/types/responses/ApiResponse";

export default async function fetchEditData(eventId: string): Promise<EditEventData> {
  const res = await fetch(`/api/events/${eventId}/edit-data`);
  const json: ApiResponse<EditEventData> = await res.json();

  if (!res.ok) {
    if ('error' in json) {
      throw mapApiErrorToClientError(json.error);
    }
    throw ClientErrors.ServerRejected('Unknown error');
  }

  if (!('data' in json)) {
    throw ClientErrors.ServerRejected('Malformed response');
  }

  const parsed = editEventDataSchema.safeParse(json.data);
  if (!parsed.success) {
    throw ClientErrors.ServerRejected('Invalid server data');
  }

  return parsed.data;
}
