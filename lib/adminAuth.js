// Checks the admin password sent by the admin page against ADMIN_PASSWORD (set in .env or on Hostinger).
import { createHash, timingSafeEqual } from "crypto";

const digest = (s) => createHash("sha256").update(String(s)).digest();

/** True when the request's x-admin-key header matches ADMIN_PASSWORD. Always false if no password is set. */
export function isAdmin(req) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return timingSafeEqual(digest(req.headers.get("x-admin-key") || ""), digest(expected));
}
