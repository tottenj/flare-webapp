import { Nunito, PT_Sans } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/context/AuthContext';
import { ServerUserProvider } from '@/components/context/ServerUserContext';
import { ToastContainer } from 'react-toastify';
import { getAuthenticatedAppForUser } from '@/lib/firebase/auth/configs/serverApp';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css'; // Import the CSS
import { Providers } from './appProvider';
import MainBanner from '@/components/banners/mainBanner/MainBanner';


config.autoAddCss = false;

const nunito = Nunito({
  variable: '--font-nunito',
  subsets: ['latin'],
  display: 'swap',
});

const pt_sans = PT_Sans({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-pt_sans',
  subsets: ['latin'],
});

export default async function RootLayout({
  children,
  event,
}: Readonly<{ children: React.ReactNode; event: React.ReactNode }>) {
  const { currentUser } = await getAuthenticatedAppForUser();

  const userData = currentUser
    ? {
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName,
      }
    : null;

  return (
    <html lang="en">
      <body className={`${nunito.variable} ${pt_sans.variable} antialiased`}>
        <div className="fullGradientBackground" />
        <div className="flex h-dvh justify-center">
          <div className="relative mb-4 h-dvh w-full overflow-auto overflow-x-hidden">
            <ServerUserProvider user={userData}>
              <AuthProvider>
                <Providers>
                  <MainBanner />
                  <div className="pr-4 pl-4">
                    {children}
                    {event}
                  </div>
                </Providers>
              </AuthProvider>
              <Analytics />
              <SpeedInsights />
              <ToastContainer position="bottom-right" />
            </ServerUserProvider>
          </div>
        </div>
      </body>
    </html>
  );
}
