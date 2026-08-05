import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "sg_admin_session";

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

function token() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return "";
  return createHmac("sha256", secret).update("singapore-travel-admin-v1").digest("hex");
}

export function credentialsReady() {
  return Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD && process.env.SESSION_SECRET);
}

export function validCredentials(username: string, password: string) {
  if (!credentialsReady()) return false;
  return safeEqual(username, process.env.ADMIN_USERNAME!) && safeEqual(password, process.env.ADMIN_PASSWORD!);
}

export async function isAdmin() {
  const expected = token();
  const received = (await cookies()).get(COOKIE_NAME)?.value || "";
  return Boolean(expected && received && safeEqual(received, expected));
}

export async function createAdminSession() {
  (await cookies()).set(COOKIE_NAME, token(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function clearAdminSession() {
  (await cookies()).delete(COOKIE_NAME);
}
