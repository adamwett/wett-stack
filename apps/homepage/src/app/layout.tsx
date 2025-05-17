import type { Metadata } from 'next';
import '@repo/ui/globals.css';

export const metadata: Metadata = {
  title: 'wett.dev',
  description: 'homepage of adam wett',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className='dark'>
      <body>{children}</body>
    </html>
  );
}
