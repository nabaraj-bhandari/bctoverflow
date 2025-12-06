import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: false,
});

export const metadata = {
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
              potentialAction: {
                "@type": "SearchAction",
                target:
                  "https://bctoverflow.vercel.app/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className={`${poppins.variable} antialiased`}>
        <div className="flex flex-col max-w-4xl mx-auto">
          <Navbar />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
