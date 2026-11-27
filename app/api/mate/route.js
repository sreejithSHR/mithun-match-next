// The dates API (for /mate), password protected. GET: every applicant with full details. DELETE ?id=N: remove one applicant.
import { isAdmin } from "@/lib/adminAuth";
import { deleteApplicant, listApplicantsFull } from "@/lib/store";

export const dynamic = "force-dynamic";

const denied = () => Response.json({ error: "Wrong password." }, { status: 401 });

export async function GET(req) {
  if (!isAdmin(req)) return denied();
  return Response.json(await listApplicantsFull());
}

export async function DELETE(req) {
  if (!isAdmin(req)) return denied();
  const id = Number(new URL(req.url).searchParams.get("id"));
  if (!Number.isInteger(id) || id < 1) return Response.json({ error: "Bad id." }, { status: 400 });
  return Response.json({ deleted: await deleteApplicant(id) });
}
