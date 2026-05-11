"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";

interface Category {
  id: number;
  name: string;
  slug: string;
  color: string;
  icon?: string;
  description?: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const locale = useLocale();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/categories");
      const data = await response.json();

      if (data.success) {
        setCategories(data.data || []);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white px-4 py-10 dark:bg-[#1C1C1C] sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Loading categories...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-4 py-10 dark:bg-[#1C1C1C] sm:px-6 sm:py-14 lg:px-8 lg:py-16">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8 text-center sm:mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
            All Categories
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-500 dark:text-gray-400 sm:text-base">
            Browse available categories and explore related content.
          </p>
        </div>

        {categories.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/${locale}/categories/${category.slug}`}
                className="block h-full"
              >
                <article className="h-full rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 sm:p-6">
                  <div className="mb-3 flex items-start gap-3">
                    <span
                      className="mt-1 inline-block h-4 w-4 shrink-0 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />

                    <h2 className="break-words text-lg font-semibold text-gray-900 dark:text-white sm:text-xl">
                      {category.name}
                    </h2>
                  </div>

                  {category.description ? (
                    <p className="text-sm leading-6 text-gray-600 dark:text-gray-400">
                      {category.description}
                    </p>
                  ) : (
                    <p className="text-sm leading-6 text-gray-400 dark:text-gray-500">
                      No description available.
                    </p>
                  )}
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 px-4 py-16 text-center dark:border-gray-700">
            <p className="text-base font-medium text-gray-700 dark:text-gray-200">
              No categories found.
            </p>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Categories will appear here once they are added.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}