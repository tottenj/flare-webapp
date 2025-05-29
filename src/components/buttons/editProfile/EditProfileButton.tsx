'use client';

import { useActionState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import uploadProfilePicture from '@/lib/firebase/storage/uploadProfilePicture';
import { useActionToast } from '@/lib/hooks/useActionToast/useActionToast';

export default function EditProfileButton() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const initialState = { message: '' };
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = () => {
    formRef.current?.requestSubmit();
  };

  const [state, action, pending] = useActionState(uploadProfilePicture, initialState);

  useActionToast(state, pending, {
    successMessage: 'Successfully Changed Profile Picture',
    loadingMessage: 'Loading',
  });

  return (
    <form
      ref={formRef}
      action={action}
      encType="multipart/form-data"
      method="post"
      className="inline"
    >
      <button
        type="button"
        onClick={handleClick}
        className="pointer-cursor gradient group relative bottom-8 left-[75px] flex h-[30px] w-[30px] items-center justify-center rounded-full border-2 p-1"
      >
        <FontAwesomeIcon
          className="group-hover:text-foreground text-white ease-in-out"
          icon={faPencil}
        />
      </button>

      <input
        type="file"
        name="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
        required
      />
    </form>
  );
}
