
import HeroBasicSelect from '@/components/inputs/hero/selects/basicSelect/HeroBasicSelect';
import { PRICE_TYPE_OPTIONS } from '@/lib/types/PriceType';

export default function PriceTypeSelect({ required }: { required?: boolean }) {
  return (
    <HeroBasicSelect
      items={PRICE_TYPE_OPTIONS}
      name="priceType"
      label="Price Type"
      required={required}
    />
  );
}
