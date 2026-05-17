"use client";

import { useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { FolderPlus, ImagePlus, Save } from "lucide-react";
import AdminToast from "@/components/admin/AdminToast";

function getAuthHeaders() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user.userId ?? user.id ?? localStorage.getItem("userId") ?? "";
  const roleId = user.roleId ?? user.role_id ?? "";
  const token = user.token ?? "";

  return {
    "x-user-id": String(userId),
    "x-user-role-id": String(roleId),
    "x-user-role": user.roleName ?? user.role_name ?? "",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export default function AddCategoryPage() {
  const router = useRouter();
  const { locale } = useParams() as { locale: string };

  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function handleRemoveImage() {
    setImageFile(null);
    setImagePreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const authHeaders = getAuthHeaders();

      let coverImgUrl: string | null = null;

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("folder", "categories");

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          headers: authHeaders,
          body: formData,
        });

        const uploadJson = await uploadRes.json();

        if (!uploadJson.success) {
          const message =
            "Image upload failed: " + (uploadJson.message || "Unknown error");

          setError(message);
          setToast({ message, type: "error" });
          setLoading(false);
          return;
        }

        coverImgUrl = uploadJson.url;
      }

      const res = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify({
          category_name: categoryName,
          description,
          cover_img: coverImgUrl,
        }),
      });

      const json = await res.json();

      if (!json.success) {
        const message = json.message || "Failed to create category.";

        setError(message);
        setToast({ message, type: "error" });
        setLoading(false);
        return;
      }

      setToast({ message: "Category added successfully.", type: "success" });

      setTimeout(() => {
        router.push(`/${locale}/admin/categories`);
      }, 1000);
    } catch {
      setError("Failed to create category.");
      setToast({ message: "Failed to add category.", type: "error" });
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-full rounded-3xl border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-6 lg:p-8">
      {toast && (
        <AdminToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="mb-6 flex items-start gap-3 sm:mb-7 sm:items-center">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAFBF0] text-[#1F8F50] sm:h-12 sm:w-12">
          <FolderPlus size={22} />
        </div>

        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-[#1A1A1A] sm:text-xl">
            Add Category
          </h2>

          <p className="mt-1 text-sm leading-5 text-[#687280]">
            Create a new category for your website content.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
        {/* Title */}
        <div>
          <label className="mb-2 block text-sm font-medium text-[#1A1A1A]">
            Title <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            required
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Enter category title"
            className="w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 text-sm outline-none transition focus:border-[#2DBE6C] focus:bg-white focus:ring-2 focus:ring-[#2DBE6C]/20"
          />
        </div>

        {/* Description */}
        <div>
          <label className="mb-2 block text-sm font-medium text-[#1A1A1A]">
            Description
          </label>

          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter category description"
            className="w-full resize-none rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 text-sm outline-none transition focus:border-[#2DBE6C] focus:bg-white focus:ring-2 focus:ring-[#2DBE6C]/20"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="mb-3 block text-sm font-medium text-[#1A1A1A]">
            Category Image
          </label>

          <div
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                fileInputRef.current?.click();
              }
            }}
            className="cursor-pointer rounded-2xl border-2 border-dashed border-[#CFEFD9] bg-[#F8FFFA] px-4 py-8 text-center sm:p-8"
          >
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAFBF0] text-[#1F8F50] sm:h-12 sm:w-12">
              <ImagePlus size={22} />
            </div>

            <h3 className="mt-3 text-sm font-semibold text-[#1A1A1A]">
              Upload category image
            </h3>

            <p className="mx-auto mt-1 max-w-sm text-sm leading-5 text-[#687280]">
              Drag and drop your image here or click to browse.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleFileChange}
            />

            {imagePreview && (
              <img
                src={imagePreview}
                alt="Category preview"
                className="mx-auto mt-4 h-32 w-full max-w-xs rounded-xl object-cover"
              />
            )}

            {imagePreview && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage();
                }}
                className="mt-3 text-xs font-medium text-red-500 hover:underline"
              >
                Remove image
              </button>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#2DBE6C] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#1F8F50] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            <Save size={18} />
            {loading ? "Saving..." : "Save Category"}
          </button>

          <button
            type="button"
            onClick={() => router.push(`/${locale}/admin/categories`)}
            className="rounded-full border border-[#E5E7EB] px-6 py-3 text-sm font-medium text-[#687280] transition hover:bg-[#F9FAFB]"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}