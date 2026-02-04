import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { Providers } from "./Providers";
import { CatalogPrefetch } from "@/components/catalog-prefetch";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: "BCT Overflow",
    template: "%s | BCT Overflow",
  },
  description:
    "Study platform for BCT students. Notes, PYQs, resources, and materials for Computer Engineering (BCT).",
  keywords: [
    "notes",
    "bct overflow",
    "computer engineering",
    "bctoverflow",
    "pyqs",
    "bct notes",
    "bct study materials",
  ],
  metadataBase: new URL("https://bctoverflow.vercel.app"),
  openGraph: {
    title: "BCT Overflow",
    description: "Study platform for BCT students",
    url: "https://bctoverflow.vercel.app",
    siteName: "BCT Overflow",
    images: [
      {
        url: "/og_image.png",
        width: 900,
        height: 480,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://bctoverflow.vercel.app",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "BCT Overflow",
              url: "https://bctoverflow.vercel.app",
              description:
                "Study platform for BCT students. Notes, PYQs, and Computer Engineering resources.",
            }),
          }}
        />
        <meta
          name="google-site-verification"
          content="H6-45X_fdJ56z_WbBg37YHPSz0ijprwWiTBkqSwSJAc"
        />
      </head>
      <body className={`${poppins.variable} antialiased`}>
        <div className="flex flex-col max-w-6xl mx-auto h-full">
          <Providers>
            <CatalogPrefetch />
            <Navbar />
            <main>{children}</main>
          </Providers>
        </div>
      </body>
    </html>
  );
}
