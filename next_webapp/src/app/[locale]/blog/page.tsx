"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 9;

interface Blog {
  id: number;
  title: string;
  description: string | null;
  cover_img: string | null;
  published_date: string | null;
}

export default function BlogListingPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchBlogs = useCallback(async (currentPage: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(currentPage),
        pageSize: String(PAGE_SIZE),
      });
      const res = await fetch(`/api/home/blogs?${params}`);
      const json = await res.json();
      if (json.success) {
        setBlogs(json.data ?? []);
        setTotal(json.pagination?.total ?? 0);
        setTotalPages(json.pagination?.totalPages ?? 1);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs(page);
  }, [page, fetchBlogs]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-white dark:bg-[#1C1C1C]">
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          {/* Heading */}
          <div className="mb-12 text-center">
            <h1 className="mb-3 text-4xl font-bold text-gray-900 dark:text-white md:text-5xl">
              Blog
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 md:text-base">
              Insights, updates, and expert tips
            </p>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
            </div>
          ) : blogs.length === 0 ? (
            <div className="py-20 text-center text-gray-500 dark:text-gray-400">
              No blog posts yet. Check back soon.
            </div>
          ) : (
            <>
              {/* Card grid */}
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {blogs.map((blog) => (
                  <BlogCard
                    key={blog.id}
                    id={String(blog.id)}
                    title={blog.title ?? ""}
                    description={blog.description ?? ""}
                    image={blog.cover_img ?? ""}
                    category={blog.published_date ?? ""}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-4">
                  <button
                    onClick={() => setPage((p) => p - 1)}
                    disabled={page === 1}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Page {page} of {totalPages} &nbsp;·&nbsp; {total} posts
                  </span>

                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page === totalPages}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
