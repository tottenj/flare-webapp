'use server';
import MainBanner from '@/components/banners/mainBanner/MainBanner';

export default async function DashboardLayout({ children }: { children: React.ReactNode}) {
  return (
    <>
      <MainBanner />
      {children}
    </>
  );
}
