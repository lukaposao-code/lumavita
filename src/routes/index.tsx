import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Quote } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { LeafDecor } from "@/components/site/LeafDecor";
import {
  useCategories,
  useGallery,
  useSettings,
  useTestimonials,
} from "@/lib/site-queries";
import { CATEGORY_ROUTES } from "@/lib/site-types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LumaVita — Dekoracije za sve prilike" },
      {
        name: "description",
        content:
          "Profesionalne dekoracije za venčanja, rođendane, krštenja, gender reveal, punoletstva i poslovne događaje.",
      },
      { property: "og:title", content: "LumaVita — Dekoracije za sve prilike" },
    ],
  }),
  component: Index,
});

function Index() {
  const { data: settings } = useSettings();
  const { data: categories } = useCategories();
  const { data: gallery } = useGallery();
  const { data: testimonials } = useTestimonials();
  const s = settings ?? {};

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />

      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {categories?.[0]?.hero_image && (
          <img
            src={categories[0].hero_image}
            alt="LumaVita"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/45 via-foreground/25 to-background/80" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center text-white">
          {s.hero_kicker && <p className="kicker text-white/90 mb-6">{s.hero_kicker}</p>}
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95] font-medium">
            {s.hero_title ?? "Vaš događaj u bajku"}
          </h1>
          {s.hero_subtitle && (
            <p className="mt-8 max-w-2xl mx-auto text-white/90 text-lg">{s.hero_subtitle}</p>
          )}
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <Link to="/kontakt" className="pill">
              Pošaljite upit <ArrowRight size={16} />
            </Link>
            <Link
              to="/galerija"
              className="pill-outline border-white/70 text-white hover:bg-white/10"
            >
              Naša galerija
            </Link>
          </div>
        </div>
      </section>

      <section className="relative py-24 md:py-32">
        <LeafDecor className="absolute top-10 -left-10 w-64 h-64 text-accent/20" />
        <div className="mx-auto max-w-7xl px-6 relative">
          <div className="text-center max-w-2xl mx-auto mb-16">
            {s.about_kicker && <p className="kicker mb-4">{s.about_kicker}</p>}
            <h2 className="font-display text-5xl md:text-6xl mb-6">
              {s.about_title ?? "Usluge"}
            </h2>
            {s.about_text && (
              <p className="text-muted-foreground text-lg">{s.about_text}</p>
            )}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories?.map((c) => (
              <Link
                key={c.slug}
                to={CATEGORY_ROUTES[c.slug] ?? "/"}
                className="group flex flex-col text-center"
              >
                <div className="arch aspect-[4/5] mb-6 bg-muted">
                  {c.hero_image && (
                    <img
                      src={c.hero_image}
                      alt={c.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  )}
                </div>
                <h3 className="font-display text-2xl mb-3">{c.name}</h3>
                {c.description && (
                  <p className="text-muted-foreground text-sm mb-5 px-4 line-clamp-2">
                    {c.description}
                  </p>
                )}
                <span className="pill-outline mx-auto text-sm group-hover:bg-primary group-hover:border-primary transition-colors">
                  Pogledaj više
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {gallery && gallery.length > 0 && (
        <section className="py-20 bg-secondary/30">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="kicker mb-4">Portfolio</p>
              <h2 className="font-display text-4xl md:text-5xl">Iz naše galerije</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {gallery.slice(0, 6).map((g) => (
                <div key={g.id} className="aspect-square overflow-hidden rounded-2xl bg-muted">
                  <img
                    src={g.image_url}
                    alt={g.caption ?? ""}
                    loading="lazy"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link to="/galerija" className="pill-outline">
                Cela galerija <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {testimonials && testimonials.length > 0 && (
        <section className="py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="kicker mb-4">Recenzije</p>
              <h2 className="font-display text-4xl md:text-5xl">Šta kažu naši klijenti</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div key={t.id} className="rounded-3xl bg-secondary/50 p-8 relative">
                  <Quote className="text-primary/50 absolute top-6 right-6" size={32} />
                  <p className="text-foreground/80 italic mb-6">"{t.content}"</p>
                  <div className="font-display text-lg">{t.author_name}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20 bg-primary/10">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-4xl md:text-5xl mb-4">
            Spremni za nezaboravan događaj?
          </h2>
          <p className="text-muted-foreground mb-8">
            Kontaktirajte nas i napravićemo dekoraciju po meri vaše priče.
          </p>
          <Link to="/kontakt" className="pill">
            Pošaljite upit <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
