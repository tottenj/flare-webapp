'use client';
import EditProfilePictureButtonPresentational from '@/components/buttons/editProfilePictureButton/EditProfilePictureButtonPresentational';
import { auth } from '@/lib/firebase/auth/configs/clientApp';
import useFileMap from '@/lib/hooks/useFileMap/useFileMap';
import uploadProfilePicture from '@/lib/serverActions/uploadProfilePicture';
import uploadFile from '@/lib/storage/uploadFile';
import { useRouter } from 'next/navigation';
import { ChangeEvent } from 'react';

export default function EditProfilePictureButtonContainer({
  profilePicPath,
}: {
  profilePicPath: string | null;
}) {
  const router = useRouter();
  const { setFile } = useFileMap({
    initial: {
      avatar: null,
    },
    async onFileChange(key, file) {
      if (file) {
        const extension = file?.type.split('/')[1] || 'jpg';

        try {
          const uid = auth.currentUser!.uid;
          const filePath = `users/${uid}/profile-pic.${extension}`;
          const metadata = await uploadFile(file, filePath);
          await uploadProfilePicture(metadata);
          router.refresh();
        } catch (error) {}
      }
    },
  });

  async function onChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setFile('avatar', file);
      e.target.value = '';
    }
  }

  return <EditProfilePictureButtonPresentational onChange={onChange} />;
}
