
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const CategoryUseCasesPage = () => {
  const params = useParams();

  const locale = params?.locale as string;
  const categoryId = params?.id as string;

  const [category, setCategory] = useState<any>(null);
  const [useCases, setUseCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!categoryId) return;

    const fetchCategoryUseCases = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch categories from the same working API used on homepage
        const categoryRes = await fetch("/api/home/categories");

        if (!categoryRes.ok) {
          throw new Error("Failed to fetch categories");
        }

        const categoryJson = await categoryRes.json();

        const allCategories = categoryJson.success
          ? categoryJson.data || []
          : Array.isArray(categoryJson)
          ? categoryJson
          : [];

        const selectedCategory = allCategories.find(
          (cat: any) => String(cat.id) === String(categoryId)
        );

        setCategory(selectedCategory || null);

        // Fetch use cases by selected category
        const useCasesRes = await fetch(
          `/api/usecases?category_id=${categoryId}`
        );

        if (!useCasesRes.ok) {
          throw new Error("Failed to fetch category use cases");
        }

        const useCasesJson = await useCasesRes.json();

        const categoryUseCases = useCasesJson.success
          ? useCasesJson.data || []
          : Array.isArray(useCasesJson)
          ? useCasesJson
          : useCasesJson.data || [];

        setUseCases(categoryUseCases);
      } catch (err) {
        console.error("Category page error:", err);
        setError("Unable to load use cases for this category.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryUseCases();
  }, [categoryId]);

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#F6F9FC] dark:bg-[#263238] text-black dark:text-white">
        {/* Hero Banner */}
        <section className="relative overflow-hidden bg-gradient-to-r from-green-700 via-green-600 to-green-500 px-6 py-20 text-center text-white md:py-24">
          <div className="mx-auto max-w-4xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-green-100">
              Melbourne Open Data
            </p>

            <h1 className="text-4xl font-extrabold leading-tight drop-shadow-md md:text-6xl">
              {category?.category_name || category?.name || "Use Cases"}
            </h1>

            {category?.description ? (
              <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-green-50 md:text-lg">
                {category.description}
              </p>
            ) : (
              <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-green-50 md:text-lg">
                Explore use cases connected to this category and discover how
                open data supports smarter city planning and decision-making.
              </p>
            )}

          {!loading && !error && (
  <div className="mt-7 flex justify-center">
    <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-green-700 shadow-md">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">
        {useCases.length}
      </span>
      <span>
        {useCases.length === 1 ? "Use Case Found" : "Use Cases Found"}
      </span>
    </div>
  </div>
)}
          </div>

          {/* Bottom curve/wave effect */}
          <div className="absolute bottom-0 left-0 h-10 w-full bg-[#F6F9FC] dark:bg-[#263238] [clip-path:polygon(0_70%,100%_25%,100%_100%,0_100%)]" />
        </section>

        {/* Content */}
        <section className="px-6 py-12">
          <div className="mx-auto max-w-7xl">
            <Link
              href={`/${locale}`}
              className="mb-8 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-100 hover:text-black dark:bg-[#37474F] dark:text-gray-200 dark:hover:bg-[#455A64]"
            >
              <ArrowLeft size={18} />
              Back to Home
            </Link>

            {loading && (
              <div className="flex min-h-[300px] items-center justify-center rounded-3xl bg-white shadow-sm dark:bg-[#37474F]">
                <div className="text-center">
                  <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
                  <p className="text-gray-600 dark:text-gray-300">
                    Loading use cases...
                  </p>
                </div>
              </div>
            )}

            {!loading && error && (
              <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-red-700 shadow-sm">
                {error}
              </div>
            )}

            {!loading && !error && useCases.length === 0 && (
              <div className="rounded-3xl bg-white p-12 text-center shadow-sm dark:bg-[#37474F]">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  No use cases found
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  There are currently no use cases available in this category.
                </p>
              </div>
            )}

            {!loading && !error && useCases.length > 0 && (
              <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {useCases.map((item) => (
                  <Link
                    key={item.id}
                    href={`/${locale}/usecases/${item.id}`}
                    className="group flex h-full min-h-[390px] flex-col overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:bg-[#37474F]"
                  >
                    <div className="h-52 w-full overflow-hidden bg-gray-200 dark:bg-[#455A64]">
                      <img
                        src={
                          item.cover_img ||
                          item.cover_image ||
                          item.image ||
                          "/img/insights/eco.webp"
                        }
                        alt={item.title || item.name || "Use case"}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <h2 className="mb-3 line-clamp-2 text-xl font-bold text-gray-900 dark:text-white">
                        {item.title || item.name}
                      </h2>

                      <p className="line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
                        {item.description || item.short_description || ""}
                      </p>

                      <div className="mt-auto pt-5 text-sm font-semibold text-black transition group-hover:text-green-600 dark:text-white dark:group-hover:text-green-400">
                        View Use Case →
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default CategoryUseCasesPage;