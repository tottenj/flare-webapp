import { Nunito, PT_Sans } from 'next/font/google';
import './globals.css';
import { ToastContainer } from 'react-toastify';
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
  return (
    <html lang="en">
      <body className={`${nunito.variable} ${pt_sans.variable} antialiased`}>
        <Providers>
          <main className="flex min-h-dvh flex-col">
            <MainBanner />
            <div className="gradient flex min-h-0 flex-1">
              <div className="flex flex-1 flex-col mt-4 mb-4 ml-auto mr-auto webGrid">
                {children}
                {event}
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
