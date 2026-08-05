import { list, put } from "@vercel/blob";
import { isAdmin } from "../../../lib/admin-auth";

const STATE_PATH = "shared/singapore-travel-state.json";

export async function GET() {
  try {
    const result = await list({ prefix: STATE_PATH, limit: 1 });
    if (!result.blobs[0]) return Response.json({ hero: null, days: null, version: 0 });
    const response = await fetch(result.blobs[0].url, { cache: "no-store" });
    if (!response.ok) throw new Error("state unavailable");
    return Response.json(await response.json(), { headers: { "cache-control": "no-store" } });
  } catch {
    return Response.json({ hero: null, days: null, version: 0 });
  }
}

export async function PUT(request: Request) {
  if (!(await isAdmin())) return Response.json({ error: "只有管理者可以發布共用行程" }, { status: 401 });
  const body = await request.json();
  const state = { hero: body.hero, days: body.days, version: Date.now() };
  await put(STATE_PATH, JSON.stringify(state), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
  return Response.json({ version: state.version });
}
