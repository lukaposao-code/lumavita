import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/site/CategoryPage";

export const Route = createFileRoute("/gender-reveal")({
  head: () => ({
    meta: [
      { title: "Gender Reveal dekoracije — LumaVita" },
      { name: "description", content: "Magične dekoracije za otkrivanje pola bebe." },
      { property: "og:title", content: "Gender Reveal dekoracije — LumaVita" },
    ],
  }),
  component: () => <CategoryPage slug="gender-reveal" />,
});