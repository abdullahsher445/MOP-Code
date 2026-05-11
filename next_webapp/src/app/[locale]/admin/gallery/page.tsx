"use client";

import { useState } from "react";
import { Plus, X, Upload } from "lucide-react";

type GalleryImage = {
  id: number;
  title: string;
  url: string;
  uploadedAt: string;
};

const initialImages: GalleryImage[] = [
  {
    id: 1,
    title: "Flinders Street Station, Melbourne, Australia",
    url: "/img/melbourne-city.jpg",
    uploadedAt: "02/04/2026",
  },
  {
    id: 2,
    title: "Melbourne Skyline",
    url: "/img/melbourne-city1.jpg",
    uploadedAt: "01/04/2026",
  },
  {
    id: 3,
    title: "Royal Botanic Gardens",
    url: "/img/royalBotanic.jpg",
    uploadedAt: "31/03/2026",
  },
  {
    id: 4,
    title: "Southern Cross Station",
    url: "/img/southernCross.jpg",
    uploadedAt: "30/03/2026",
  },
  {
    id: 5,
    title: "Docklands, Melbourne",
    url: "/img/docklands.jpg",
    uploadedAt: "29/03/2026",
  },
  {
    id: 6,
    title: "City View",
    url: "/img/cityimg.png",
    uploadedAt: "28/03/2026",
  },
  {
    id: 7,
    title: "Melbourne Arts Centre",
    url: "/img/melbourne-city.jpg",
    uploadedAt: "27/03/2026",
  },
  {
    id: 8,
    title: "Federation Square",
    url: "/img/melbourne-city1.jpg",
    uploadedAt: "26/03/2026",
  },
];

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>(initialImages);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);

  const handleDelete = () => {
    if (!selectedImage) return;

    setImages((prev) => prev.filter((img) => img.id !== selectedImage.id));
    setShowDeleteConfirm(false);
    setSelectedImage(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setUploadFile(file);
    setUploadPreview(URL.createObjectURL(file));
  };

  const handleUpload = () => {
    if (!uploadTitle.trim() || !uploadPreview) return;

    const newImage: GalleryImage = {
      id: Date.now(),
      title: uploadTitle.trim(),
      url: uploadPreview,
      uploadedAt: new Date().toLocaleDateString("en-AU"),
    };

    setImages((prev) => [newImage, ...prev]);
    setUploadOpen(false);
    setUploadTitle("");
    setUploadFile(null);
    setUploadPreview(null);
  };

  const closeUpload = () => {
    setUploadOpen(false);
    setUploadTitle("");
    setUploadFile(null);
    setUploadPreview(null);
  };

  return (
    <div className="w-full max-w-full overflow-hidden">
      {/* Page header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-semibold leading-tight text-[#2DBE6C] sm:text-4xl lg:text-[40px] lg:leading-[48px]">
          Gallery
        </h1>

        <button
          type="button"
          onClick={() => setUploadOpen(true)}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#1F8F50] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#2DBE6C] sm:w-auto"
        >
          <Plus size={16} />
          Upload New Photo
        </button>
      </div>

      {/* Photo grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {images.map((image) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setSelectedImage(image)}
            className="group relative overflow-hidden rounded-2xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1F8F50]"
          >
            <img
              src={image.url}
              alt={image.title}
              className="h-52 w-full object-cover transition-transform duration-300 group-hover:scale-105 sm:h-56 lg:h-64"
            />

            <div className="absolute inset-x-0 bottom-0 bg-black/45 px-3 py-2 text-left opacity-0 transition group-hover:opacity-100">
              <p className="truncate text-sm font-medium text-white">
                {image.title}
              </p>
            </div>
          </button>
        ))}

        {images.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white px-4 py-20 text-center text-gray-400">
            <p className="text-base font-medium">No photos yet</p>
            <p className="mt-1 text-sm">
              Click &ldquo;Upload New Photo&rdquo; to get started
            </p>
          </div>
        )}
      </div>

      {/* Preview modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-4 shadow-2xl sm:p-6">
            <button
              type="button"
              onClick={() => {
                setSelectedImage(null);
                setShowDeleteConfirm(false);
              }}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#1F8F50] text-white transition hover:bg-[#2DBE6C]"
            >
              <X size={18} strokeWidth={3} />
            </button>

            <img
              src={selectedImage.url}
              alt={selectedImage.title}
              className="h-64 w-full rounded-xl object-cover sm:h-80 md:h-96"
            />

            <p className="mt-4 break-words text-base font-semibold text-gray-900">
              {selectedImage.title}
            </p>

            <p className="mt-1 text-sm font-semibold text-gray-500 sm:text-[15px]">
              Uploaded on {selectedImage.uploadedAt}
            </p>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full rounded-lg bg-red-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-600 sm:w-auto"
              >
                Delete
              </button>
            </div>

            {showDeleteConfirm && (
              <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 px-4">
                <div className="relative w-full max-w-xs rounded-2xl bg-white px-6 py-5 shadow-xl">
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="absolute right-3 top-3 text-gray-400 transition hover:text-gray-700"
                  >
                    <X size={16} />
                  </button>

                  <p className="text-center text-sm font-semibold leading-snug text-gray-900 sm:text-[15px]">
                    Are you sure you want to delete this photo?
                  </p>

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={handleDelete}
                      className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
                    >
                      Yes, Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upload modal */}
      {uploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
          <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-4 shadow-2xl sm:p-6">
            <button
              type="button"
              onClick={closeUpload}
              className="absolute right-4 top-4 text-gray-400 transition hover:text-gray-700"
            >
              <X size={20} />
            </button>

            <h2 className="mb-5 pr-8 text-xl font-semibold text-gray-900">
              Upload New Photo
            </h2>

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#1F8F50]/40 bg-[#E8F5EE] px-4 py-8 text-center transition hover:border-[#1F8F50] hover:bg-[#D6EFE2] sm:py-10">
              {uploadPreview ? (
                <img
                  src={uploadPreview}
                  alt="Preview"
                  className="max-h-40 max-w-full rounded-lg object-contain"
                />
              ) : (
                <>
                  <Upload size={36} className="mb-3 text-[#1F8F50]" />
                  <p className="text-base font-bold text-[#1F8F50] sm:text-[17px]">
                    Click to select a photo
                  </p>
                  <p className="mt-1 text-sm font-bold text-[#1F8F50]/70">
                    PNG, JPG, WEBP — max 10MB
                  </p>
                </>
              )}

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            <input
              type="text"
              placeholder="Photo title"
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
              className="mt-4 w-full rounded-xl border-2 border-gray-300 bg-gray-100 px-4 py-3 text-base font-bold text-gray-800 outline-none transition placeholder:font-bold placeholder:text-gray-400 focus:border-[#1F8F50] focus:bg-white focus:ring-2 focus:ring-[#1F8F50]/20 sm:text-[17px]"
            />

            <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeUpload}
                className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleUpload}
                disabled={!uploadTitle.trim() || !uploadPreview}
                className="rounded-lg bg-[#1F8F50] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#2DBE6C] disabled:opacity-40"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}