// profilePicOnFileChange.ts
import { auth } from '@/lib/firebase/auth/configs/clientApp';
import uploadFile from '@/lib/storage/uploadFile';
import { ClientErrors } from '@/lib/errors/clientErrors/ClientErrors';

export async function basicFileUpload(file: File, pathStart: string, pathPartTwo?: string) {
  const extension = file.type.split('/')[1]?.split('+')[0] ?? 'jpg';
  const user = auth.currentUser;
  if (!user) throw ClientErrors.SessionExpired();
  const filePath = `${pathStart}/${user.uid}${pathPartTwo ? `/${pathPartTwo}/` : '/'}${crypto.randomUUID()}.${extension}`;
  const metadata = await uploadFile(file, filePath);
  return metadata;
}
