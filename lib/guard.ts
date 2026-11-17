import { getSession } from "@/lib/auth";

export async function adminGuard() {
  const session = await getSession();
  return session?.role === "admin" ? session : null;
}

export async function studentGuard() {
  const session = await getSession();
  return session?.role === "student" ? session : null;
}
