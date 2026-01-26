import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionExpiredProvider } from "./components/SessionExpiredProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AgroManager",
  description: "Gerencie suas propriedades rurais com facilidade",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased  bg-fixed bg-cover `}
        style={{ backgroundImage: "url('/crop-picture-comp.jpg')" }}
      >
        {children}
        <SessionExpiredProvider />
      </body>
    </html>
  );
}
