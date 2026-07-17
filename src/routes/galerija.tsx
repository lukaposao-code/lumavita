import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { useGallery } from "@/lib/site-queries";

export const Route = createFileRoute("/galerija")({
  head: () => ({
    meta: [
      { title: "Galerija — LumaVita" },
      { name: "description", content: "Pogledajte naše dekoracije iz realizovanih događaja." },
      { property: "og:title", content: "Galerija — LumaVita" },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const { data, isLoading } = useGallery();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <section className="pt-16 pb-8">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="kicker mb-4">Portfolio</p>
          <h1 className="font-display text-5xl md:text-6xl">Naša galerija</h1>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Pregršt trenutaka iz dekoracija koje smo radili.
          </p>
        </div>
      </section>
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6">
          {isLoading ? (
            <div className="text-center text-muted-foreground py-20">Učitavam...</div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {data?.map((g) => (
                <div key={g.id} className="break-inside-avoid overflow-hidden rounded-2xl bg-muted">
                  <img
                    src={g.image_url}
                    alt={g.caption ?? "Galerija"}
                    loading="lazy"
                    className="w-full h-auto hover:scale-105 transition-transform duration-700"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}