"use client";
// Four big postcards (what he can do... can your boyfriend?), one at a time with arrows, dots and swipe. "Does that
// sync with you?" pops up his cut-out in a heart with hearts and teddy bears flying out.
import { useEffect, useRef, useState } from "react";
import { POSTCARDS, SYNC_PHOTO } from "@/lib/content";

const FLYING = ["💖", "🧸", "💕", "🧸", "💗", "🎀", "💘", "🧸", "✨", "💞", "🌸", "🧸", "💖", "🫰"];

function Burst({ onClose }) {
  return (
    <div className="burst" onClick={onClose}>
      <svg width="0" height="0" aria-hidden>
        <clipPath id="heartclip" clipPathUnits="objectBoundingBox">
          <path d="M.5 .92 C.18 .7 0 .5 0 .3 C0 .12 .14 0 .29 0 C.39 0 .46 .06 .5 .14 C.54 .06 .61 0 .71 0 C.86 0 1 .12 1 .3 C1 .5 .82 .7 .5 .92 Z" />
        </clipPath>
        <clipPath id="heartclip-big" clipPathUnits="objectBoundingBox">
          <path d="M.5 .95 C.15 .72 -.03 .5 -.03 .29 C-.03 .09 .12 -.03 .29 -.03 C.39 -.03 .46 .02 .5 .1 C.54 .02 .61 -.03 .71 -.03 C.88 -.03 1.03 .09 1.03 .29 C1.03 .5 .85 .72 .5 .95 Z" />
        </clipPath>
      </svg>
      <div style={{ textAlign: "center", position: "relative" }}>
        <div className="cutout">
          <div className="outline" />
          <img src={SYNC_PHOTO} alt="Mithun" />
        </div>
        <h2>It's a sync! 💞</h2>
        <p>Mithun felt that. He's blushing. (tap anywhere)</p>
      </div>
      {FLYING.concat(FLYING).map((e, i) => {
        const a = (i / (FLYING.length * 2)) * Math.PI * 2;
        const d = 34 + (i % 3) * 12;
        return (
          <span key={i} className="pop" style={{ left: "50%", top: "45%", "--s": `${28 + (i % 4) * 10}px`,
            "--x": `${Math.cos(a) * d}vw`, "--y": `${Math.sin(a) * d * 0.8}vh`, "--rot": `${(i % 2 ? 1 : -1) * 40}deg`, animationDelay: `${(i % 5) * 0.06}s` }}>{e}</span>
        );
      })}
    </div>
  );
}

export default function Postcards() {
  const [at, setAt] = useState(0);
  const [burst, setBurst] = useState(false);
  const touch = useRef(null);
  const go = (n) => setAt((n + POSTCARDS.length) % POSTCARDS.length);

  useEffect(() => {
    if (burst) return;
    const t = setInterval(() => go(at + 1), 7000);
    return () => clearInterval(t);
  }, [at, burst]);

  return (
    <div className="cards"
      onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
      onTouchEnd={(e) => { const dx = e.changedTouches[0].clientX - touch.current; if (Math.abs(dx) > 40) go(at + (dx < 0 ? 1 : -1)); }}>
      <div style={{ overflow: "hidden", padding: "0 4px" }}>
        <div className="track" style={{ transform: `translateX(-${at * 100}%)` }}>
          {POSTCARDS.map((c, i) => (
            <div className="slide" key={c.photo}>
              <div className="postcard" style={{ "--r": `${i % 2 ? 1 : -1}deg` }}>
                <div className="pic" style={{ backgroundImage: `url(/photos/${c.photo}.jpg)` }} />
                <div className="back">
                  <div className="stamp">{c.stamp}</div>
                  <div className="postmark">MITHUN'S<br />SOULMATE<br />♥ 2026</div>
                  <div className="kicker">{c.kicker}</div>
                  <h3>{c.title}</h3>
                  <div className="hand script">{c.text}</div>
                  <div className="q">…but can your boyfriend do that? 🤔</div>
                  <button className="sync" onClick={() => setBurst(true)}>Does that sync with you? 💞</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button className="arrow prev" onClick={() => go(at - 1)} aria-label="Previous postcard">‹</button>
      <button className="arrow next" onClick={() => go(at + 1)} aria-label="Next postcard">›</button>
      <div className="dots">
        {POSTCARDS.map((c, i) => <button key={c.photo} className={i === at ? "on" : ""} onClick={() => go(i)} aria-label={`Postcard ${i + 1}`} />)}
      </div>
      {burst && <Burst onClose={() => setBurst(false)} />}
    </div>
  );
}
