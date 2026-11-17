import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export type Role = "admin" | "student";

export type Session = {
  sub: string;
  username: string;
  name: string;
  role: Role;
  exp: number;
};

const COOKIE = "elda_session";
const MAX_AGE = 60 * 60 * 24 * 7;
const SECRET = process.env.AUTH_SECRET ?? "utvecklingsnyckel-byt-denna";

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const key = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${key}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, key] = stored.split(":");
  if (!salt || !key) return false;

  const expected = Buffer.from(key, "hex");
  const actual = scryptSync(password, salt, 64);
  if (expected.length !== actual.length) return false;

  return timingSafeEqual(expected, actual);
}

function sign(value: string): string {
  return createHmac("sha256", SECRET).update(value).digest("base64url");
}

export function createToken(session: Omit<Session, "exp">): string {
  const payload: Session = {
    ...session,
    exp: Date.now() + MAX_AGE * 1000,
  };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body)}`;
}

export function readToken(token: string | undefined): Session | null {
  if (!token) return null;

  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  const expected = Buffer.from(sign(body));
  const given = Buffer.from(signature);
  if (expected.length !== given.length) return null;
  if (!timingSafeEqual(expected, given)) return null;

  try {
    const session = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8"),
    ) as Session;

    if (!session.exp || session.exp < Date.now()) return null;
    if (session.role !== "admin" && session.role !== "student") return null;

    return session;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  return readToken(store.get(COOKIE)?.value);
}

export async function setSessionCookie(session: Omit<Session, "exp">) {
  const store = await cookies();
  store.set(COOKIE, createToken(session), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: MAX_AGE,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(COOKIE);
}
