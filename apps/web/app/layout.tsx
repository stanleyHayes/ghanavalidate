import type { Metadata } from "next";
import { Geist_Mono, Newsreader, Outfit } from "next/font/google";
import "./styles.css";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });
const titleFace = Newsreader({ subsets: ["latin"], variable: "--font-newsreader", display: "swap" });
const title = "GhanaValidate — Ghana-specific validation primitives";
const description = "Normalize Ghana phone numbers, check GhanaPostGPS text syntax, and use versioned reference candidates without false verification claims.";

export const metadata: Metadata = {
  metadataBase: new URL("https://validate.digitalghana.dev"),
  title: { default: title, template: "%s · GhanaValidate" },
  description,
  applicationName: "GhanaValidate",
  keywords: ["Ghana", "validation", "normalization", "phone number", "GhanaPostGPS", "open source", "Digital Ghana"],
  authors: [{ name: "Digital Ghana", url: "https://digitalghana.dev" }], creator: "Digital Ghana", publisher: "Digital Ghana",
  alternates: { canonical: "/" }, icons: { icon: "/icon.svg", shortcut: "/icon.svg" }, manifest: "/manifest.webmanifest",
  openGraph: { type: "website", locale: "en_GH", url: "/", siteName: "Digital Ghana", title, description, images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "GhanaValidate syntax and normalization toolkit" }] },
  twitter: { card: "summary_large_image", title, description, images: ["/opengraph-image"] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-GH"><body className={`${outfit.variable} ${mono.variable} ${titleFace.variable}`}>{children}</body></html>;
}
