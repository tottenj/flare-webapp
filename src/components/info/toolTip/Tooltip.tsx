import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip as Tool } from '@heroui/tooltip';

interface toolTipProps {
  children: React.ReactNode;
  text: string;
  placement?: 'right' | 'left';
}
export default function Tooltip({ children, text, placement = 'right' }: toolTipProps) {
  return (
    <div className="flex items-center ml-2 gap-2">
      {children}
      <Tool
        closeDelay={0}
        delay={0}
        placement={placement}
        classNames={{
          base: ['before:bg-secondary'],
        }}
        content={
          <div>
            <div className="bg-primary text-white border-tertiary w-full lg:w-1/3 rounded-2xl border-2 p-2 drop-shadow-2xl">
              {text}
            </div>
          </div>
        }
      >
        <FontAwesomeIcon icon={faInfoCircle} />
      </Tool>
    </div>
  );
}
