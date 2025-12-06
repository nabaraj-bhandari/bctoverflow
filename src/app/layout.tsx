import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "BCT Overflow",
  description: "Resources sharing platform for BCT students.",
};

export default function RootLayout({
  children,
  pathname,
}: {
  children: React.ReactNode;
  pathname: string;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <div className="flex flex-col max-w-4xl mx-auto">
          <Navbar />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
