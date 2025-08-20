import { SelectItem } from "@heroui/react";
import HeroSelect from "./HeroSelect";
import eventType from "@/lib/enums/eventType";
import SVGLogo from "@/components/flare/svglogo/SVGLogo";

export default function TypeSelect({required}:{required?:boolean}) {
  return (
    <HeroSelect
      label="Event Type"
      name="type"
      required={required ?? false}
      items={Object.entries(eventType)}
      defaultSelectedKeys={[Object.keys(eventType)[0]]}
      renderValue={(items) => {
        return items.map((item) => (
          <div className="flex items-center gap-4 pb-1" key={item.key}>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
              <SVGLogo color={eventType[item.key as keyof typeof eventType]} size="80%" />
            </div>
            <p>{item.textValue}</p>
          </div>
        ));
      }}
    >
      {Object.entries(eventType).map(([key, value]) => (
        <SelectItem key={key} textValue={key}>
          <div className="flex items-center gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
              <SVGLogo color={value} size="80%" />
            </div>
            <p>{key}</p>
          </div>
        </SelectItem>
      ))}
    </HeroSelect>
  
  );
}