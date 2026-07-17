import { useCategories, useDecorations } from "@/lib/site-queries";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { LeafDecor } from "./LeafDecor";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export function CategoryPage({ slug }: { slug: string }) {
  const { data: categories } = useCategories();
  const { data: decorations, isLoading } = useDecorations(slug);
  const category = categories?.find((c) => c.slug === slug);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />

      {/* Hero */}
      <section className="relative min-h-[55vh] flex items-center justify-center overflow-hidden">
        {category?.hero_image && (
          <img
            src={category.hero_image}
            alt={category.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/50 via-foreground/30 to-background/85" />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center text-white pt-16 pb-20">
          {category?.kicker && (
            <p className="kicker text-white/90 mb-5">{category.kicker}</p>
          )}
          <h1 className="font-display text-5xl md:text-7xl leading-[0.95] font-medium">
            {category?.name ?? "..."}
          </h1>
          {category?.description && (
            <p className="mt-6 text-white/90 text-lg max-w-2xl mx-auto">
              {category.description}
            </p>
          )}
        </div>
      </section>

      {/* Decorations grid */}
      <section className="relative py-20 md:py-28">
        <LeafDecor className="absolute top-10 -left-10 w-56 h-56 text-accent/15" />
        <div className="mx-auto max-w-7xl px-6 relative">
          {isLoading ? (
            <div className="text-center text-muted-foreground py-20">Učitavam...</div>
          ) : decorations && decorations.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {decorations.map((d, i) => (
                <article key={d.id} className="group">
                  <div className="arch aspect-[4/5] mb-5 bg-muted relative">
                    {d.image_url && (
                      <img
                        src={d.image_url}
                        alt={d.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                      />
                    )}
                    <div className="absolute top-5 left-5 bg-background/95 backdrop-blur-sm rounded-full w-14 h-14 flex items-center justify-center font-display text-2xl shadow-lg">
                      {d.number}
                    </div>
                  </div>
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="font-display text-2xl text-primary/80">
                      {String(d.number).padStart(2, "0")}
                    </span>
                    <h3 className="font-display text-2xl">{d.title}</h3>
                  </div>
                  {d.description && (
                    <p className="text-muted-foreground text-sm">{d.description}</p>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-20">
              Uskoro dodajemo dekoracije u ovu kategoriju.
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-secondary/40 py-16 text-center">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="font-display text-3xl md:text-4xl mb-4">
            Sviđa vam se ovo?
          </h2>
          <p className="text-muted-foreground mb-6">
            Pošaljite upit i napravićemo dekoraciju baš po vašoj priči.
          </p>
          <Link to="/kontakt" className="pill">
            Kontaktirajte nas <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}