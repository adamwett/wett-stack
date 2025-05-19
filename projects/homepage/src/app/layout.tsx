import type { Metadata } from 'next';
import '../style.css';

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
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
}
