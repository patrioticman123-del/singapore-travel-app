import { createAdminSession, credentialsReady, validCredentials } from "../../../../lib/admin-auth";

export async function POST(request: Request) {
  if (!credentialsReady()) return Response.json({ error: "管理者帳號尚未設定" }, { status: 503 });
  const body = await request.json().catch(() => ({}));
  if (!validCredentials(String(body.username || ""), String(body.password || ""))) {
    return Response.json({ error: "帳號或密碼錯誤" }, { status: 401 });
  }
  await createAdminSession();
  return Response.json({ admin: true });
}
