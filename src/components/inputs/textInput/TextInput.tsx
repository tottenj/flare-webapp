import PrimaryLabel from "../labels/primaryLabel/PrimaryLabel";

interface textInputProps {
  label: string;
  name: string;
  placeholder?: string;
  password?: boolean;
  reqired?: boolean
  error?: boolean
  size?: "XLarge" | "Large" | "Medium" | "Small" | "Auto" | "Double"
}




export default function TextInput({ label, name, placeholder, password = false, reqired=true, error = false, size = "Auto" }: textInputProps) {
  const sizeClass = {
    XLarge: 'w-full',
    Large: 'w-3/4',
    Medium: 'w-1/2',
    Small: 'w-1/4',
    Auto: "w-auto",
    Double: "w-5/12"
  }[size];



  return (
    <div className={`mb-4 flex flex-col ${sizeClass}`}>
      <PrimaryLabel label={label}/>
      <input 
        required={reqired}
        className="bg-tertiary text-secondary rounded-2xl p-2 pl-4"
        type={password ? "password" : "text"}
        placeholder={placeholder}
        name={name}
      />
    </div>
  );
}
''