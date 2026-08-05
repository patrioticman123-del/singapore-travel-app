import { put } from "@vercel/blob";
import { isAdmin } from "../../../lib/admin-auth";

export async function POST(request: Request) {
  if (!(await isAdmin())) return Response.json({ error: "只有管理者可以上傳共用封面" }, { status: 401 });
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return Response.json({ error: "缺少檔案" }, { status: 400 });
  if (!file.type.startsWith("image/")) return Response.json({ error: "僅支援圖片" }, { status: 400 });
  const blob = await put(`covers/${Date.now()}-${file.name}`, file, { access: "public", addRandomSuffix: true });
  return Response.json({ url: blob.url });
}
