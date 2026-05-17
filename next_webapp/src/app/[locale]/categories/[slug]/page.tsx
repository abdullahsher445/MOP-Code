"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import SearchResults from "../../../../components/SearchResults";

interface SearchResult {
  id: number;
  title: string;
  description?: string;
  content?: string;
  category_name?: string;
  category_slug?: string;
  category_color?: string;
  category_icon?: string;
  created_at: string;
  updated_at?: string;
  view_count?: number;
}

interface Category {
  name: string;
  color: string;
  description?: string;
}

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug as string | undefined;

  const [category, setCategory] = useState<Category | null>(null);
  const [posts, setPosts] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchCategoryPosts = async () => {
      try {
        setLoading(true);

        const response = await fetch(`/api/search?category=${slug}`);
        const data = await response.json();

        if (data.success) {
          const results: SearchResult[] = data.data.results || [];
          setPosts(results);

          if (results.length > 0) {
            setCategory({
              name: results[0].category_name || "Unknown Category",
              color: results[0].category_color || "#6B7280",
              description: results[0].description,
            });
          }
        } else {
          setPosts([]);
          setCategory(null);
        }
      } catch (error) {
        console.error("Error fetching category posts:", error);
        setPosts([]);
        setCategory(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryPosts();
  }, [slug]);

  return (
    <main className="min-h-screen bg-white px-4 py-8 dark:bg-[#1C1C1C] sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        {category && (
          <section className="mb-8 rounded-2xl bg-[#F8FFFA] p-4 shadow-sm dark:bg-[#252525] sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <span
                className="inline-block h-6 w-6 shrink-0 rounded-full"
                style={{ backgroundColor: category.color }}
              />

              <div className="min-w-0">
                <h1 className="break-words text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl lg:text-4xl">
                  {category.name}
                </h1>

                {category.description && (
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600 dark:text-gray-400 sm:text-base">
                    {category.description}
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {!loading && !category && posts.length === 0 && (
          <div className="mb-8 rounded-2xl border border-dashed border-gray-300 px-4 py-12 text-center dark:border-gray-700">
            <p className="text-base font-medium text-gray-700 dark:text-gray-200">
              No results found for this category.
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Try selecting another category or checking back later.
            </p>
          </div>
        )}

        <SearchResults results={posts} loading={loading} />
      </div>
    </main>
  );
}