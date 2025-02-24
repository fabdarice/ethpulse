import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { headers } from 'next/headers'

import { Providers } from './providers';
import { Toaster } from "@/components/ui/toaster";
import { NavMenu } from '@/components/ui/nav-menu';
import { Github, Twitter } from "lucide-react";

const inter = Inter({ subsets: ['latin'] });


export const metadata: Metadata = {
  title: 'Ethereum Pulse',
  description: 'A dashboard to track the pulse of ethereum hot topics',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersObj = headers();
  const cookies = headersObj.get('cookie')
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="bg-[#f0f7ff] min-h-screen">

          <NavMenu />

          <div className="pt-16">
            <Providers cookies={cookies}>
              <Toaster />
              {children}
            </Providers>
          </div>

          <footer className="text-center p-8 text-gray-600 space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Github className="h-4 w-4" />
              <span>Code opensource on</span>
              <a
                href="https://github.com/fabdarice/ethpulse"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 transition-colors"
              >
                github
              </a>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Twitter className="h-4 w-4" />
              <span>Built by</span>
              <a
                href="https://x.com/fabdarice"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 transition-colors flex items-center gap-0"
              >
                fabda.eth
              </a>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
