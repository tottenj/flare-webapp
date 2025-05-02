interface textInputProps {
  label: string;
  name: string;
  placeholder?: string;
}

export default function TextInput({ label, name, placeholder }: textInputProps) {



  return (
    <div className="flex flex-col mb-4">
      <label className="font-nunito font-black mb-2">{label}</label>
      <input className="p-2 pl-4 bg-tertiary rounded-2xl text-secondary" type="text" placeholder={placeholder} name={name} />
    </div>
  );
}
