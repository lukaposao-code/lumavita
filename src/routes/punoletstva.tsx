import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/site/CategoryPage";

export const Route = createFileRoute("/punoletstva")({
  head: () => ({
    meta: [
      { title: "Dekoracije za punoletstva — LumaVita" },
      { name: "description", content: "Elegantne dekoracije za 18. rođendan." },
      { property: "og:title", content: "Dekoracije za punoletstva — LumaVita" },
    ],
  }),
  component: () => <CategoryPage slug="punoletstva" />,
});