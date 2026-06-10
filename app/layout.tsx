import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { VoiceAssistant } from "@/components/VoiceAssistant";

export const metadata: Metadata = {
  title: "CG Matsya Exports | Chhattisgarh Fish Export",
  description: "A Chhattisgarh-inspired fish export catalog and inquiry platform."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <CartProvider>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
          <VoiceAssistant />
        </CartProvider>
      </body>
    </html>
  );
}
