"use client";
// The compatibility test (Instagram handle required), the result with a heart rain, and the wall of applicants.
import { useEffect, useState } from "react";
import { MITHUN_IG, MITHUN_IG_URL, QUESTIONS } from "@/lib/content";

/** A selfie shrunk in the browser to a small JPEG data URL (keeps the database light). */
function shrink(file) {
  return new Promise((resolve) => {
    if (!file) return resolve("");
    const img = new Image();
    img.onload = () => {
      const side = 320, s = Math.min(1, side / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * s), c.height = Math.round(img.height * s);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      resolve(c.toDataURL("image/jpeg", 0.8));
    };
    img.onerror = () => resolve("");
    img.src = URL.createObjectURL(file);
  });
}

function rain() {
  for (let i = 0; i < 40; i++) {
    const h = document.createElement("div");
    h.className = "rain";
    h.textContent = ["💖", "🫰", "🎂", "🌸", "💕", "✨", "🎀", "🧸"][i % 8];
    h.style.left = Math.random() * 100 + "vw";
    h.style.animationDuration = 2 + Math.random() * 2.5 + "s";
    h.style.animationDelay = Math.random() * 0.8 + "s";
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 5000);
  }
}

export function Wall({ rows }) {
  return (
    <div className="wall">
      {rows.map((r, i) => (
        <div key={r.id} className={`row ${r.score ? "" : "dq"} ${i === 0 && r.score ? "top" : ""}`}>
          <div className="rank">{r.score ? i + 1 : "✗"}</div>
          {r.photo ? <img src={r.photo} alt="" /> : <div className="noimg">{r.score ? "💌" : "🤖"}</div>}
          <div className="who">
            <b>{r.name}{r.city ? ` · ${r.city}` : ""}</b>
            {r.score > 0 && <a href={`https://instagram.com/${r.instagram.replace(/^@/, "")}`} target="_blank" rel="noreferrer">{r.instagram}</a>}
            <small>{r.verdict}</small>
          </div>
          <div className="pct">{r.score}%</div>
        </div>
      ))}
    </div>
  );
}

export default function Apply({ onApplied }) {
  const [answers, setAnswers] = useState({});
  const [hair, setHair] = useState(7);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    if (QUESTIONS.some(([k]) => !answers[k])) return setError("Answer every question, Mithun is reading closely 👀");
    setBusy(true), setError("");
    try {
      const body = { name: f.get("name"), instagram: f.get("instagram"), city: f.get("city"),
        photo: await shrink(f.get("photo")?.size ? f.get("photo") : null), answers: { ...answers, hair: String(hair) } };
      const res = await fetch("/api/applicants", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const out = await res.json();
      if (!res.ok) throw new Error(out.error || "Something went wrong");
      setResult(out), rain(), e.target.reset(), setAnswers({}), setHair(7);
      onApplied();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <form className="apply" onSubmit={submit}>
        <div className="field"><label htmlFor="name">Your name <small>(Mithun will practise saying it in the mirror)</small></label>
          <input className="input" id="name" name="name" maxLength={60} required placeholder="e.g. The One" /></div>
        <div className="field"><label htmlFor="ig">Your Instagram handle <small>(required: he wants to follow you, respectfully)</small></label>
          <div className="ig"><span>@</span><input className="input" id="ig" name="instagram" required pattern="@?[A-Za-z0-9._]{1,30}" placeholder="your.handle" /></div></div>
        <div className="field"><label htmlFor="city">Where are you from? <small>(he will travel from CBE, by bus)</small></label>
          <input className="input" id="city" name="city" maxLength={60} placeholder="Anywhere with good biryani" /></div>
        <div className="field"><label htmlFor="photo">Your selfie <small>(optional, for verification by Mithun's mom)</small></label>
          <input id="photo" name="photo" type="file" accept="image/*" /></div>
        {QUESTIONS.map(([key, q, options]) => (
          <div className="field" key={key}><div className="label">{q}</div>
            <div className="choices">
              {options.map((o) => (
                <label key={o} className={answers[key] === o ? "on" : ""}>
                  <input type="radio" name={key} value={o} onChange={() => setAnswers({ ...answers, [key]: o })} />{o}
                </label>
              ))}
            </div>
          </div>
        ))}
        <div className="field"><label htmlFor="hair">Rate his haircut: <b>{hair}</b>/10 <small>(he is watching)</small></label>
          <input id="hair" type="range" min="1" max="10" value={hair} onChange={(e) => setHair(+e.target.value)} /></div>
        {error && <div className="error">{error}</div>}
        <button className="submit" disabled={busy}>{busy ? "Consulting the stars and Mithun's mom…" : "💘 Calculate our compatibility"}</button>
      </form>
      {result && (
        <div className="modal" onClick={() => setResult(null)}>
          <div className="result" onClick={(e) => e.stopPropagation()}>
            <h3>Your compatibility with Mithun</h3>
            <div className="big">{result.score}%</div>
            <p>{result.verdict}</p>
            <p style={{ color: "var(--muted)" }}>You are applicant #{result.id}, ranked #{result.rank} on the wall.</p>
            <a className="igbtn" href={MITHUN_IG_URL} target="_blank" rel="noreferrer">Send him a finger heart 🫰 {MITHUN_IG}</a>
            <button onClick={() => setResult(null)}>Back to the wall</button>
          </div>
        </div>
      )}
    </>
  );
}
