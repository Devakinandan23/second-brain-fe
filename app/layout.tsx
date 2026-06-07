import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

// Using Inter per the Next.js font docs — applied as className on <html>
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Second Brain — Your Personal Knowledge Base",
  description:
    "Capture, organize, and retrieve everything you learn. A premium PKM system built for developers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="min-h-screen bg-[#FAFAFA] text-gray-900 antialiased dark:bg-gray-950 dark:text-gray-100 transition-colors">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
