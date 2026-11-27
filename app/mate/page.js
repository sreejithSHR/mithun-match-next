"use client";
// /mate: Mithun's private list of everyone who applied, with selfie, Instagram, city, quiz answers and score.
// Asks for ADMIN_PASSWORD once per browser tab; can delete prank entries and download everything as CSV.
import { useEffect, useState } from "react";
import { QUESTIONS } from "@/lib/content";

const KEY = "mate-key";
const LABELS = Object.fromEntries(QUESTIONS.map(([id, q]) => [id, q]));

/** Reads a value from sessionStorage, or "" when storage is blocked. */
function remembered() {
  try { return sessionStorage.getItem(KEY) || ""; } catch { return ""; }
}

/** Saves (or clears, when empty) the password for this tab. */
function remember(v) {
  try { v ? sessionStorage.setItem(KEY, v) : sessionStorage.removeItem(KEY); } catch {}
}

/** Builds a CSV file of every applicant and starts the download. */
function downloadCsv(rows) {
  const cols = ["id", "name", "instagram", "city", "score", "verdict", "created", ...QUESTIONS.map(([id]) => id)];
  const cell = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = rows.map((r) => cols.map((c) => cell(c in r ? r[c] : r.answers?.[c])).join(","));
  const blob = new Blob(["﻿" + [cols.join(","), ...lines].join("\n")], { type: "text/csv" });
  const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: "mithuns-dates.csv" });
  a.click();
  URL.revokeObjectURL(a.href);
}

function DateCard({ d, onDelete }) {
  const handle = d.instagram.replace(/^@/, "");
  return (
    <div className="mate">
      {d.photo ? <img src={d.photo} alt={d.name} /> : <div className="nophoto">🙈</div>}
      <div className="who">
        <div className="top">
          <h3>{d.name}</h3>
          <span className="score">{d.score}%</span>
        </div>
        <a href={`https://instagram.com/${handle}`} target="_blank" rel="noreferrer">{d.instagram}</a>
        <div className="meta">{d.city || "city unknown"} · {new Date(d.created).toLocaleString()}</div>
        <dl>
          {Object.entries(d.answers || {}).map(([k, v]) => (
            <div key={k}><dt>{LABELS[k] || k}</dt><dd>{v}</dd></div>
          ))}
        </dl>
        <button className="del" onClick={() => onDelete(d)}>Delete</button>
      </div>
    </div>
  );
}

export default function Mate() {
  const [key, setKey] = useState("");
  const [typed, setTyped] = useState("");
  const [rows, setRows] = useState(null);
  const [error, setError] = useState("");

  const load = async (k) => {
    setError("");
    const res = await fetch("/api/mate", { headers: { "x-admin-key": k }, cache: "no-store" });
    if (!res.ok) { remember(""); setKey(""); setRows(null); setError(res.status === 401 ? "Wrong password." : "Could not load."); return; }
    remember(k); setKey(k); setRows(await res.json());
  };

  useEffect(() => { const k = remembered(); if (k) load(k); }, []);

  const onDelete = async (d) => {
    if (!confirm(`Delete ${d.name} (${d.instagram})?`)) return;
    const res = await fetch(`/api/mate?id=${d.id}`, { method: "DELETE", headers: { "x-admin-key": key } });
    if (res.ok) setRows((r) => r.filter((x) => x.id !== d.id));
  };

  if (!key) {
    return (
      <main className="wrap matepage">
        <form className="matelogin" onSubmit={(e) => { e.preventDefault(); load(typed); }}>
          <h1 className="cute">Mithun's dates 💌</h1>
          <input className="input" type="password" placeholder="Password" value={typed} onChange={(e) => setTyped(e.target.value)} autoFocus />
          <button className="sync" type="submit">Let me in</button>
          {error && <p className="err">{error}</p>}
        </form>
      </main>
    );
  }

  const real = (rows || []).filter((r) => r.instagram !== "@anthropic");
  return (
    <main className="wrap matepage">
      <div className="matehead">
        <h1 className="cute">Mithun's dates 💌</h1>
        <div className="matebtns">
          <span>{real.length} applied</span>
          <button onClick={() => load(key)}>Refresh</button>
          <button onClick={() => downloadCsv(real)} disabled={!real.length}>Download CSV</button>
          <button onClick={() => { remember(""); setKey(""); setRows(null); }}>Log out</button>
        </div>
      </div>
      {rows === null ? <p>Loading…</p> : real.length === 0 ? <p>No dates yet. Share the link! 🥺</p> : (
        <div className="mategrid">{real.map((d) => <DateCard key={d.id} d={d} onDelete={onDelete} />)}</div>
      )}
    </main>
  );
}
