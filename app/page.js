"use client";
// Mithun's Soulmate: the intro, then the cute site: hero, gallery, postcards, the last blush, the video, facts, the test
// and the wall of applicants.
import { useCallback, useEffect, useState } from "react";
import Intro from "@/components/Intro";
import Butterflies from "@/components/Butterflies";
import Postcards from "@/components/Postcards";
import Blush from "@/components/Blush";
import Apply, { Wall } from "@/components/Apply";
import { COVER, FACTS, GALLERY, MITHUN_IG, MITHUN_IG_URL } from "@/lib/content";

function useCountdown() {
  const [left, setLeft] = useState("--:--:--");
  useEffect(() => {
    const tick = () => {
      const now = new Date(), end = new Date(now);
      end.setHours(24, 0, 0, 0);
      const s = Math.max(0, Math.floor((end - now) / 1000));
      setLeft([s / 3600, (s / 60) % 60, s % 60].map((n) => String(Math.floor(n)).padStart(2, "0")).join(":"));
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);
  return left;
}

export default function Home() {
  const [intro, setIntro] = useState(true);
  const [rows, setRows] = useState([]);
  const [zoom, setZoom] = useState(null);
  const left = useCountdown();
  const load = useCallback(() => fetch("/api/applicants").then((r) => r.json()).then(setRows).catch(() => {}), []);
  useEffect(() => {
    load();
    const q = new URLSearchParams(window.location.search);
    if (q.has("nointro")) setIntro(false);  // a direct link past the intro
    if (q.get("y")) setTimeout(() => window.scrollTo(0, +q.get("y")), 600);  // a link to a spot down the page
  }, [load]);

  return (
    <>
      {intro && <Intro onDone={() => setIntro(false)} />}
      <Butterflies />
      <div className="banner">🎂 <b>HAPPY BIRTHDAY MITHUN!</b> Applications close at midnight: <b>{left}</b> left</div>

      <header className="hero">
        <div className="wrap hero-grid">
          <div>
            <h1 className="logo cute">Mithun's Soulmate<small>™</small> <span className="bow">🎀</span></h1>
            <span className="tag">🎀 the cutest dating site on the internet 🎀</span>
            <p>Members: <b>one</b> very lovable boy from <b>Coimbatore (CBE) 📍</b>, fluent in Korean finger hearts 🫰. For his birthday, Mithun is accepting
              applications for <b>today only</b>. ✨</p>
            <div className="stats">
              <div className="stat"><b>1</b><small>adorable bachelor</small></div>
              <div className="stat"><b>{rows.length}</b><small>brave applicants</small></div>
              <div className="stat"><b>∞</b><small>finger hearts to give 🫰</small></div>
            </div>
            <a className="cta" href="#apply">💌 Apply to date Mithun</a>
            <a className="iglink" href={MITHUN_IG_URL} target="_blank" rel="noreferrer">or slide into his DMs: <b>{MITHUN_IG}</b> 📲</a>
          </div>
          <div className="cover">
            <figure className="polaroid"><img src={COVER} alt="Mithun" /><figcaption>the birthday boy 🎂</figcaption></figure>
            <span className="sticker s1">100% single 💖</span>
            <span className="sticker s2">finger heart certified 🫰</span>
            <span className="sticker s3">mom approved ✔</span>
          </div>
        </div>
      </header>

      <main className="wrap">
        <section id="talents">
          <h2 className="sec-title">What he can do 💌</h2>
          <p className="sub">Four postcards. Four talents. One question for your current boyfriend.</p>
          <Postcards />
        </section>

        <section id="gallery">
          <h2 className="sec-title">The gallery 📸</h2>
          <p className="sub">Meet the bachelor. Certified authentic photos. No filters were harmed. Tap one to see it big.</p>
          <div className="gallery">
            {GALLERY.map(([file, caption], i) => (
              <figure key={file} className="polaroid" style={{ "--tilt": `${(i % 2 ? 1 : -1) * (1 + (i % 3))}deg` }} onClick={() => setZoom([file, caption])}>
                <img src={`/photos/${file}.jpg`} alt="Mithun" loading="lazy" /><figcaption>{caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section>
          <h2 className="sec-title">Mithun in action 🎬</h2>
          <p className="sub">Live footage. Press play, fall in love.</p>
          <figure className="polaroid videoframe">
            <video src="/mithun_video.mp4" controls playsInline preload="metadata" /><figcaption>certified smooth ✨</figcaption>
          </figure>
        </section>

        <section id="blush">
          <h2 className="sec-title">The last blush 😳</h2>
          <p className="sub">A historic moment, preserved for science.</p>
          <Blush />
        </section>

        <section>
          <h2 className="sec-title">Fact sheet 📋</h2>
          <p className="sub">Verified by his friends, who are very trustworthy.</p>
          <div className="facts">{FACTS.map(([t, d]) => <div className="fact" key={t}><b>{t}</b>{d}</div>)}</div>
        </section>

        <section id="apply">
          <h2 className="sec-title">The compatibility test 💘</h2>
          <p className="sub">Our algorithm is extremely scientific. Answer honestly. Mithun will read every single one. Twice.</p>
          <Apply onApplied={load} />
        </section>

        <section id="wall">
          <h2 className="sec-title">Wall of applicants 🏆</h2>
          <p className="sub">Ranked by compatibility. Competition is fierce.</p>
          <Wall rows={rows} />
        </section>
      </main>

      <footer>Made with 💖 by Mithun's friends for his birthday. Mithun's Soulmate™ is not responsible for any actual romance that occurs.<br />
        Follow the birthday boy: <a href={MITHUN_IG_URL} target="_blank" rel="noreferrer">{MITHUN_IG}</a> 🫰</footer>
      {zoom && (
        <div className="lightbox" onClick={() => setZoom(null)}>
          <figure className="polaroid"><img src={`/photos/${zoom[0]}.jpg`} alt="Mithun" /><figcaption>{zoom[1]}</figcaption></figure>
        </div>
      )}
    </>
  );
}
