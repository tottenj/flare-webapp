import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

interface fileInput {
  name: string;
  buttonText?: string;
  required?: boolean;
  onChange: (file: File) => void;
  fileAdded?: boolean;
}



export default function FileInput({
  name,
  buttonText = 'Proof of Ownership',
  required = false,
  onChange,
  fileAdded = false,
}: fileInput) {
  return (
    <>
      <label
        className={`${fileAdded ? 'bg-green' : 'bg-primary'} text-white w-full font-nunito hover:bg-background hover:border-primary hover:text-primary flex w-fit cursor-pointer items-center justify-center rounded-xl border-2 p-2 text-xs font-bold transition transition-normal ease-in-out`}
      >
        {fileAdded ? <FontAwesomeIcon icon={faCheck} /> : buttonText}
        <input
          data-cy={`${name}-input`}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onChange(file);
          }}
          required={required}
          className="hidden"
          type="file"
          name={name}
        />
      </label>
    </>
  );
}
