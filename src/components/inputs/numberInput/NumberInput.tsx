import { CSSProperties, HTMLInputTypeAttribute, Ref } from 'react';
import PrimaryLabel from '../labels/primaryLabel/PrimaryLabel';

interface numberInputProps {
  label: string;
  name: string;
  placeholder?: string;
  type?: 'password' | 'text' | 'email';
  reqired?: boolean;
  error?: boolean;
  size?: 'XLarge' | 'Large' | 'Medium' | 'Small' | 'Auto' | 'Double';
  onChange?: (newVal: string) => void;
  errorText?: string;
  showErrorText?: boolean;
  testId?: string;
  styleOverDiv?: CSSProperties;
  ref?: Ref<HTMLInputElement>;
  defaultVal?: number;
}

export default function NumberInput({
  defaultVal,
  label,
  name,
  placeholder,
  styleOverDiv,
  ref,
  showErrorText = false,
  testId = name,
  reqired = true,
  size = 'Auto',
  onChange,
  errorText,

}: numberInputProps) {
  const sizeClass = {
    XLarge: 'w-full',
    Large: 'w-3/4',
    Medium: 'w-1/2',
    Small: 'w-1/4',
    Auto: 'w-auto',
    Double: 'w-5/12',
  }[size];

  return (
    <div style={styleOverDiv} className={`mb-4 flex flex-col ${sizeClass}`}>
      <PrimaryLabel label={label} />
      <input
        defaultValue={defaultVal}
        ref={ref}
        data-testid={testId}
        required={reqired}
        className="bg-tertiary text-secondary rounded-2xl p-2 pl-4"
        type="number"
        placeholder={placeholder}
        name={name}
        min={0}
        onChange={(e) => onChange && onChange(e.target.value)}
      />
      {showErrorText && errorText && <p className={`errorText`}>{errorText}</p>}
    </div>
  );
}
