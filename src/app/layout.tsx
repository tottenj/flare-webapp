import { Geist, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { ToastContainer } from 'react-toastify';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css'; // Import the CSS
import MainBanner from '@/components/banners/mainBanner/MainBanner';
import { Suspense } from 'react';

config.autoAddCss = false;

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta-sans',
  subsets: ['latin'],
  display: 'swap',
});

export default async function RootLayout({
  children,
  modal,
}: Readonly<{ children: React.ReactNode; modal: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${plusJakartaSans.variable} antialiased`}>
        <main className="flex min-h-dvh flex-col">
          <Suspense fallback={'Loading'}>
            <MainBanner />
          </Suspense>
          <div className="gradient flex min-h-0 flex-1">
            <div className="webGrid mt-4 mr-auto mb-4 ml-auto flex flex-1 flex-col">
              {children}
              {modal}
            </div>
          </div>
        </main>
        <Analytics />
        <SpeedInsights />
        <ToastContainer position="bottom-right" />
      </body>
    </html>
  );
}
