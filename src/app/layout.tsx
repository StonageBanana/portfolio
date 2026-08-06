import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter_Tight, JetBrains_Mono } from "next/font/google";
import { site, landing } from "@/content";
import { SITE_URL } from "@/lib/siteUrl";
import { Preloader } from "@/components/ui/Preloader";
import "./globals.css";

// Single axis only where possible — extra axes materially inflate the woff2
// payload for no visual gain here.
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: [],
  display: "swap",
  variable: "--font-bricolage",
  preload: true,
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter-tight",
  preload: true,
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
  preload: false, // mono is utility text — don't spend a preload on it
});

const description = `${landing.intro.split(" — from raw")[0]}.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${site.name} — ${site.designations[0]}`,
    template: `%s — ${site.name}`,
  },
  description,
  keywords: [
    "Data Scientist",
    "Computer Vision",
    "3D Pose Estimation",
    "Machine Learning",
    "Markerless Motion Capture",
    "Erlangen",
  ],
  authors: [{ name: site.name, url: site.socials[0].href }],
  creator: site.name,
  openGraph: {
    type: "profile",
    title: `${site.name} — ${site.designations.join(" · ")}`,
    description,
    siteName: site.name,
  },
  twitter: { card: "summary_large_image", title: site.name, description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#08090C",
  colorScheme: "dark",
};

/**
 * Runs before first paint and decides "run" vs "skip".
 *
 * Two things depend on this being pre-paint rather than a useEffect:
 *  - a repeat visitor never sees a flash of preloader, and
 *  - on a first visit the opaque backdrop is painted with the very first frame.
 *    The preloader component itself is ssr:false, so it only mounts after
 *    hydration; without this the server-rendered hero paints first and the
 *    preloader drops on top of it a few hundred ms later.
 *
 * Setting the flag (rather than defaulting to "run") also means a visitor with
 * JS disabled never gets a backdrop that nothing is left to remove.
 *
 * Coarse pointers skip it entirely. A full-screen opaque overlay delays LCP by
 * its whole duration, and measured on the deployed site that was the difference
 * between a 75 and a passing mobile Lighthouse score. On desktop the preloader
 * is an affordable flourish; on a throttled phone it is just latency in front
 * of the content.
 */
const PRELOADER_FLAG = `try{
var m=matchMedia,
skip=sessionStorage.getItem('pl')==='1'
||m('(prefers-reduced-motion: reduce)').matches
||m('(pointer: coarse)').matches;
document.documentElement.dataset.preload=skip?'skip':'run';
sessionStorage.setItem('pl','1');}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${interTight.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: PRELOADER_FLAG }} />
      </head>
      <body className="bg-ink text-bone font-sans antialiased">
        {/* Server-rendered and CSS-driven, so it is in the first paint rather
            than waiting on hydration. See the note in Preloader.tsx. */}
        <Preloader />
        {children}
      </body>
    </html>
  );
}
