import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/library/supabaseClient";
import { uploadImageToStorage } from "../library/uploadImageToStorage";

function getUserId(request: NextRequest): number | null {
  const raw = request.headers.get("x-user-id");
  if (!raw) return null;
  const id = Number(raw);
  return Number.isFinite(id) ? id : null;
}

function isAdmin(request: NextRequest): boolean {
  const role = request.headers.get("x-user-role");
  const roleId = request.headers.get("x-user-role-id");
  return role?.toLowerCase() === "admin" || roleId === "1";
}

function unauthorized() {
  return NextResponse.json({ success: false, message: "Unauthorised" }, { status: 401 });
}

function forbidden() {
  return NextResponse.json({ success: false, message: "Forbidden - Admin only" }, { status: 403 });
}

function badRequest(message: string, errors?: Record<string, string>) {
  return NextResponse.json({ success: false, message, ...(errors && { errors }) }, { status: 400 });
}

function serverError(message = "Internal server error") {
  return NextResponse.json({ success: false, message }, { status: 500 });
}

export async function GET() {
  try {
    const { data: galleryImages, error } = await supabase
      .from("gallery_images")
      .select("id, title, img_url, created_at, created_by")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[GET /api/gallery] error:", error);
      return serverError(`Failed to fetch gallery images: ${error.message}`);
    }

    return NextResponse.json(
      {
        success: true,
        galleryImages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[GET /api/gallery] error:", error);
    return serverError("Failed to fetch gallery images");
  }
}

export async function POST(request: NextRequest) {
  const userId = getUserId(request);

  if (!userId) return unauthorized();
  if (!isAdmin(request)) return forbidden();

  try {
    const formData = await request.formData();

    const title = formData.get("title")?.toString().trim();
    const image = formData.get("image") as File | null;

    const errors: Record<string, string> = {};

    if (!title) errors.title = "Title is required";
    if (!image) errors.image = "Image file is required";

    if (Object.keys(errors).length > 0) {
      return badRequest("Validation failed", errors);
    }

    const uploaded = await uploadImageToStorage({
      file: image as File,
      bucket: "gallery-images",
      folder: "gallery",
      prefix: "gallery",
      userId,
    });

    const { data: galleryImage, error } = await supabase
      .from("gallery_images")
      .insert({
        title,
        img_url: uploaded.publicUrl,
        created_by: userId,
      })
      .select("id, title, img_url, created_at, created_by")
      .single();

    if (error) {
      console.error("[POST /api/gallery] insert error:", error);
      return serverError(`Failed to create gallery image: ${error.message}`);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Gallery image added successfully",
        galleryImage,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/gallery] error:", error);
    const message = error instanceof Error ? error.message : "Failed to add gallery image";
    return serverError(message);
  }
}