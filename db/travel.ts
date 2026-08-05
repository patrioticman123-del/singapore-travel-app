import { env } from "cloudflare:workers";

type TravelEnv = { DB:D1Database; TICKETS:R2Bucket };
export const travelEnv = env as unknown as TravelEnv;

export async function ensureTravelSchema() {
  const db=travelEnv.DB;
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS app_state (id INTEGER PRIMARY KEY, payload TEXT NOT NULL, version INTEGER NOT NULL DEFAULT 1, updated_at TEXT NOT NULL)`),
    db.prepare(`CREATE TABLE IF NOT EXISTS tickets (id TEXT PRIMARY KEY, event_id TEXT NOT NULL, name TEXT NOT NULL, number TEXT NOT NULL DEFAULT '', file_key TEXT, file_name TEXT, file_type TEXT, created_at TEXT NOT NULL)`),
    db.prepare(`CREATE INDEX IF NOT EXISTS idx_tickets_event_id ON tickets(event_id)`),
  ]);
}

export async function listTickets() {
  await ensureTravelSchema();
  const result=await travelEnv.DB.prepare(`SELECT id, event_id AS eventId, name, number, file_name AS fileName, file_type AS fileType, file_key AS fileKey FROM tickets ORDER BY created_at ASC`).all<Record<string,string|null>>();
  return result.results.map(ticket=>({ ...ticket, fileUrl:ticket.fileKey?`/api/tickets/${ticket.id}`:undefined, fileKey:undefined }));
}
