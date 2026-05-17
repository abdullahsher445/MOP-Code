"use client";

import { useRef, useState } from "react";
import { Save, ImagePlus, FileText } from "lucide-react";

type UseCaseFormData = {
  serialNumber: string;
  title: string;
  category: string;
  description: string;
  image: string | File;
  document: File | null;
};

type UseCaseFormProps = {
  initialData?: UseCaseFormData;
  onSubmit: (data: UseCaseFormData) => void;
};

type FormErrors = {
  document?: string;
};

export default function UseCaseForm({
  initialData,
  onSubmit,
}: UseCaseFormProps) {
  const [form, setForm] = useState<UseCaseFormData>(
    initialData || {
      serialNumber: "",
      title: "",
      category: "",
      description: "",
      image: "",
      document: null,
    }
  );

  const [preview, setPreview] = useState(
    typeof form.image === "string" ? form.image : ""
  );

  const [errors, setErrors] = useState<FormErrors>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);

    setForm((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const handleDocument = (file: File) => {
    const allowedTypes = ["text/html", "application/pdf"];

    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        document: "Only HTML and PDF files are allowed",
      }));
      return;
    }

    setErrors((prev) => ({
      ...prev,
      document: undefined,
    }));

    setForm((prev) => ({
      ...prev,
      document: file,
    }));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-5 sm:space-y-6">
      {/* Serial Number */}
      <div>
        <label className="mb-2 block text-sm font-medium text-[#1A1A1A]">
          Serial Number
        </label>

        <input
          type="text"
          value={form.serialNumber}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, serialNumber: e.target.value }))
          }
          placeholder="Enter serial number"
          className="w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 text-sm outline-none transition-colors focus:border-[#2DBE6C] focus:bg-white focus:ring-2 focus:ring-[#2DBE6C]/20"
        />
      </div>

      {/* Title */}
      <div>
        <label className="mb-2 block text-sm font-medium text-[#1A1A1A]">
          Title
        </label>

        <input
          type="text"
          value={form.title}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, title: e.target.value }))
          }
          placeholder="Enter title"
          className="w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 text-sm outline-none transition-colors focus:border-[#2DBE6C] focus:bg-white focus:ring-2 focus:ring-[#2DBE6C]/20"
        />
      </div>

      {/* Category */}
      <div>
        <label className="mb-2 block text-sm font-medium text-[#1A1A1A]">
          Category
        </label>

        <select
          value={form.category}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, category: e.target.value }))
          }
          className="w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 text-sm outline-none transition-colors focus:border-[#2DBE6C] focus:bg-white focus:ring-2 focus:ring-[#2DBE6C]/20"
        >
          <option value="">Select category</option>
          <option value="Category 1">Category 1</option>
          <option value="Category 2">Category 2</option>
          <option value="Category 3">Category 3</option>
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="mb-2 block text-sm font-medium text-[#1A1A1A]">
          Description
        </label>

        <textarea
          rows={4}
          value={form.description}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, description: e.target.value }))
          }
          placeholder="Enter description"
          className="w-full resize-none rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 text-sm outline-none transition-colors focus:border-[#2DBE6C] focus:bg-white focus:ring-2 focus:ring-[#2DBE6C]/20"
        />
      </div>

      {/* Cover Image Upload */}
      <div>
        <label className="mb-3 block text-sm font-medium text-[#1A1A1A]">
          Cover Image
        </label>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer rounded-2xl border-2 border-dashed border-[#CFEFD9] bg-[#F8FFFA] px-4 py-8 text-center transition-colors hover:bg-[#F0FFF6] sm:p-8"
        >
          {!preview ? (
            <>
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAFBF0] text-[#1F8F50] sm:h-12 sm:w-12">
                <ImagePlus size={22} />
              </div>

              <p className="mt-3 text-sm font-semibold text-[#1A1A1A]">
                Upload image
              </p>

              <p className="mt-1 text-sm leading-5 text-[#687280]">
                Drag and drop or click to browse.
              </p>
            </>
          ) : (
            <img
              src={preview}
              alt="Preview"
              className="mx-auto max-h-48 max-w-full rounded-lg object-contain"
            />
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              handleFile(e.target.files[0]);
            }
          }}
        />
      </div>

      {/* Document Upload */}
      <div>
        <label className="mb-3 block text-sm font-medium text-[#1A1A1A]">
          Upload HTML / PDF
        </label>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();

            if (e.dataTransfer.files?.[0]) {
              handleDocument(e.dataTransfer.files[0]);
            }
          }}
          onClick={() => documentInputRef.current?.click()}
          className="cursor-pointer rounded-2xl border-2 border-dashed border-[#CFEFD9] bg-[#F8FFFA] px-4 py-8 text-center transition-colors hover:bg-[#F0FFF6] sm:p-8"
        >
          {!form.document ? (
            <>
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAFBF0] text-[#1F8F50] sm:h-12 sm:w-12">
                <FileText size={22} />
              </div>

              <p className="mt-3 text-sm font-semibold text-[#1A1A1A]">
                Upload HTML or PDF
              </p>

              <p className="mt-1 text-sm leading-5 text-[#687280]">
                Drag and drop or click to browse.
              </p>
            </>
          ) : (
            <p className="break-words text-sm font-medium text-[#1F8F50]">
              {form.document.name}
            </p>
          )}
        </div>

        {errors.document && (
          <p className="mt-1 text-sm text-red-500">{errors.document}</p>
        )}

        <input
          type="file"
          ref={documentInputRef}
          className="hidden"
          accept=".html,.pdf"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              handleDocument(e.target.files[0]);
            }
          }}
        />
      </div>

      {/* Submit */}
      <div className="pt-2">
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#2DBE6C] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#1F8F50] sm:w-auto"
        >
          <Save size={18} />
          Save Use Case
        </button>
      </div>
    </form>
  );
}