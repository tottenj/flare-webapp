interface textInputProps {
  label: string;
  name: string;
  placeholder?: string;
  password?: boolean;
}




export default function TextInput({ label, name, placeholder, password = false }: textInputProps) {
  return (
    <div className="mb-4 flex flex-col">
      <label className="font-nunito mb-2 font-black">{label}</label>
      <input
        className="bg-tertiary text-secondary rounded-2xl p-2 pl-4"
        type={password ? "password" : "text"}
        placeholder={placeholder}
        name={name}
      />
    </div>
  );
}
