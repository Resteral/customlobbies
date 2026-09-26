import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AiOrderConciergeWidget from "@/components/AiOrderConciergeWidget";
import PwaInstallPrompt from "@/components/PwaInstallPrompt";
import GlobalAnnouncementBanner from "@/components/GlobalAnnouncementBanner";

export const viewport: Viewport = {
  themeColor: "#070709",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Townraise | Local Storefronts, NFC Network & Food Delivery Driver App",
  description: "Accelerate your 5-star Google Reviews, browse local restaurant menus, explore tourist scavenger hunts, and manage real-time courier food delivery dispatch across Carroll County.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Townraise",
  },
  applicationName: "Townraise",
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Townraise" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="min-h-screen bg-[#070709] text-slate-100 selection:bg-amber-400 selection:text-black flex flex-col justify-between">
        <GlobalAnnouncementBanner />
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <AiOrderConciergeWidget />
        <PwaInstallPrompt />
        <Footer />
      </body>
    </html>
  );
}
