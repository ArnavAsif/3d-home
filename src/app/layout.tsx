import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Interactive 3D Walkable Room | Stylized Interior',
  description: 'Realistic first-person 3D walkable room visualization with solid collisions and interactive furniture placement.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 overflow-hidden antialiased">
        {children}
      </body>
    </html>
  );
}
