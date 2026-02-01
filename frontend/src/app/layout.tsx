import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Nightwatch - Safe Walking Routes",
  description:
    "AI-driven navigation that prioritizes well-lit streets over shortcuts. Walk with confidence after dark.",
  keywords: ["walking", "navigation", "safety", "night", "routes", "AI", "nightwatch"],
  authors: [{ name: "Nightwatch" }],
  openGraph: {
    title: "Nightwatch - Safe Walking Routes",
    description:
      "AI-driven navigation that prioritizes well-lit streets over shortcuts.",
    type: "website",
  },
  icons: {
    icon: "/brand/owl.svg",
    apple: "/brand/owl.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Material Symbols */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.variable} font-display antialiased bg-background-dark text-white overflow-x-hidden`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
