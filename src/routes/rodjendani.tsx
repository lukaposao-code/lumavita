import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/site/CategoryPage";

export const Route = createFileRoute("/rodjendani")({
  head: () => ({
    meta: [
      { title: "Rođendanske dekoracije — LumaVita" },
      { name: "description", content: "Rođendanske dekoracije za sve uzraste — dečije teme i rafinirana slavlja." },
      { property: "og:title", content: "Rođendanske dekoracije — LumaVita" },
    ],
  }),
  component: () => <CategoryPage slug="rodjendani" />,
});