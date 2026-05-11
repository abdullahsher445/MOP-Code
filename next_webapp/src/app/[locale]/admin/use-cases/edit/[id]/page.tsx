"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import UseCaseForm from "../../components/UseCaseForm";

export default function EditUseCase({ params }: { params: { id: string } }) {
  const router = useRouter();
  const locale = useLocale();

  // Temporary existing data until backend integration is ready
  const existingData = {
    serialNumber: "Existing Serial Number",
    title: "Existing Title",
    category: "Category 1",
    description: "Existing description",
    image: "/images/category-placeholder.png",
    document: null,
  };

  const handleSubmit = (data: any) => {
    console.log("UPDATED:", data);
    console.log("Use case ID:", params.id);

    router.push(`/${locale}/admin/use-cases`);
  };

  return (
    <div className="w-full max-w-4xl">
      <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold leading-tight text-[#2DBE6C] sm:text-3xl lg:text-[40px] lg:leading-[48px]">
            Edit Use Case
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#687280] sm:text-base">
            Update the selected use case details and save the changes.
          </p>
        </div>

        <UseCaseForm initialData={existingData} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}