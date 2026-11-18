import type { Metadata, Viewport } from "next";
import { Geist, JetBrains_Mono, Newsreader } from "next/font/google";
import "./globals.css";
import { site, absoluteUrl } from "@/config/site";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { resumeAvailable } from "@/lib/assets";

const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-newsreader", display: "swap", style: ["normal", "italic"] });
const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} | ${site.title}`, template: `%s | ${site.name}` },
  description: site.description,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: `${site.name} | ${site.title}`,
    description: site.description,
  },
  twitter: { card: "summary_large_image", title: `${site.name} | ${site.title}`, description: site.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f4f1" },
    { media: "(prefers-color-scheme: dark)", color: "#15171a" },
  ],
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: "Applied AI Engineer",
  url: site.url,
  email: `mailto:${site.links.email}`,
  worksFor: { "@type": "Organization", name: "Silver Touch Technologies Ltd." },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Charotar University of Science and Technology" },
  address: { "@type": "PostalAddress", addressLocality: "Surat", addressRegion: "Gujarat", addressCountry: "IN" },
  sameAs: [site.links.linkedin, site.links.github, site.links.medium].filter(Boolean),
  knowsAbout: ["Applied AI", "Document intelligence", "LLM inference", "Retrieval-augmented generation", "Backend engineering"],
  mainEntityOfPage: absoluteUrl("/"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${newsreader.variable} ${geist.variable} ${jetbrains.variable}`}>
      <body className="antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
        <SiteHeader resumeAvailable={resumeAvailable()} />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
