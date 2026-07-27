import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Second Brain — Your Personal Knowledge Base",
  description:
    "Capture, organize, and retrieve everything you learn. A premium PKM system built for developers.",
};

import { SessionHandler } from "@/components/auth/SessionHandler";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[#FAFAFA] font-sans text-gray-900 antialiased dark:bg-gray-950 dark:text-gray-100 transition-colors">
        <Providers>
          {children}
          <SessionHandler />
        </Providers>
      </body>
    </html>
  );
}
