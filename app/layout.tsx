import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import BackgroundPattern from "@/components/background-pattern";
import TerminalWrapper from "@/components/terminal-wrapper";

import { Roboto, Montserrat } from 'next/font/google'

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-roboto',
})

const montserrat = Montserrat({
  weight: '700',
  subsets: ['latin'],
  variable: '--font-montserrat',
})

export const metadata: Metadata = {
  title: "/tomihq/",
  description: "tomihq's personal website",
};

export const dynamic = "force-static";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` ${roboto.variable} ${montserrat.variable} font-sans bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative`} >
        <BackgroundPattern />
        <TerminalWrapper/>
           <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
