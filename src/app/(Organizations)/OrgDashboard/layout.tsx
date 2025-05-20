import MainBanner from "@/components/banners/mainBanner/MainBanner";

export default function layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
    <MainBanner/>
    <div className="flex h-full w-full items-center justify-center gradientBack">
      <div className="h-[95%] w-[95%] bg-white p-4 rounded-2xl">{children}</div>
    </div>
    </>
  );
}
