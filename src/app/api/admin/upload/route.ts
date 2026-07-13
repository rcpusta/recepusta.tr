import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const runtime = "nodejs";

const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

const VIDEO_TYPES = new Set(["video/mp4", "video/webm", "video/ogg", "video/quicktime"]);

const IMAGE_MAX = 8 * 1024 * 1024;
const VIDEO_MAX = 120 * 1024 * 1024;

function extFromType(type: string, filename: string) {
  switch (type) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    case "image/avif":
      return "avif";
    case "video/mp4":
      return "mp4";
    case "video/webm":
      return "webm";
    case "video/ogg":
      return "ogg";
    case "video/quicktime":
      return "mov";
    default: {
      const fromName = filename.split(".").pop()?.toLowerCase();
      return fromName || "bin";
    }
  }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  try {
    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 });
    }

    const isImage = IMAGE_TYPES.has(file.type);
    const isVideo = VIDEO_TYPES.has(file.type);

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: "Desteklenen: görsel (JPG/PNG/WEBP/GIF) veya video (MP4/WEBM/MOV)" },
        { status: 400 }
      );
    }

    const max = isVideo ? VIDEO_MAX : IMAGE_MAX;
    if (file.size > max) {
      return NextResponse.json(
        { error: isVideo ? "Video 120MB’dan büyük olamaz" : "Görsel 8MB’dan büyük olamaz" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const folder = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(folder, { recursive: true });

    const name = `upload_${Date.now().toString(36)}_${Math.random()
      .toString(36)
      .slice(2, 8)}.${extFromType(file.type, file.name)}`;
    await fs.writeFile(path.join(folder, name), buffer);

    return NextResponse.json({
      url: `/uploads/${name}`,
      kind: isVideo ? "video" : "image",
    });
  } catch {
    return NextResponse.json({ error: "Yükleme başarısız" }, { status: 500 });
  }
}
