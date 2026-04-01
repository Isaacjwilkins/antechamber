import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Antechamber Health | Health Intelligence",
  description:
    "Pioneering the future of healthcare through intelligent innovation. Antechamber Health brings advanced analytics and personalized insights to transform your health journey.",
  keywords: ["health", "healthcare", "technology", "AI", "health intelligence", "analytics"],
  openGraph: {
    title: "Antechamber Health",
    description: "Pioneering the future of healthcare through intelligent innovation.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={outfit.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-[#0a0a0f] text-[#ededed] antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
