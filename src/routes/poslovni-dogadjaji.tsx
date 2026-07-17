import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/site/CategoryPage";

export const Route = createFileRoute("/poslovni-dogadjaji")({
  head: () => ({
    meta: [
      { title: "Poslovni događaji — LumaVita" },
      { name: "description", content: "Dekoracije za korporativne događaje, konferencije i gala večere." },
      { property: "og:title", content: "Poslovni događaji — LumaVita" },
    ],
  }),
  component: () => <CategoryPage slug="poslovni-dogadjaji" />,
});