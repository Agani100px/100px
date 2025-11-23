import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { fetchWordPressHeader, fetchWordPressFooter } from "@/lib/wordpress";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "100px - Modern Headless CMS",
    template: "%s | 100px",
  },
  description: "A modern headless CMS powered by WordPress and Next.js",
  keywords: ["headless CMS", "WordPress", "Next.js", "blog"],
  authors: [{ name: "100px" }],
  creator: "100px",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://100px.com",
    siteName: "100px",
    title: "100px - Modern Headless CMS",
    description: "A modern headless CMS powered by WordPress and Next.js",
  },
  twitter: {
    card: "summary_large_image",
    title: "100px - Modern Headless CMS",
    description: "A modern headless CMS powered by WordPress and Next.js",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [headerData, footerData] = await Promise.all([
    fetchWordPressHeader(),
    fetchWordPressFooter(),
  ])

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} font-sans antialiased bg-black`}
      >
        <div className="flex min-h-screen flex-col">
          <Header headerData={headerData} />
          <main className="flex-1 pt-24">{children}</main>
          <Footer footerData={footerData} />
        </div>
      </body>
    </html>
  );
}
