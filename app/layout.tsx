import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import BackgroundPattern from "@/components/background-pattern";
import TerminalWrapper from "@/components/terminal-wrapper";

import { fontSans } from "@/assets/fonts";
import Script from "next/script";


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
      <body className={` ${fontSans.className} font-sans bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative`} >
        <BackgroundPattern />
        <TerminalWrapper/>
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
