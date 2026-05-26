import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FilaSaude | Prefeitura de Bambui - MG',
  description:
    'Sistema de gestao de filas e agendamentos para a saude publica municipal de Bambui, Minas Gerais.',
  keywords: ['saude', 'fila', 'agendamento', 'UBS', 'Bambui', 'MG', 'prefeitura'],
  authors: [{ name: 'Prefeitura Municipal de Bambui' }],
  icons: { icon: '/favicon.ico' },
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
