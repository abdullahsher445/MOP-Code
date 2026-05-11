import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/library/supabaseClient";
import { uploadImageToStorage } from "../../library/uploadImageToStorage";

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

function badRequest(message: string) {
  return NextResponse.json({ success: false, message }, { status: 400 });
}

function notFound(message = "Gallery image not found") {
  return NextResponse.json({ success: false, message }, { status: 404 });
}

function serverError(message = "Internal server error") {
  return NextResponse.json({ success: false, message }, { status: 500 });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = getUserId(request);

  if (!userId) return unauthorized();
  if (!isAdmin(request)) return forbidden();

  const galleryImageId = Number(params.id);

  if (!Number.isFinite(galleryImageId)) {
    return badRequest("Invalid gallery image id");
  }

  try {
    const formData = await request.formData();

    const title = formData.get("title")?.toString().trim();
    const image = formData.get("image") as File | null;

    if (!title && !image) {
      return badRequest("At least one field is required to update");
    }

    const updatePayload: {
      title?: string;
      img_url?: string;
    } = {};

    if (title) {
      updatePayload.title = title;
    }

    if (image) {
      const uploaded = await uploadImageToStorage({
        file: image,
        bucket: "gallery-images",
        folder: "gallery",
        prefix: "gallery",
        userId,
      });

      updatePayload.img_url = uploaded.publicUrl;
    }

    const { data: galleryImage, error } = await supabase
      .from("gallery_images")
      .update(updatePayload)
      .eq("id", galleryImageId)
      .select("id, title, img_url, created_at, created_by")
      .single();

    if (error) {
      console.error("[PUT /api/gallery/[id]] update error:", error);
      return serverError(`Failed to update gallery image: ${error.message}`);
    }

    if (!galleryImage) return notFound();

    return NextResponse.json(
      {
        success: true,
        message: "Gallery image updated successfully",
        galleryImage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[PUT /api/gallery/[id]] error:", error);
    const message = error instanceof Error ? error.message : "Failed to update gallery image";
    return serverError(message);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = getUserId(request);

  if (!userId) return unauthorized();
  if (!isAdmin(request)) return forbidden();

  const galleryImageId = Number(params.id);

  if (!Number.isFinite(galleryImageId)) {
    return badRequest("Invalid gallery image id");
  }

  try {
    const { data: existingImage, error: fetchError } = await supabase
      .from("gallery_images")
      .select("id")
      .eq("id", galleryImageId)
      .single();

    if (fetchError || !existingImage) {
      return notFound();
    }

    const { error } = await supabase
      .from("gallery_images")
      .delete()
      .eq("id", galleryImageId);

    if (error) {
      console.error("[DELETE /api/gallery/[id]] delete error:", error);
      return serverError(`Failed to delete gallery image: ${error.message}`);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Gallery image deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[DELETE /api/gallery/[id]] error:", error);
    return serverError("Failed to delete gallery image");
  }
}