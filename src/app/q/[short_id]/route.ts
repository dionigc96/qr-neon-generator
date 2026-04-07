import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ short_id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { short_id } = resolvedParams;

    // 1. Fetch QR code data
    const { data: qrData, error } = await supabase
      .from("qr_codes")
      .select("id, type, content, is_dynamic, expires_at")
      .eq("short_id", short_id)
      .single();

    if (error || !qrData) {
      console.error("Error fetching QR or not found:", error);
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (qrData.expires_at) {
      if (new Date(qrData.expires_at) < new Date()) {
         // Custom routing for expired QR
         return NextResponse.redirect(new URL("/expired", request.url));
      }
    }

    // 2. Analytics Tracking (Non-blocking)
    const userAgent = request.headers.get("user-agent") || "unknown";
    const country = request.headers.get("x-vercel-ip-country") || "Unknown";
    
    supabase
      .from("qr_analytics")
      .insert([
        {
          qr_code_id: qrData.id,
          user_agent: userAgent,
          country: country,
        },
      ])
      .then(({ error }) => {
        if (error) console.error("Error logging analytics:", error);
      });

    // 3. Routing Logic
    const directUrlTypes = ["url", "file", "form", "menu", "landing", "smarturl", "gs1", "mp3", "video"];
    
    if (directUrlTypes.includes(qrData.type) && qrData.content?.url) {
      // Direct 302 Redirect to external absolute URL
      let dest = qrData.content.url;
      // Ensure it has http/https
      if (!dest.startsWith("http://") && !dest.startsWith("https://")) {
        dest = `https://${dest}`;
      }
      return NextResponse.redirect(dest, { status: 302 });
    }
    
    if (qrData.type === "appstore" && qrData.content) {
       const isIOS = /iPad|iPhone|iPod/.test(userAgent);
       const isAndroid = /android/i.test(userAgent);
       let dest = "https://example.com";
       if (isIOS && qrData.content.ios) dest = qrData.content.ios;
       else if (isAndroid && qrData.content.android) dest = qrData.content.android;
       else dest = qrData.content.ios || qrData.content.android || "https://example.com";
       
       if (!dest.startsWith("http://") && !dest.startsWith("https://")) {
         dest = `https://${dest}`;
       }
       return NextResponse.redirect(dest, { status: 302 });
    }

    // Fallback or specific visual representation for vCards, Wifi, linkpage etc.
    return NextResponse.redirect(new URL(`/view/${short_id}`, request.url));
  } catch (err) {
    console.error("Unexpected error in routing:", err);
    return NextResponse.redirect(new URL("/", request.url));
  }
}
