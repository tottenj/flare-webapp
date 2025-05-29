import MainBanner from "@/components/banners/mainBanner/MainBanner";

export default async function EventsLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>    
      {children} {/* Main calendar + event list */}
      {modal} {/* Modal overlays go here */}
    </>
  );
}
