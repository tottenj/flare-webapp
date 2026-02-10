import HeroBasicSelect, {
  BasicSelectExtender,
} from '@/components/inputs/hero/selects/basicSelect/HeroBasicSelect';
import { PRICE_TYPE_OPTIONS, PriceTypeValue } from '@/lib/types/PriceType';

export default function PriceTypeSelect({ required, value, onChange }: BasicSelectExtender<PriceTypeValue>) {
  return (
    <HeroBasicSelect
      items={PRICE_TYPE_OPTIONS}
      name="priceType"
      label="Price Type"
      required={required}
      value={value}
      onChange={onChange}
    />
  );
}
