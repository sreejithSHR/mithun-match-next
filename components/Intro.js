"use client";
// The opening: the "Can you be my Date?" poster, cinematic (letterbox bars, film grain, a slow zoom). Tap to tear it
// down the middle: the halves fly apart and a beating heart asks to check it out.
import { useEffect, useState } from "react";

/** A ragged tear down the middle, as clip-path polygons for the left and right halves. */
function tear() {
  const pts = [];
  for (let i = 0; i <= 24; i++) pts.push([50 + (i % 2 ? 2.2 : -2.2) * (0.6 + ((i * 37) % 7) / 10), (i / 24) * 100]);
  const edge = pts.map(([x, y]) => `${x}% ${y}%`);
  return {
    left: `polygon(0 0, ${edge.join(", ")}, 0 100%)`,
    right: `polygon(100% 0, ${edge.join(", ")}, 100% 100%)`,
  };
}

export default function Intro({ onDone }) {
  const [torn, setTorn] = useState(false);
  const [gone, setGone] = useState(false);
  const clip = tear();

  useEffect(() => {
    document.body.classList.add("locked");
    return () => document.body.classList.remove("locked");
  }, []);

  const finish = () => {
    setGone(true);
    document.body.classList.remove("locked");
    setTimeout(onDone, 900);
  };

  return (
    <div className={`intro bars ${torn ? "torn" : ""} ${gone ? "gone" : ""}`} onClick={() => !torn && setTorn(true)}>
      <div className="poster">
        <div className="half l" style={{ clipPath: clip.left }} />
        <div className="half r" style={{ clipPath: clip.right }} />
      </div>
      <div className="grain" />
      <div className="tearline" />
      <button className="tearbtn" onClick={(e) => { e.stopPropagation(); setTorn(true); }}>💌 Tear it open</button>
      <button className="skip" onClick={(e) => { e.stopPropagation(); finish(); }}>skip ›</button>
      <div className="longing">
        <div className="bigheart">💗</div>
        <div className="script">My longest yearning might be you…</div>
        <p>Why don't we check it out?</p>
        <button className="enter" onClick={(e) => { e.stopPropagation(); finish(); }}>Let's find out 💞</button>
      </div>
    </div>
  );
}
