import { CSSProperties, HTMLInputTypeAttribute, Ref } from "react";
import PrimaryLabel from "../labels/primaryLabel/PrimaryLabel";
import { ref } from "process";

interface textAreaProps {
  label: string;
  name: string;
  placeholder?: string;
  reqired?: boolean;
  error?: boolean;
  size?: 'XLarge' | 'Large' | 'Medium' | 'Small' | 'Auto' | 'Double';
  onChange?: (newVal: string) => void;
  errorText?: string;
  showErrorText?: boolean;
  testId?: string;
  styleOverDiv?: CSSProperties;
}




export default function TextArea({ label, name, placeholder, styleOverDiv, showErrorText = false, testId = name, reqired=true, error = false, size = "Auto", onChange, errorText }: textAreaProps) {
  const sizeClass = {
    XLarge: 'w-full',
    Large: 'w-3/4',
    Medium: 'w-1/2',
    Small: 'w-1/4',
    Auto: "w-auto",
    Double: "w-5/12"
  }[size];



  return (
    <div style={styleOverDiv} className={`mb-4 flex flex-col ${sizeClass}`}>
      <PrimaryLabel label={label}/>
      <textarea 
        data-testid={testId}
        required={reqired}
        className="bg-tertiary text-secondary rounded-2xl p-2 pl-4 min-h-[150px]"
        placeholder={placeholder}
        name={name}
        onChange={(e) => onChange && onChange(e.target.value)}
      />
      {showErrorText && errorText && <p className={`errorText`}>{errorText}</p>}
    </div>
  );
}