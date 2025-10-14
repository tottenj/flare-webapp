import { SelectItem } from '@heroui/react';
import HeroSelect from './HeroSelect';
import eventType, { eventTypeKeys } from '@/lib/enums/eventType';
import SVGLogo from '@/components/flare/svglogo/SVGLogo';

export default function TypeSelect({ required }: { required?: boolean }) {
  return (
    <HeroSelect
      label="Event Type"
      name="type"
      required={required ?? false}
      defaultSelectedKeys={['Special Events']} // 👈 one of the enum keys
      renderValue={(items) =>
        items.map((item) => (
          <div className="flex items-center gap-4 pb-1" key={item.key}>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
              <SVGLogo color={eventType[item.key as keyof typeof eventType]} size="80%" />
            </div>
            <p>{item.textValue}</p>
          </div>
        ))
      }
    >
      {eventTypeKeys.map((key) => (
        <SelectItem key={key} textValue={key}>
          <div className="flex items-center gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
              <SVGLogo color={eventType[key]} size="80%" />
            </div>
            <p>{key}</p>
          </div>
        </SelectItem>
      ))}
    </HeroSelect>
  );
}
