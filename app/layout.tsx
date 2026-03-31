import type { Metadata } from "next";
import { Orbitron, Space_Mono, Inter } from "next/font/google";
import "./globals.css";
import Preloader from "./components/Preloader";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-orbitron",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Om Dipak Kanase — AI/ML Portfolio",
  description:
    "Cyber portfolio of Om Dipak Kanase, CSE student specialising in AI & Machine Learning at Lovely Professional University.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${orbitron.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Preloader>{children}</Preloader>
      </body>
    </html>
  );
}
