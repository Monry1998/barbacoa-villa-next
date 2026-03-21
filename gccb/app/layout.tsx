// src/app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';



const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'GCCB - Gestor Central de Comandas Back',
  description: 'Sistema de control de mesas y comandas',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  );
}