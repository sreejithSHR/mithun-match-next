"use client";
// His last recorded blush, three years ago, for a girl. He will blush the same for you. A day counter ticks up to
// the days since.
import { useEffect, useState } from "react";
import { BLUSH_PHOTO, BLUSH_SINCE } from "@/lib/content";

export default function Blush() {
  const total = Math.floor((Date.now() - new Date(BLUSH_SINCE).getTime()) / 86400000);
  const [days, setDays] = useState(0);
  useEffect(() => {
    let n = 0;
    const t = setInterval(() => {
      n = Math.min(total, n + Math.ceil(total / 60));
      setDays(n);
      if (n >= total) clearInterval(t);
    }, 30);
    return () => clearInterval(t);
  }, [total]);

  return (
    <div className="blush">
      <span className="blushmark" style={{ top: 16, right: 30 }}>///</span>
      <span className="blushmark" style={{ bottom: 20, left: 24, animationDelay: ".7s" }}>///</span>
      <div className="blushpic">
        <figure className="polaroid">
          <img src={BLUSH_PHOTO} alt="Mithun blushing" />
          <figcaption>exhibit A: on the phone with her 📞😳</figcaption>
        </figure>
        <div className="glow" />
      </div>
      <div>
        <span className="record">🔴 LAST BLUSH ON RECORD</span>
        <h2>3 years ago, for a girl, he blushed like this.</h2>
        <div className="days">{days.toLocaleString()}</div>
        <div style={{ color: "var(--muted)", fontWeight: 600 }}>days since his cheeks last turned pink</div>
        <p>Scientists say a blush this powerful can only be unlocked by the right person. The blush is still in there.
          It is waiting. <b>He will blush the same for you.</b> Possibly more. We have warned his cheeks.</p>
      </div>
    </div>
  );
}
