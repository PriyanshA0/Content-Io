import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Mono, Sora } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import favicon from "./assets/Favicon.png";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-mono",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ContentIo",
  description: "Screenshot and code beautifier for social-ready images.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  icons: {
    icon: favicon.src,
    shortcut: favicon.src,
    apple: favicon.src,
  },
  openGraph: {
    title: "ContentIo",
    description: "Screenshot and code beautifier for social-ready images.",
    images: [favicon.src],
  },
  twitter: {
    card: "summary_large_image",
    title: "ContentIo",
    description: "Screenshot and code beautifier for social-ready images.",
    images: [favicon.src],
  },
};

export const viewport = {
  themeColor: "#f8fafc",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} ${sora.variable}`}>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}