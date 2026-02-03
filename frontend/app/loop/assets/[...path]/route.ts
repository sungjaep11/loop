import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

const ASSETS_DIR = path.join(process.cwd(), "public", "loop", "assets");

const CONTENT_TYPES: Record<string, string> = {
  ".js": "application/javascript",
  ".css": "text/css",
  ".map": "application/json",
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const pathSegments = (await params).path;
  if (!pathSegments?.length) {
    return new NextResponse(null, { status: 404 });
  }
  // Prevent path traversal
  if (pathSegments.some((p) => p === ".." || path.isAbsolute(p))) {
    return new NextResponse(null, { status: 400 });
  }
  const filePath = path.join(ASSETS_DIR, ...pathSegments);
  const resolved = path.resolve(filePath);
  if (!resolved.startsWith(path.resolve(ASSETS_DIR))) {
    return new NextResponse(null, { status: 400 });
  }
  try {
    const buf = await readFile(resolved);
    const ext = path.extname(resolved);
    const contentType = CONTENT_TYPES[ext] ?? "application/octet-stream";
    return new NextResponse(buf, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
