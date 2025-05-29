import MainBanner from '@/components/banners/mainBanner/MainBanner';
import verifyOrg from '@/lib/firebase/utils/verifyOrg';

export default async function DashboardLayout({
  org,
  user,
}: {
  org: React.ReactNode;
  user: React.ReactNode;
}) {
  const { claims } = await verifyOrg();

  return (
    <>
      <MainBanner />
      <div className='mt-4'>
      {claims ? org : user}
      </div>
    </>
  );
}
