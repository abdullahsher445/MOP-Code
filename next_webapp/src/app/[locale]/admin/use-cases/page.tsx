"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Filter } from "lucide-react";
import UseCaseTable from "./components/UseCaseTable";

type UseCaseItem = {
  id: number;
  title: string;
  description: string;
  category: string;
  image: string;
};

const initialUseCases: UseCaseItem[] = [
  {
    id: 1,
    title: "Business and Economy",
    description:
      "Analyze market trends and financial data to optimize business strategies.",
    category: "Category 1",
    image: "/images/category-placeholder.png",
  },
  {
    id: 2,
    title: "Community and Social Impact",
    description:
      "Develop initiatives to enhance social welfare and community outcomes.",
    category: "Category 2",
    image: "/images/category-placeholder.png",
  },
  {
    id: 3,
    title: "Education and Teaching",
    description:
      "Leverage AI tools to improve learning and personalize education.",
    category: "Category 1",
    image: "/images/category-placeholder.png",
  },
  {
    id: 4,
    title: "Environmental Sustainability",
    description:
      "Implement eco-friendly strategies to protect natural resources.",
    category: "Category 3",
    image: "/images/category-placeholder.png",
  },
];

export default function UseCasesPage({
  params,
}: {
  params: { locale: string };
}) {
  const [data, setData] = useState<UseCaseItem[]>(initialUseCases);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = Array.from(new Set(data.map((item) => item.category)));

  const handleDelete = (id: number | string) => {
    if (confirm("Are you sure you want to delete this use case?")) {
      setData((prev) => prev.filter((item) => item.id !== Number(id)));
    }
  };

  const filteredData = data.filter((item) => {
    const searchValue = search.toLowerCase();

    const matchesSearch =
      item.title.toLowerCase().includes(searchValue) ||
      item.description.toLowerCase().includes(searchValue);

    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full max-w-full overflow-hidden">
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold leading-tight text-[#2DBE6C] sm:text-4xl lg:text-[40px] lg:leading-[48px]">
            Use Cases
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#687280] sm:text-base">
            Manage and organize your use cases.
          </p>
        </div>

        <Link
          href={`/${params.locale}/admin/use-cases/add`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#1F8F50] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#2DBE6C] sm:w-auto"
        >
          <Plus size={18} />
          Add New
        </Link>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-[1fr_240px]">
        <div className="flex min-w-0 items-center gap-2 rounded-xl border border-[#CFEFD9] bg-[#F8FFFA] px-4 py-3">
          <Search size={18} className="shrink-0 text-[#1F8F50]" />

          <input
            type="text"
            placeholder="Search use cases..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full min-w-0 bg-transparent text-sm outline-none"
          />
        </div>

        <div className="flex min-w-0 items-center gap-2 rounded-xl border border-[#CFEFD9] bg-[#F8FFFA] px-4 py-3">
          <Filter size={18} className="shrink-0 text-[#1F8F50]" />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full min-w-0 bg-transparent text-sm outline-none"
          >
            <option value="All">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredData.length > 0 ? (
        <UseCaseTable data={filteredData} onDelete={handleDelete} />
      ) : (
        <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
          <p className="text-base font-medium text-gray-500">
            No data available at the moment
          </p>
        </div>
      )}
    </div>
  );
}