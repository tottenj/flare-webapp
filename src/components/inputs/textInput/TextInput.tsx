import { CSSProperties, HTMLInputTypeAttribute, Ref } from "react";
import PrimaryLabel from "../labels/primaryLabel/PrimaryLabel";
import { ref } from "process";

interface textInputProps {
  label: string;
  name: string;
  placeholder?: string;
  type?: 'password' | 'text' | 'email' | "url";
  reqired?: boolean;
  error?: boolean;
  size?: 'XLarge' | 'Large' | 'Medium' | 'Small' | 'Auto' | 'Double';
  onChange?: (newVal: string) => void;
  errorText?: string;
  showErrorText?: boolean;
  testId?: string;
  styleOverDiv?: CSSProperties;
  ref?: Ref<HTMLInputElement>;
  defaultVal?: string
}




export default function TextInput({ label, name, placeholder, styleOverDiv, ref, showErrorText = false, testId = name, type = "text", reqired=true, error = false, size = "Auto", onChange, errorText, defaultVal }: textInputProps) {
  const sizeClass = {
    XLarge: 'w-full',
    Large: 'w-3/4',
    Medium: 'w-1/2',
    Small: 'w-1/4',
    Auto: "w-auto",
    Double: "w-5/12"
  }[size];



  return (
    <div style={styleOverDiv} className={`mb-4 lg:mt-0 flex flex-col ${sizeClass}`}>
      <PrimaryLabel label={label}/>
      <input 
        ref={ref}
        data-testid={testId}
        required={reqired}
        className="bg-tertiary text-secondary rounded-2xl p-2 pl-4"
        type={type}
        placeholder={placeholder}
        name={name}
        onChange={(e) => onChange && onChange(e.target.value)}
       defaultValue={defaultVal}
      />
      {showErrorText && errorText && <p className={`errorText`}>{errorText}</p>}
    </div>
  );
}
