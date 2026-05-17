"use client";

import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";

type CategoryItem = {
  id: number;
  title: string;
  description: string;
  image: string;
};

const categories: CategoryItem[] = [
  {
    id: 1,
    title: "Transport",
    description: "Transport related open data and services.",
    image: "/images/category-placeholder.png",
  },
  {
    id: 2,
    title: "Environment",
    description: "Environment related insights and reports.",
    image: "/images/category-placeholder.png",
  },
  {
    id: 3,
    title: "Health",
    description: "Health and wellbeing data resources.",
    image: "/images/category-placeholder.png",
  },
];

export default function CategoriesPage({
  params,
}: {
  params: { locale: string };
}) {
  return (
    <div className="w-full max-w-full overflow-hidden">
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold leading-tight text-[#2DBE6C] sm:text-4xl lg:text-[40px] lg:leading-[48px]">
            Categories
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#687280] sm:text-base">
            View all current categories here.
          </p>
        </div>

        <Link
          href={`/${params.locale}/admin/categories/add`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#1F8F50] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#2DBE6C] sm:w-auto"
        >
          <Plus size={18} />
          Add New
        </Link>
      </div>

      <div className="rounded-2xl bg-[#ECEAEA] p-3 shadow-sm sm:p-5">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse">
            <thead>
              <tr className="border-b border-black/30">
                <th className="whitespace-nowrap px-3 py-4 text-left text-sm font-semibold text-black">
                  Image
                </th>
                <th className="whitespace-nowrap px-3 py-4 text-left text-sm font-semibold text-black">
                  Title
                </th>
                <th className="whitespace-nowrap px-3 py-4 text-left text-sm font-semibold text-black">
                  Description
                </th>
                <th className="whitespace-nowrap px-3 py-4 text-left text-sm font-semibold text-black">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <tr
                    key={category.id}
                    className="border-b border-black/10 last:border-b-0"
                  >
                    <td className="px-3 py-4">
                      <img
                        src={category.image}
                        alt={category.title}
                        className="h-14 w-14 rounded-lg border border-gray-300 bg-white object-cover"
                      />
                    </td>

                    <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-black">
                      {category.title}
                    </td>

                    <td className="max-w-[360px] px-3 py-4 text-sm leading-6 text-[#687280]">
                      {category.description}
                    </td>

                    <td className="px-3 py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/${params.locale}/admin/categories/edit/${category.id}`}
                          aria-label={`Edit ${category.title}`}
                          className="rounded-lg bg-white p-2 text-[#1F8F50] transition-colors hover:bg-[#DFF7E8]"
                        >
                          <Pencil size={16} />
                        </Link>

                        <button
                          type="button"
                          aria-label={`Delete ${category.title}`}
                          className="rounded-lg bg-white p-2 text-red-500 transition-colors hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-3 py-10 text-center text-sm text-[#687280]"
                  >
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}