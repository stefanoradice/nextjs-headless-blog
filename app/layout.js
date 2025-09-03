import { Geist, Geist_Mono } from 'next/font/google';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ReactQueryProvider } from '@/app/providers/ReactQueryProvider';
import { verifyUser } from '@/lib/api/server/authServer';
import { cookies } from 'next/headers';
import { WSProvider } from '@/context/WSContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Headless Blog',
  description: 'An headless WordPress Blog',
};

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('jwtToken')?.value;
  let user = null;

  if (token) {
    try {
      user = await verifyUser(token);
    } catch {
      user = null;
    }
  }

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ReactQueryProvider>
          <WSProvider>
            <AuthProvider>
              <Header />
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">{children}</main>
              <Footer />
            </AuthProvider>
          </WSProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
