import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { hashPassword } from "@/lib/auth";

export type Student = {
  id: string;
  username: string;
  name: string;
  passwordHash: string;
  createdAt: string;
  lastSeen: string | null;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  dueAt: string | null;
  studentIds: string[];
  createdAt: string;
};

export type Attachment = {
  name: string;
  type: string;
  size: number;
  dataUrl: string;
};

export type Update = {
  id: string;
  title: string;
  notes: string;
  releaseAt: string | null;
  released: boolean;
  createdAt: string;
  studentIds: string[];
  asksAnswer: boolean;
  attachment: Attachment | null;
};

export type Answer = {
  id: string;
  updateId: string;
  studentId: string;
  content: string;
  updatedAt: string;
};

export type Submission = {
  id: string;
  studentId: string;
  score: number;
  total: number;
  at: string;
};

export type ActivityEvent = { id: string; studentId: string; path: string; at: string };

export type Bug = {
  id: string;
  message: string;
  path: string;
  username: string;
  at: string;
  fixed: boolean;
};

export type LoginEvent = {
  id: string;
  username: string;
  role: "admin" | "student" | "okänd";
  ok: boolean;
  at: string;
};

export type Database = {
  admin: { username: string; passwordHash: string };
  students: Student[];
  tasks: Task[];
  updates: Update[];
  answers: Answer[];
  submissions: Submission[];
  activity: ActivityEvent[];
  bugs: Bug[];
  logins: LoginEvent[];
};

// I webbversionen ligger datan i projektets .data, i desktop-appen i
// användarens appdata (ELDA_DATA_DIR sätts av Electron).
const DIR = process.env.ELDA_DATA_DIR ?? path.join(process.cwd(), ".data");
const FILE = path.join(DIR, "db.json");

export const ADMIN_USERNAME = "ejentu01";
const ADMIN_SEED_PASSWORD = "Mamma2024";

function empty(): Database {
  return {
    admin: { username: ADMIN_USERNAME, passwordHash: "" },
    students: [],
    tasks: [],
    updates: [],
    answers: [],
    submissions: [],
    activity: [],
    bugs: [],
    logins: [],
  };
}

async function seed(): Promise<Database> {
  const db = empty();
  db.admin.passwordHash = hashPassword(ADMIN_SEED_PASSWORD);
  await save(db);
  return db;
}

async function save(db: Database) {
  await fs.mkdir(DIR, { recursive: true });
  const tmp = `${FILE}.${randomUUID()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(db, null, 2), "utf8");
  await fs.rename(tmp, FILE);
}

async function exists(): Promise<boolean> {
  try {
    await fs.access(FILE);
    return true;
  } catch {
    return false;
  }
}

// Äldre databasfiler saknar nya fält — fyll i dem så appen inte kraschar.
function normalize(db: Database): Database {
  db.students ??= [];
  db.tasks ??= [];
  db.updates ??= [];
  db.answers ??= [];
  db.submissions ??= [];
  db.activity ??= [];
  db.bugs ??= [];
  db.logins ??= [];

  for (const update of db.updates) {
    update.studentIds ??= [];
    update.asksAnswer ??= false;
    update.attachment ??= null;
    update.notes ??= "";
  }

  return db;
}

export async function readDb(): Promise<Database> {
  if (!(await exists())) return seed();
  try {
    return normalize(JSON.parse(await fs.readFile(FILE, "utf8")) as Database);
  } catch {
    return seed();
  }
}

let queue: Promise<unknown> = Promise.resolve();

export function updateDb<T>(mutate: (db: Database) => T | Promise<T>): Promise<T> {
  const run = queue.then(async () => {
    const db = await readDb();
    const result = await mutate(db);
    await save(db);
    return result;
  });

  queue = run.then(
    () => undefined,
    () => undefined,
  );

  return run;
}

export function limit<T>(items: T[], max: number): T[] {
  return items.length > max ? items.slice(items.length - max) : items;
}
