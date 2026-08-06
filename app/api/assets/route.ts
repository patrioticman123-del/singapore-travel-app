import { isAdmin } from "../../../lib/admin-auth";
import { assetIdFromUrl, deleteAsset, saveAsset } from "../../../lib/redis-storage";

export async function POST(request:Request){
  if(!(await isAdmin()))return Response.json({error:"只有管理者可以上傳共用封面"},{status:401});
  const form=await request.formData(),file=form.get("file"),replaceUrl=String(form.get("replaceUrl")||"");
  if(!(file instanceof File))return Response.json({error:"缺少檔案"},{status:400});
  if(!file.type.startsWith("image/"))return Response.json({error:"僅支援圖片"},{status:400});
  if(file.size>4*1024*1024)return Response.json({error:"圖片必須小於 4 MB"},{status:413});
  const saved=await saveAsset(await file.arrayBuffer(),file.type,file.name);
  const previousId=assetIdFromUrl(replaceUrl);if(previousId)await deleteAsset(previousId);
  return Response.json({url:saved.url});
}
