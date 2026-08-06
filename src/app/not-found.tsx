import Link from "next/link";
import { PosePoster } from "@/components/three/PosePoster";
import { getPortraitCamera } from "@/lib/pose/camera";

export default function NotFound() {
  return (
    <main className="grid min-h-svh place-items-center px-6">
      <div className="text-center">
        <div className="mx-auto mb-8 h-40 w-32 opacity-50">
          <PosePoster
            camera={getPortraitCamera()}
            width={320}
            height={400}
            showGrid={false}
            distortion={1}
            markerRadius={5}
          />
        </div>
        <p className="eyebrow mb-4">404 / NO MATCH</p>
        <h1 className="font-display text-4xl tracking-[-0.03em]">
          Nothing tracked here.
        </h1>
        <Link
          href="/"
          className="mt-8 inline-block rounded-[4px] border border-line px-5 py-3 font-mono text-[11px] tracking-[0.14em] uppercase transition-colors duration-300 hover:border-marker/60 hover:text-marker"
        >
          Back to start
        </Link>
      </div>
    </main>
  );
}
