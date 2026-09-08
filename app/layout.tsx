import type { Metadata } from 'next';
import { GameProvider } from '@/lib/game-context-gdt';
import './globals.css';

export const metadata: Metadata = {
  title: 'Roll the Credits - GDT Edition',
  description: 'Film studio tycoon on the Game Dev Tycoon spine',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <GameProvider>
          {children}
        </GameProvider>
      </body>
    </html>
  );
}
