import MainBanner from "@/components/banners/mainBanner/MainBanner";

export default function layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
        <MainBanner/>
        {children}
    </>
  )
}
