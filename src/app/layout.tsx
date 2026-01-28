import type { Metadata } from "next";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";
import Providers from "@/app/providers";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-text",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PhotoReimagine.ai",
  description: "AI photo editing and generation with creative control.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${sourceSans.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
