import { LocationInput } from "@/lib/schemas/LocationInputSchema";
import BaseFormProps from "@/lib/types/BaseFormProps";

export default interface LocationFormProps extends BaseFormProps {
  locVal: LocationInput | null;
  changeLocVal: (location: LocationInput) => void;
}