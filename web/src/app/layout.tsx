import type { Metadata } from "next";
import { Inter, Tiro_Gurmukhi } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const tiro = Tiro_Gurmukhi({
  weight: "400",
  variable: "--font-tiro",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cobre Assessment | Luis Bilbao",
  description: "Interactive portfolio for Cobre Business Analyst Assessment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${tiro.variable} antialiased min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <Navbar />
        <main className="flex-1 pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}
