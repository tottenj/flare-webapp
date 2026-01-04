import { AppError } from "@/lib/errors/AppError";

export default function ensure(condition: unknown, error: AppError): asserts condition{
    if(!condition) throw error
}