"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import UseCaseForm from "../components/UseCaseForm";

export default function AddUseCase() {
  const router = useRouter();
  const locale = useLocale();

  const handleSubmit = (data: any) => {
    console.log("NEW:", data);

    router.push(`/${locale}/admin/use-cases`);
  };

  return (
    <div className="w-full max-w-4xl">
      <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold leading-tight text-[#2DBE6C] sm:text-3xl lg:text-[40px] lg:leading-[48px]">
            Add Use Case
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#687280] sm:text-base">
            Create a new use case by filling in the required details below.
          </p>
        </div>

        <UseCaseForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}