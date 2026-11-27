// Where applicants are kept: Neon Postgres when DATABASE_URL is set (the live site), otherwise a JSON file in data/
// (testing on your own PC). The table is created on first use.
import { promises as fs } from "fs";
import path from "path";

const SEED = {
  name: "Claude (an AI)", instagram: "@anthropic", city: "The Cloud", photo: "", score: 0,
  verdict: "DISQUALIFIED: no body, can't eat biryani, and only free between API calls.",
};

async function neon() {
  const { neon } = await import("@neondatabase/serverless");
  const sql = neon(process.env.DATABASE_URL);
  await sql`CREATE TABLE IF NOT EXISTS applicants (
    id SERIAL PRIMARY KEY, name TEXT NOT NULL, instagram TEXT NOT NULL, city TEXT, answers JSONB,
    photo TEXT, score INT, verdict TEXT, created TIMESTAMPTZ DEFAULT now())`;
  const [{ n }] = await sql`SELECT COUNT(*)::int AS n FROM applicants`;
  if (n === 0) {
    await sql`INSERT INTO applicants (name, instagram, city, answers, photo, score, verdict)
              VALUES (${SEED.name}, ${SEED.instagram}, ${SEED.city}, '{}', '', ${SEED.score}, ${SEED.verdict})`;
  }
  return sql;
}

const FILE = path.join(process.cwd(), "data", "applicants.json");

async function readFile() {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8"));
  } catch {
    return [{ id: 1, ...SEED, answers: {}, created: new Date().toISOString() }];
  }
}

/** Every applicant, best match first. */
export async function listApplicants() {
  if (process.env.DATABASE_URL) {
    const sql = await neon();
    return sql`SELECT id, name, instagram, city, photo, score, verdict, created FROM applicants ORDER BY score DESC, id`;
  }
  return (await readFile()).sort((a, b) => b.score - a.score || a.id - b.id);
}

/** Saves an applicant; returns { id, rank }. */
export async function addApplicant(a) {
  if (process.env.DATABASE_URL) {
    const sql = await neon();
    const [{ id }] = await sql`INSERT INTO applicants (name, instagram, city, answers, photo, score, verdict)
      VALUES (${a.name}, ${a.instagram}, ${a.city}, ${JSON.stringify(a.answers)}, ${a.photo}, ${a.score}, ${a.verdict}) RETURNING id`;
    const [{ above }] = await sql`SELECT COUNT(*)::int AS above FROM applicants WHERE score > ${a.score}`;
    return { id, rank: above + 1 };
  }
  const all = await readFile();
  const id = Math.max(0, ...all.map((x) => x.id)) + 1;
  all.push({ id, ...a, created: new Date().toISOString() });
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(all, null, 1));
  return { id, rank: all.filter((x) => x.score > a.score).length + 1 };
}

/** Every applicant with all fields (answers included), newest first. For the admin page only. */
export async function listApplicantsFull() {
  if (process.env.DATABASE_URL) {
    const sql = await neon();
    return sql`SELECT id, name, instagram, city, answers, photo, score, verdict, created FROM applicants ORDER BY id DESC`;
  }
  return (await readFile()).sort((a, b) => b.id - a.id);
}

/** Removes one applicant by id; returns true when a row was deleted. */
export async function deleteApplicant(id) {
  if (process.env.DATABASE_URL) {
    const sql = await neon();
    const rows = await sql`DELETE FROM applicants WHERE id = ${id} RETURNING id`;
    return rows.length > 0;
  }
  const all = await readFile();
  const kept = all.filter((x) => x.id !== id);
  if (kept.length === all.length) return false;
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(kept, null, 1));
  return true;
}
