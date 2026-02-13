import { AppError } from "@/lib/errors/AppError";

export const EventErrors = {
    MinPriceRequired: () => 
        new AppError({
            code: "MIN_PRICE_REQUIRED",
            clientMessage: "Minimum Price Required For This Price Type",
            status: 400
        }),

    MaxPriceRequired: () => 
        new AppError({
            code: "MAX_PRICE_REQUIRED",
            clientMessage: "Maximum Price Required For This Price Type",
            status: 400
        }),
    InvalidPriceRange: () => 
        new AppError({
            code: "INVALID_PRICE_RANGE",
            clientMessage: "Invalid Price Range",
            status: 400
        }),

    InvalidTimeRange: () => 
        new AppError({
            code: "INVALID_TIME_RANGE",
            clientMessage: "Invalid Date or Time Range",
            status: 400
        }),
    InvalidTagNumber: () => 
        new AppError({
            code: "INVALID_TAG_NUMBER",
            clientMessage: "Cannot Add More Than 5 Tags To an Event",
            status: 400
        })
}