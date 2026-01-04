// profilePicOnFileChange.ts
import { auth } from '@/lib/firebase/auth/configs/clientApp';
import uploadFile from '@/lib/storage/uploadFile';
import uploadProfilePicture from '@/lib/serverActions/uploadProfilePicture';
import { toast } from 'react-toastify';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export function createProfilePicOnFileChange(router: AppRouterInstance) {
  return async (key: 'avatar', file: File | null) => {
    if (!file) return;
    const extension = file.type.split('/')[1]?.split('+')[0] ?? 'jpg';
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error('Session expired. Please sign in again.');
        return;
      }
      const filePath = `users/${user.uid}/profile-pic.${extension}`;
      const metadata = await uploadFile(file, filePath);
      const result = await uploadProfilePicture(metadata);
      if (!result.ok) {
        toast.error(result.error.message);
        return;
      }
      router.refresh();
    } catch {
      toast.error('Unknown Error Please Try Again Later');
      return
    }
  };
}
