'use server';
import verifyOrg from '@/lib/firebase/utils/verifyOrg';

export default async function DashboardLayout({
  org,
  user,
  admin,
  modal
}: {
  org: React.ReactNode;
  user: React.ReactNode;
  admin: React.ReactNode;
  modal: React.ReactNode
}) {
  const { claims, isAdmin } = await verifyOrg();

  return (
    <>
      <div className="relative mt-4 h-[calc(100dvh-82px)] max-w-[1440px] m-auto">{isAdmin ? admin : claims ? org : user}{modal}</div>
    </>
  );
}
