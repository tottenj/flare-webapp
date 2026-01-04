'use client';
import EditProfilePictureButtonPresentational from '@/components/buttons/editProfilePictureButton/EditProfilePictureButtonPresentational';
import useFileMap from '@/lib/hooks/useFileMap/useFileMap';
import validateFileInput from '@/lib/schemas/validateFileInput';
import { createProfilePicOnFileChange } from '@/lib/utils/other/profilePicOnFileChange/createProfilePicOnFileChange';
import { useRouter } from 'next/navigation';
import { ChangeEvent } from 'react';
import { toast } from 'react-toastify';

export default function EditProfilePictureButtonContainer() {
  const router = useRouter();
  const { setFile, isBusy } = useFileMap({
    initial: {
      avatar: null,
    },
    onFileChange: createProfilePicOnFileChange(router),
  });

  async function onChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const error = validateFileInput({ file });
      if (error) {
        toast.error(error);
        e.target.value = '';
        return;
      }
      setFile('avatar', file);
      e.target.value = '';
    }
  }

  return <EditProfilePictureButtonPresentational onChange={onChange} isDisabled={isBusy} />;
}
