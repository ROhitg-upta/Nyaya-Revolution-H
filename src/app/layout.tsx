import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { publicEnv } from "@/config";
import { siteConfig } from "@/constants";
import { AppProviders } from "@/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(publicEnv.appUrl),
  title: {
    default: `${siteConfig.name} — Understand your legal rights`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "legal rights",
    "legal awareness",
    "know your rights",
    "law education",
    "Indian law",
    "situation-based learning",
  ],
  openGraph: {
    title: `${siteConfig.name} — Understand your legal rights`,
    description: siteConfig.description,
    url: publicEnv.appUrl,
    siteName: siteConfig.name,
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — Understand your legal rights`,
    description: siteConfig.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
