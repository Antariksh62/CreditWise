import { Suspense } from "react";
import cards from "../../data/cards.json";
import CardCatalog from "../../components/CardCatalog";

export const metadata = {
  title: "All credit cards — CreditWise",
  description:
    "Explore verified credit cards across cashback, travel, rewards, dining, fuel, and lifetime-free options.",
};

export default async function CardsPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const initialCategory = resolvedSearchParams?.category || "all";

  return (
    <div className="cw-rail min-h-screen bg-[#FBFBFB]">
      <div className="cw-container py-12 md:py-16 max-w-6xl mx-auto px-4 sm:px-6">
        <Suspense
          fallback={
            <div className="space-y-8 animate-pulse">
              <div className="h-10 w-64 bg-neutral-200 rounded" />
              <div className="h-9 w-96 bg-neutral-200 rounded-full" />
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-80 bg-neutral-200 rounded-xl" />
                ))}
              </div>
            </div>
          }
        >
          <CardCatalog initialCards={cards} initialCategory={initialCategory} />
        </Suspense>
      </div>
    </div>
  );
}
