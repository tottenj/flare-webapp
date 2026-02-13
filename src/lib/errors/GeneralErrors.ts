import { AppError } from "@/lib/errors/AppError";

export const GeneralErrors = {
    Unknown: () => 
        new AppError({
            code: "UNKNOWN",
            clientMessage: "Unknown Error Please Try Again Later",
            status: 500
        }),

    InvalidFileInput: () => 
        new AppError({
            code: "INVALID_INPUT",
            clientMessage: "Invalid File Input, Please Check Your Form Inputs and Try Again",
            status: 500
        })
}