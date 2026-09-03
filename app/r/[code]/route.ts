import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

export const runtime = "edge";
export async function GET(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params; const supabase = createServiceClient();
  const { data } = await supabase.from("qr_codes").select("id,target_url,status").eq("short_code", code.toUpperCase()).maybeSingle();
  if (!data || data.status !== "active" || !data.target_url) return NextResponse.redirect(new URL("/inactive", request.url), 302);
  const { error: scanError } = await supabase.from("scan_events").insert({ qr_code_id: data.id, user_agent: request.headers.get("user-agent"), referrer: request.headers.get("referer") });
  if (scanError) console.error("Failed to record QR scan", scanError);
  return NextResponse.redirect(data.target_url, 302);
}
