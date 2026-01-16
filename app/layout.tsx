import type { Metadata } from "next";
import { GoogleTagManager } from "@next/third-parties/google";


import "./globals.css";
import Nav from "@/components/nav";
import BackgroundPattern from "@/components/background-pattern";
import { fontSans } from "@/assets/fonts";
import Script from "next/script";
import Head from "next/head";
import TerminalWrapper from "@/components/terminal-wrapper";
import Footer from "@/components/footer";

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
      <Head>
        <Script
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            <script type="text/javascript">
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "sk0qx9lnt6");
</script>
          `,
          }}
        />
      </Head>
      <body
        className={` ${fontSans.className} font-sans bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white relative`}
      >
        <Nav />
        {children}
        {process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID &&
        process.env.NODE_ENV === "production" && (
          <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID!} />
        )}
        <TerminalWrapper />

        <Footer />
      </body>
    </html>
  );
}
