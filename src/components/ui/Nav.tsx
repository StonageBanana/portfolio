"use client";

import { useEffect, useRef, useState } from "react";
import { site, sections } from "@/content";
import { Container } from "./Section";
import { MarkIcon } from "./MarkIcon";
import { cn } from "@/lib/cn";

/**
 * Fixed top nav. Background goes from transparent to blurred --panel after
 * 100px of scroll; a thin --marker underline slides between active items.
 *
 * The underline is positioned imperatively from measured offsets rather than
 * with a layout animation, so it costs no re-render while scrolling.
 */
export function Nav({ active }: { active: string }) {
  const [scrolled, setScrolled] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const list = listRef.current;
    const bar = barRef.current;
    if (!list || !bar) return;

    const el = list.querySelector<HTMLElement>(`[data-nav="${active}"]`);
    if (!el) {
      bar.style.opacity = "0";
      return;
    }
    bar.style.opacity = "1";
    bar.style.width = `${el.offsetWidth}px`;
    bar.style.transform = `translateX(${el.offsetLeft}px)`;
  }, [active]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-500",
        scrolled
          ? "border-b border-line bg-panel/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-6">
        <a
          href="#landing"
          data-cursor="invert"
          aria-label={`${site.name} — back to top`}
          className="inline-flex items-center transition-opacity duration-300 hover:opacity-80"
        >
          <MarkIcon size={30} />
        </a>

        <nav aria-label="Primary">
          <ul ref={listRef} className="relative hidden items-center lg:flex">
            {sections.slice(1).map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  data-nav={s.id}
                  data-cursor="invert"
                  aria-current={active === s.id ? "true" : undefined}
                  className={cn(
                    "inline-block px-3 py-2 font-mono text-[11px] tracking-[0.12em] uppercase transition-colors duration-300",
                    active === s.id
                      ? "text-marker"
                      : "text-muted hover:text-bone",
                  )}
                >
                  {s.label}
                </a>
              </li>
            ))}
            <span
              ref={barRef}
              aria-hidden="true"
              className="absolute -bottom-0.5 left-0 h-px bg-marker opacity-0 transition-[transform,width,opacity] duration-500 ease-out"
            />
          </ul>

          {/* Narrow viewports: the section rail is the navigation. */}
          <a
            href="#contact"
            data-cursor="invert"
            className="font-mono text-[11px] tracking-[0.12em] text-marker uppercase lg:hidden"
          >
            Contact
          </a>
        </nav>
      </Container>
    </header>
  );
}
