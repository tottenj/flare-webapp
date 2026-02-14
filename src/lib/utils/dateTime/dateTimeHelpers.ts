import { parseZonedDateTime } from "@internationalized/date";

export function parseZonedToUTC(input: string):{utcDate:Date, timeZone:string}{
    const zdt = parseZonedDateTime(input)
    return{
        utcDate: zdt.toDate(),
        timeZone: zdt.timeZone
    }
}

export function parseZonedToISO(input: string): {isoDate:string, timeString:string, timeZone:string}{
    const dt = parseZonedDateTime(input)
    return{
        isoDate: dt.toDate().toISOString(),
        timeString: dt.toDate().toLocaleTimeString([],{
            hour: "2-digit",
            minute: "2-digit"
        }),
        timeZone: dt.timeZone
    }
}