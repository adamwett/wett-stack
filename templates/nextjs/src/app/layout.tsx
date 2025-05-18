import type { Metadata } from 'next';
import '../style.css';

export const metadata: Metadata = {
  title: 'Next.js Template',
  description: 'A turborepo template for Next.js projects',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
}
