import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Church Management System",
  description: "Impact Centre Chrétien management dashboard",
};

import { Providers } from "./components/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
