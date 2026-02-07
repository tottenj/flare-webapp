// profilePicOnFileChange.ts
import { auth } from '@/lib/firebase/auth/configs/clientApp';
import uploadFile from '@/lib/storage/uploadFile';
import uploadProfilePicture from '@/lib/serverActions/uploadProfilePicture';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { ClientErrors } from '@/lib/errors/clientErrors/ClientErrors';

export function createProfilePicOnFileChange(router: AppRouterInstance) {
  return async (key: 'avatar', file: File | null) => {
    if (!file) return;
    const extension = file.type.split('/')[1]?.split('+')[0] ?? 'jpg';
    const user = auth.currentUser;
    if (!user) throw ClientErrors.SessionExpired();
    const filePath = `users/${user.uid}/profile-pic/${crypto.randomUUID()}.${extension}`;
    const metadata = await uploadFile(file, filePath);
    const result = await uploadProfilePicture(metadata);
    if (!result.ok) throw ClientErrors.ServerRejected(result.error.message, result.error.code);
    router.refresh();
  };
}
