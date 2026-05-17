"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";

type UseCaseItem = {
  id: number | string;
  title: string;
  image: string;
  category: string;
  description: string;
};

type UseCaseTableProps = {
  data: UseCaseItem[];
  onDelete: (id: number | string) => void;
};

export default function UseCaseTable({ data, onDelete }: UseCaseTableProps) {
  return (
    <div className="rounded-2xl bg-[#ECEAEA] p-3 shadow-sm sm:p-5">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[960px] border-collapse">
          <thead>
            <tr className="border-b border-black/30 text-left text-sm font-semibold text-black">
              <th className="whitespace-nowrap px-3 py-4">Serial Number</th>
              <th className="whitespace-nowrap px-3 py-4">Title</th>
              <th className="whitespace-nowrap px-3 py-4">Cover Image</th>
              <th className="whitespace-nowrap px-3 py-4">Category</th>
              <th className="whitespace-nowrap px-3 py-4">Description</th>
              <th className="whitespace-nowrap px-3 py-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b border-black/10 last:border-b-0"
                >
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-black">
                    {100123100 + index}
                  </td>

                  <td className="max-w-[180px] px-3 py-4 text-sm font-medium text-black">
                    <span className="block truncate">{item.title}</span>
                  </td>

                  <td className="px-3 py-4">
                    <img
                      src={item.image || "/images/category-placeholder.png"}
                      alt={item.title}
                      className="h-12 w-12 rounded-lg border bg-white object-cover"
                    />
                  </td>

                  <td className="whitespace-nowrap px-3 py-4 text-sm text-black">
                    {item.category}
                  </td>

                  <td className="max-w-[320px] px-3 py-4 text-sm leading-6 text-[#687280]">
                    <p className="line-clamp-2 break-words">
                      {item.description}
                    </p>
                  </td>

                  <td className="px-3 py-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`use-cases/edit/${item.id}`}
                        aria-label={`Edit ${item.title}`}
                        className="rounded-lg bg-white p-2 text-[#1F8F50] transition-colors hover:bg-[#DFF7E8]"
                      >
                        <Pencil size={16} />
                      </Link>

                      <button
                        type="button"
                        onClick={() => onDelete(item.id)}
                        aria-label={`Delete ${item.title}`}
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
                  colSpan={6}
                  className="px-3 py-10 text-center text-sm text-gray-500"
                >
                  No use cases found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}