import type { Metadata } from 'next';
import './globals.css';
import { cn } from './utils/style';
import localFont from 'next/font/local';
import GoogleAnalyticsProvider from './logging/provider/google-analytics-provider';
import { GoogleAnalytics } from '@next/third-parties/google';

const myFont = localFont({
  src: './PretendardVariable.woff2',
  display: 'swap',
  variable: '--font-pretendard',
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="kr"
      className="scrollbar-track-gray-300 scrollbar-thumb-fingoo-main scrollbar-track-rounded-full scrollbar-thumb-rounded-full"
    >
      <GoogleAnalyticsProvider>
        <body className={cn(myFont.variable, 'font-pretendard')}>{children}</body>
      </GoogleAnalyticsProvider>
    </html>
  );
}
