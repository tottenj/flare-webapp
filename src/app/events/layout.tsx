import MainBannerMenuContainer from '@/components/banners/mainBanner/MainBannerMenuContainer';

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-col items-end gap-4">
      <MainBannerMenuContainer />
      <div className="flex-1 flex items-center">{children}</div>
    </div>
  );
}
