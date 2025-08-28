'use client';
import useCustomUseForm from '@/lib/hooks/useForm/useCustomUseForm';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface deleteButtonProps {
  formAction: (prevState:any, formData: FormData) => Promise<any>;
  id: string;
}

export default function DeleteButton({ formAction, id }: deleteButtonProps) {
  const { action, pending } = useCustomUseForm(formAction, 'Deleted Event');

  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <button
        disabled={pending}
        type="submit"
        className="pointer-cursor gradient group flex h-[30px] w-[30px] items-center justify-center rounded-full border-2 p-1 transition-transform duration-200 ease-in-out hover:scale-110"
      >
        <FontAwesomeIcon
          className="group-hover:text-foreground text-white ease-in-out"
          icon={faTrashCan}
        />
      </button>
    </form>
  );
}
