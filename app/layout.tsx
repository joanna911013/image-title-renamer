import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL("https://clearcapture.example.com"),
  title: {
    default: "ClearCapture",
    template: "%s | ClearCapture",
  },
  description:
    "A calm and trustworthy starter for organizing screenshots with meaningful titles.",
  openGraph: {
    title: "ClearCapture",
    description: "A calm and trustworthy starter for organizing screenshots with meaningful titles.",
    url: "https://clearcapture.example.com",
    siteName: "ClearCapture",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ClearCapture",
    description: "A calm and trustworthy starter for organizing screenshots with meaningful titles.",
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${inter.variable} flex min-h-screen flex-col bg-gradient-to-br from-brand-50 via-white to-slate-100 font-sans text-slate-700`}
      >
        <Header />
        <main className="flex-1 py-12">
          <Container>{children}</Container>
        </main>
        <Footer />
      </body>
    </html>
  );
}
