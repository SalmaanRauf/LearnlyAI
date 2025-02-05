import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import Header from '../components/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'LearnlyAI',
  description: 'Flashcard Generator',
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {/* Global persistent header */}
          <Header />
          {/* Padding-top to prevent content being hidden behind the fixed header */}
          <main style={{ paddingTop: '64px' }}>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
