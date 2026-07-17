import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/site/CategoryPage";

export const Route = createFileRoute("/vencanja")({
  head: () => ({
    meta: [
      { title: "Dekoracije za venčanja — LumaVita" },
      { name: "description", content: "Elegantne dekoracije za venčanja — od intimnih ceremonija do velikih svečanosti." },
      { property: "og:title", content: "Dekoracije za venčanja — LumaVita" },
    ],
  }),
  component: () => <CategoryPage slug="vencanja" />,
});