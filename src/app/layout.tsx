import { Nunito, PT_Sans } from 'next/font/google';
import './globals.css';
import { ToastContainer } from 'react-toastify';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css'; // Import the CSS
import { Providers } from './appProvider';
import MainBanner from '@/components/banners/mainBanner/MainBanner';
import { Suspense } from 'react';

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

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} ${pt_sans.variable} antialiased`}>
        <Providers>
          <main className="flex min-h-dvh flex-col">
            <Suspense fallback={'Loading'}>
              <MainBanner />
            </Suspense>
            <div className="gradient flex min-h-0 flex-1">
              <div className="webGrid mt-4 mr-auto mb-4 ml-auto flex flex-1 flex-col">
                {children}
              </div>
            </div>
          </main>
        </Providers>
        <Analytics />
        <SpeedInsights />
        <ToastContainer position="bottom-right" />
      </body>
    </html>
  );
}
