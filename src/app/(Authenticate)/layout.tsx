import FlareLogo from "@/components/flare/configurableLogo/ConfigurableLogo";
import PageContainer from "@/components/layout/PageContainer";
import { ThemeToggle } from "@/components/ui/ThemeToggle/ThemeToggle";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="w-full flex p-4 justify-center relative">
        <Link href="/events">
          <FlareLogo size={60} showTagline/>
        </Link>
        <div className="absolute right-4 top-4">
          <ThemeToggle/>
        </div>
      </div>
      <PageContainer>
        {children}
      </PageContainer>
    </>
  );
}
