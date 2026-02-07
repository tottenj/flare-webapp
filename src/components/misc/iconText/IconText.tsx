import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface IconTextProps {
    text: string;
    icon: IconProp;
    width?:string;
}

export default function IconText({ text, icon, width }: IconTextProps) {
  return (
    <div className="flex items-center gap-4">
      <FontAwesomeIcon width={width ?? "30"} icon={icon} />
      <p>{text}</p>
    </div>
  );
}
