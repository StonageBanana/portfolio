import { Fragment } from "react";

/**
 * Highlights quantified figures inside verbatim prose and marks them for the
 * count-up in phase 6.
 *
 * Deliberately conservative: only percentages and thousands-separated numbers
 * match. Highlighting every integer would put --signal on things that aren't
 * results, which is exactly the colour rule this design forbids. Copy is never
 * modified — only wrapped.
 */
const FIGURE = /(\d+(?:\.\d+)?\s*%|\d{1,3}(?:,\d{3})+\+?)/g;

export function Metric({ children }: { children: string }) {
  // One capture group means split() puts every match at an odd index. Testing
  // the regex again here would be wrong — /g carries lastIndex between calls.
  const parts = children.split(FIGURE);

  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span
            key={i}
            data-count={part}
            className="tabular font-mono text-signal"
          >
            {part}
          </span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}
