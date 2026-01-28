import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://readsilk.com'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Silk - Irresistible Romance Stories",
    template: "%s | Silk"
  },
  description: "AI-powered romance stories, perfectly crafted for you. Indulge in curated stories or create your own personalized romance with custom characters and scenarios.",
  keywords: ["romance stories", "AI stories", "personalized romance", "romance novels", "custom stories", "romantasy", "contemporary romance", "dark romance"],
  authors: [{ name: "Silk" }],
  creator: "Silk",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Silk",
    title: "Silk - Irresistible Romance Stories",
    description: "AI-powered romance stories, perfectly crafted for you. Create personalized romances with custom characters and scenarios.",
    images: [
      {
        url: "/images/genre-tropes/romantasy_enemies-to-lovers.png",
        width: 1200,
        height: 630,
        alt: "Silk - Romance Stories",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Silk - Irresistible Romance Stories",
    description: "AI-powered romance stories, perfectly crafted for you. Create personalized romances with custom characters and scenarios.",
    images: ["/images/genre-tropes/romantasy_enemies-to-lovers.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
