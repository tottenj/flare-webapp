import { ClientErrors } from "@/lib/errors/clientErrors/ClientErrors";
import { ApiError } from "@/lib/types/responses/ApiResponse";

export default function mapApiErrorToClientError(error: ApiError['error']) {
  switch (error.code) {
    case 'AUTH_INVALID_SESSION':
      return ClientErrors.SessionExpired();

    case 'FILE_UPLOAD_FAILED':
      return ClientErrors.UploadFailed();

    default:
      return ClientErrors.ServerRejected(error.message, error.code);
  }
}
