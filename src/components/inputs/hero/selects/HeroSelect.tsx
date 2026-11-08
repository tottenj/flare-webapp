import type { ReactElement, ReactNode, SelectHTMLAttributes } from 'react';

export interface HeroSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  children?: ReactNode;
  isRequired?: boolean;
}

interface HeroSelectComponent {
  (props: HeroSelectProps): ReactElement;
  Item: (props: { children?: ReactNode; value?: string; textValue?: string }) => ReactElement;
}

const HeroSelect = (({ label, isRequired, children, ...props }: HeroSelectProps) => (
  <label className="flex w-full flex-col gap-1">
    {label && <span>{label}</span>}
    <select
      required={props.required ?? isRequired}
      {...props}
      className={`min-h-11 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 ${props.className ?? ''}`}
    >
      {children}
    </select>
  </label>
)) as HeroSelectComponent;

HeroSelect.Item = ({ children, value, textValue }) => (
  <option value={value ?? textValue}>{children}</option>
);

export default HeroSelect;
