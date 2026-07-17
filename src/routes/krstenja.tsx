import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/site/CategoryPage";

export const Route = createFileRoute("/krstenja")({
  head: () => ({
    meta: [
      { title: "Dekoracije za krštenja — LumaVita" },
      { name: "description", content: "Nežne dekoracije za najsvetiji porodični dan." },
      { property: "og:title", content: "Dekoracije za krštenja — LumaVita" },
    ],
  }),
  component: () => <CategoryPage slug="krstenja" />,
});