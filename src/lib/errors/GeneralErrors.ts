import { AppError } from "@/lib/errors/AppError";

export const GeneralErrors = {
    Unknown: () => 
        new AppError({
            code: "UNKNOWN",
            clientMessage: "Unknown Error Please Try Again Later",
            status: 500
        })
}