import { gsap } from "./gsap";

/**
 * Counts up every numeric run inside a label while preserving its exact
 * formatting — thousands separators, decimals, percent signs, ranges, tildes.
 *
 * Handling all numbers in the string (rather than just the first) is what makes
 * "66–75%" animate as a range instead of a half-frozen figure.
 */
const NUMBER = /\d[\d,]*(?:\.\d+)?/g;

interface Piece {
  value: number;
  decimals: number;
  grouped: boolean;
}

export function countUp(el: HTMLElement, raw: string, duration = 1.4) {
  const template = raw;
  const pieces: Piece[] = [];

  for (const m of raw.matchAll(NUMBER)) {
    const text = m[0];
    const clean = text.replace(/,/g, "");
    const dot = clean.indexOf(".");
    pieces.push({
      value: Number(clean),
      decimals: dot === -1 ? 0 : clean.length - dot - 1,
      grouped: text.includes(","),
    });
  }

  if (pieces.length === 0) return;

  const state = { p: 0 };

  return gsap.to(state, {
    p: 1,
    duration,
    ease: "expo.out",
    onUpdate: () => {
      let i = 0;
      el.textContent = template.replace(NUMBER, () => {
        const piece = pieces[i++];
        return format(piece.value * state.p, piece);
      });
    },
    onComplete: () => {
      el.textContent = template;
    },
  });
}

function format(n: number, piece: Piece): string {
  const fixed = n.toFixed(piece.decimals);
  if (!piece.grouped) return fixed;
  const [int, frac] = fixed.split(".");
  const withCommas = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return frac ? `${withCommas}.${frac}` : withCommas;
}
