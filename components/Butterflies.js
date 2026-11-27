"use client";
// Pastel butterflies fluttering across the page on looping, wandering paths (wings flap, bodies follow the path).
import { useEffect, useState } from "react";

const COLOURS = [["#ffb3d1", "#ff6fae"], ["#d6c6ff", "#a88bff"], ["#b6f0d6", "#5fcf9e"], ["#ffd9b8", "#ff9f6e"], ["#ffe08a", "#ffb800"]];

function wing(fill, edge, flip) {
  return (
    <svg viewBox="0 0 19 30" style={{ transform: flip ? "scaleX(-1)" : undefined }}>
      <path d="M19 14 C6 -6 -4 4 4 14 C-4 22 6 34 19 17 Z" fill={fill} stroke={edge} strokeWidth="1.4" />
      <circle cx="8" cy="9" r="2.4" fill="#fff" opacity=".8" />
    </svg>
  );
}

/** A wandering path across a w x h screen, as an SVG path string (seeded per butterfly). */
function path(k, w, h) {
  const r = (n) => ((Math.sin(k * 99.1 + n * 12.7) + 1) / 2);
  const y0 = h * (0.15 + 0.7 * r(1));
  const pts = [[-60, y0]];
  for (let i = 1; i <= 4; i++) pts.push([(w + 120) * (i / 4) - 60, h * (0.1 + 0.8 * r(i + 2))]);
  return `path("M ${pts[0][0]} ${pts[0][1]} ` + pts.slice(1).map(([x, y], i) => `S ${x - w / 8} ${y + (i % 2 ? 90 : -90)} ${x} ${y}`).join(" ") + `")`;
}

export default function Butterflies({ count = 7 }) {
  const [size, setSize] = useState(null);
  useEffect(() => {
    const set = () => setSize([window.innerWidth, window.innerHeight]);
    set();
    window.addEventListener("resize", set);
    return () => window.removeEventListener("resize", set);
  }, []);
  if (!size) return null;
  return (
    <div className="flutter" aria-hidden>
      {Array.from({ length: count }, (_, k) => {
        const [fill, edge] = COLOURS[k % COLOURS.length];
        const style = { "--path": path(k + 1, size[0], size[1]), "--dur": `${16 + (k * 5) % 11}s`, "--delay": `${-k * 3.1}s`, scale: `${0.7 + (k % 3) * 0.25}` };
        return (
          <div className="bfly" key={k} style={style}>
            <div className="wing l">{wing(fill, edge, false)}</div>
            <div className="wing r">{wing(fill, edge, true)}</div>
          </div>
        );
      })}
    </div>
  );
}
