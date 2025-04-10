import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import SessionProvider from "@/utils/SessionProvider";
import Navbar from "@/components/Navbar";
import Providers from "@/Providers";
import QueryClientProviderWrapper from '@/components/QueryClientProviderWrapper'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Proyecto",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
        <QueryClientProviderWrapper>
          <div className="flex">
            <Navbar />
            <Providers>
            <main className="flex-1 pl-[250px] py-6 2xl:max-w-[1920px] lg:max-w-[1270px]">
              {children}
            </main>
            </Providers>
          </div>
          </QueryClientProviderWrapper>
        </SessionProvider>
      </body>
    </html>
  );
}

