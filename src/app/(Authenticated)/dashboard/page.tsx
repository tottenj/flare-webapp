import getAuthenticatedUser from '@/lib/auth/utils/getAuthenticatedUser';
import { redirect } from 'next/navigation';

export default async function page() {
  const user = await getAuthenticatedUser();
  if(!user) redirect("/signin")
  console.log(user);

  return (
    <div className="bg-blue h-full w-full">
      <h1>Dashboard</h1>
    </div>
  );
}
