interface submitButtonProps {
  text?: string;
  disabled?: boolean
}

export default function SubmitButton({ text = 'Submit', disabled= false }: submitButtonProps) {
  return (
    <button disabled={disabled} className="border-primary font-nunito hover:text-primary bg-primary mt-4 w-full cursor-pointer rounded-xl border-2 p-2 font-bold text-white transition-all duration-300 ease-in-out hover:bg-white">
      {text}
    </button>
  );
}
