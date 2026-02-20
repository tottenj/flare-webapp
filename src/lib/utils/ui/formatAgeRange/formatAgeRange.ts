import { AGE_RANGE_LABEL, AgeRangeValue } from "@/lib/types/AgeRange";

export default function formatAgeRange(ageRange: AgeRangeValue){
    return AGE_RANGE_LABEL[ageRange]
}