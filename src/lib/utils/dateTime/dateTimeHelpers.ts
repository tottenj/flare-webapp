import { parseZonedDateTime, ZonedDateTime } from "@internationalized/date";

export function parseZonedToUTC(input: string):{utcDate:Date, timeZone:string}{
    const zdt = parseZonedDateTime(input)
    return{
        utcDate: zdt.toDate(),
        timeZone: zdt.timeZone
    }
}