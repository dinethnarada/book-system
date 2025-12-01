import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next"
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

export const metadata: Metadata = {
  metadataBase: new URL('https://www.edurelieflk.org'),
  title: {
    default: "Sri Lanka Flood Relief - Educational Material Support",
    template: "%s | Sri Lanka Flood Relief"
  },
  description: "Supporting flood-affected students in Sri Lanka with essential educational materials. Help us rebuild education, one book at a time.",
  keywords: ["Sri Lanka Flood Relief", "Education Support", "Donate Books", "Flood Victims Sri Lanka", "School Supplies Donation", "Rebuild Education", "Volunteer Sri Lanka"],
  authors: [{ name: "EduReliefLK" }],
  creator: "EduReliefLK",
  publisher: "EduReliefLK",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Sri Lanka Flood Relief - Educational Material Support",
    description: "Supporting flood-affected students in Sri Lanka with essential educational materials. Help us rebuild education, one book at a time.",
    url: 'https://www.edurelieflk.org',
    siteName: 'Sri Lanka Flood Relief',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/flood-hero-bg.jpg',
        width: 1200,
        height: 630,
        alt: 'Sri Lanka Flood Relief - Educational Material Support',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Sri Lanka Flood Relief - Educational Material Support",
    description: "Supporting flood-affected students in Sri Lanka with essential educational materials. Help us rebuild education, one book at a time.",
    images: ['/flood-hero-bg.jpg'],
  },
  alternates: {
    canonical: 'https://www.edurelieflk.org',
  },
  verification: {
    google: 'huZfp30IGyxLWu6FcaDyTWZkF-ig68c_7_1bxMo8R1s',
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
        suppressHydrationWarning={true}
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
