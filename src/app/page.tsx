import { resolveAssets } from "@/lib/assets.server";
import { Providers } from "./providers";
import { Chrome } from "@/components/ui/Chrome";
import { Landing } from "@/components/sections/Landing";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Education } from "@/components/sections/Education";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Certifications } from "@/components/sections/Certifications";
import { Achievements } from "@/components/sections/Achievements";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/ui/Footer";

export default function Home() {
  // Runs on the build machine — only the resolved booleans/paths cross into
  // the client payload. See lib/assets.server.ts.
  const assets = resolveAssets();

  return (
    <Providers>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[70] focus:rounded-[4px] focus:bg-marker focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:text-ink"
      >
        Skip to content
      </a>

      <Chrome />

      <main id="main">
        <Landing />
        <About headshot={assets.headshot} />
        <Experience />
        <Education />
        <Projects />
        <Skills />
        <Certifications assets={assets} />
        <Achievements />
        <Contact cv={assets.cv} />
      </main>

      <Footer />
    </Providers>
  );
}
