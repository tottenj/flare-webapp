'use server';
import verifyOrg from '@/lib/firebase/utils/verifyOrg';

export default async function DashboardLayout({
  org,
  user,
  admin,
}: {
  org: React.ReactNode;
  user: React.ReactNode;
  admin: React.ReactNode;
}) {
  const { claims, isAdmin } = await verifyOrg();

  return (
    <>
      <div className="mt-4">{isAdmin ? admin : claims ? org : user}</div>
    </>
  );
}
