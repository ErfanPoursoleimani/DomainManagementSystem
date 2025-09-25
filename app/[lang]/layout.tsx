import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css'
import { StoreInitializer } from '../components/store-initializer';
import { Lang } from '../types/dictionary';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Domain Management',
  description: 'Manage your domains with CRUD operations and filtering',
};

export default async function RootLayout({
  children, params
}: {
  children: React.ReactNode,
  params: Promise<{ lang: string }>
}) {

  const { lang } = await params

  return (
    <html lang="en">
      <body className={inter.className}>
      <StoreInitializer lang={lang as Lang}>
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
      </StoreInitializer>
      </body>
    </html>
  );
}