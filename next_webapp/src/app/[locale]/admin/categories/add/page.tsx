"use client";

import { FolderPlus, ImagePlus, Save } from "lucide-react";

export default function AddCategoryForm() {
  return (
    <div className="w-full max-w-full rounded-3xl border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-6 lg:p-8">
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

      <form className="space-y-5 sm:space-y-6">
        {/* Title */}
        <div>
          <label className="mb-2 block text-sm font-medium text-[#1A1A1A]">
            Title
          </label>

          <input
            type="text"
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
            placeholder="Enter category description"
            className="w-full resize-none rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 text-sm outline-none transition focus:border-[#2DBE6C] focus:bg-white focus:ring-2 focus:ring-[#2DBE6C]/20"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="mb-3 block text-sm font-medium text-[#1A1A1A]">
            Category Image
          </label>

          <div className="rounded-2xl border-2 border-dashed border-[#CFEFD9] bg-[#F8FFFA] px-4 py-8 text-center sm:p-8">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAFBF0] text-[#1F8F50] sm:h-12 sm:w-12">
              <ImagePlus size={22} />
            </div>

            <h3 className="mt-3 text-sm font-semibold text-[#1A1A1A]">
              Upload category image
            </h3>

            <p className="mx-auto mt-1 max-w-sm text-sm leading-5 text-[#687280]">
              Drag and drop your image here or click to browse.
            </p>

            <button
              type="button"
              className="mt-4 rounded-full border border-[#2DBE6C] px-4 py-2 text-sm font-medium text-[#1F8F50] transition hover:bg-[#EAFBF0]"
            >
              Choose File
            </button>
          </div>
        </div>

        {/* Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#2DBE6C] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#1F8F50] sm:w-auto"
          >
            <Save size={18} />
            Save Category
          </button>
        </div>
      </form>
    </div>
  );
}