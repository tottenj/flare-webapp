import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip as Tool } from '@heroui/tooltip';

interface toolTipProps {
  children: React.ReactNode;
  text: string;
  placement?: "right" | "left"
}
export default function Tooltip({ children, text, placement = "right" }: toolTipProps) {
  return (
    <div className="flex items-center gap-4">
      {children}
      <Tool
        closeDelay={0}
        delay={0}

        placement={placement}
        classNames={{
          base: [
            'before:bg-secondary',
          ],
        }}
        content={<div className="bg-tertiary rounded-2xl p-2 drop-shadow-2xl border-tertiary border-2">{text}</div>}
      >
        <FontAwesomeIcon icon={faInfoCircle} />
      </Tool>
    </div>
  );
}
