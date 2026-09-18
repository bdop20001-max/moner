import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { WhatsAppFloatButton } from "@/components/layout/WhatsAppFloatButton";

const bengali = Hind_Siliguri({
  variable: "--font-bengali",
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.monermanush.net";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "মনের মানুষ | নিরাপদ ডেটিং প্ল্যাটফর্ম",
    template: "%s | মনের মানুষ",
  },
  description:
    "বাংলাদেশের প্রাপ্তবয়স্কদের জন্য নিরাপদ ও ব্যক্তিগত dating platform — মনের মানুষ। কথা থেকে বন্ধুত্ব, বন্ধুত্ব থেকে সুন্দর সম্পর্ক।",
  openGraph: {
    title: "মনের মানুষ | নিরাপদ ডেটিং প্ল্যাটফর্ম",
    description:
      "বাংলাদেশের প্রাপ্তবয়স্কদের জন্য নিরাপদ ও ব্যক্তিগত dating platform।",
    url: siteUrl,
    siteName: "মনের মানুষ",
    locale: "bn_BD",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  themeColor: "#6b0f2b",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="bn" className={`${bengali.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-brand-cream font-sans text-brand-ink">
        {children}
        <WhatsAppFloatButton />
      </body>
    </html>
  );
}
