// GET: the wall of applicants. POST: apply (name, Instagram handle, answers, optional small selfie).
import { createHash } from "crypto";
import { addApplicant, listApplicants } from "@/lib/store";

export const dynamic = "force-dynamic";

const VERDICTS = [
  [99, "SOUL MATES. Mithun has already named your future goldfish."],
  [95, "Dangerously compatible. Mithun is ironing his one good shirt as we speak."],
  [90, "Strong match! Our algorithm (a coin and a prayer) is very confident."],
  [80, "Promising. Mithun says he can work with this. He can work with anything."],
  [0, "Low score, but Mithun has reviewed it and is willing to overlook this."],
];

/** A very scientific score: always generous, and the same answers always give the same number. */
function score(name, answers) {
  const h = parseInt(createHash("sha256").update(name.toLowerCase() + JSON.stringify(answers)).digest("hex").slice(0, 8), 16);
  let s = 78 + (h % 23);
  if (answers.heart?.startsWith("A finger heart")) s += 3;
  if (answers.biryani === "Biryani, obviously") s += 2;
  s = Math.min(s, 100);
  return { score: s, verdict: VERDICTS.find(([m]) => s >= m)[1] };
}

export async function GET() {
  return Response.json(await listApplicants());
}

export async function POST(req) {
  const body = await req.json().catch(() => null);
  if (!body) return Response.json({ error: "Mithun couldn't read that. Try again?" }, { status: 400 });
  const name = String(body.name || "").trim().slice(0, 60);
  let instagram = String(body.instagram || "").trim().replace(/^@?/, "@");
  if (!name) return Response.json({ error: "Mithun needs at least a name to whisper." }, { status: 400 });
  if (!/^@[A-Za-z0-9._]{1,30}$/.test(instagram)) {
    return Response.json({ error: "We need your real Instagram handle, so Mithun can follow you (respectfully)." }, { status: 400 });
  }
  const photo = typeof body.photo === "string" && body.photo.startsWith("data:image/") && body.photo.length < 400_000 ? body.photo : "";
  const answers = Object.fromEntries(Object.entries(body.answers || {}).map(([k, v]) => [k.slice(0, 20), String(v).slice(0, 80)]));
  const { score: s, verdict } = score(name, answers);
  const city = String(body.city || "").trim().slice(0, 60);
  const { id, rank } = await addApplicant({ name, instagram, city, answers, photo, score: s, verdict });
  return Response.json({ id, rank, score: s, verdict });
}
