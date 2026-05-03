import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/library/supabaseClient";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);

    const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10) || 1);
    const pageSize = Math.min(
      50,
      Math.max(1, parseInt(url.searchParams.get("pageSize") ?? "9", 10) || 9)
    );
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from("blogs")
      .select("id, title, description, cover_img, published_date", { count: "exact" })
      .order("published_date", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("[GET /api/home/blogs] error:", error);
      return NextResponse.json(
        { success: false, message: "Failed to fetch blogs" },
        { status: 500 }
      );
    }

    const total = count ?? 0;

    return NextResponse.json({
      success: true,
      data: data ?? [],
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("[GET /api/home/blogs] error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
