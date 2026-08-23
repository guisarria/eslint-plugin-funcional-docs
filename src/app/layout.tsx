import type { Metadata } from "next";
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Functional ESLint Rules",
  description:
    "A Flexoki-dark reference for eslint-plugin-functional rules, presets, and code examples.",
  openGraph: {
    title: "Functional ESLint Rules",
    description: "A practical reference for functional constraints in JavaScript and TypeScript.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Functional ESLint Rules",
    description: "A practical reference for functional constraints in JavaScript and TypeScript.",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
