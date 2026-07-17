import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { ContactForm } from "@/components/site/ContactForm";
import { useSettings } from "@/lib/site-queries";
import { Instagram, Mail, MapPin, Phone } from "lucide-react";

export const Route = createFileRoute("/kontakt")({
  head: () => ({
    meta: [
      { title: "Kontakt — LumaVita" },
      { name: "description", content: "Kontaktirajte LumaVita za ponudu dekoracije vašeg događaja." },
      { property: "og:title", content: "Kontakt — LumaVita" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { data: s } = useSettings();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <section className="pt-16 pb-10">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="kicker mb-4">Javite se</p>
          <h1 className="font-display text-5xl md:text-6xl">Kontakt</h1>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">

            Recite nam nešto više o vašem događaju — javljamo se u najkraćem roku sa personalizovanom ponudom.

          </p>
        </div>
      </section>
      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <ul className="space-y-5 text-base">
              {s?.contact_phone && (
                <li className="flex items-start gap-4">
                  <Phone className="text-primary" size={20} />
                  <div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">Telefon</div>
                    <a href={`tel:${s.contact_phone}`} className="font-medium">{s.contact_phone}</a>
                  </div>
                </li>
              )}
              {s?.contact_email && (
                <li className="flex items-start gap-4">
                  <Mail className="text-primary" size={20} />
                  <div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">Email</div>
                    <a href={`mailto:${s.contact_email}`} className="font-medium">{s.contact_email}</a>
                  </div>
                </li>
              )}
              {s?.contact_instagram && (
                <li className="flex items-start gap-4">
                  <Instagram className="text-primary" size={20} />
                  <div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">Instagram</div>
                    <div className="font-medium">{s.contact_instagram}</div>
                  </div>
                </li>
              )}
              {s?.contact_address && (
                <li className="flex items-start gap-4">
                  <MapPin className="text-primary" size={20} />
                  <div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">Adresa</div>
                    <div className="font-medium">{s.contact_address}</div>
                  </div>
                </li>
              )}
            </ul>
            {s?.google_maps_embed && (
              <div className="rounded-2xl overflow-hidden border border-border h-72">
                <iframe
                  src={s.google_maps_embed}
                  className="w-full h-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mapa"
                />
              </div>
            )}
          </div>
          <div className="rounded-3xl bg-secondary/40 p-8 md:p-10">
            <h2 className="font-display text-3xl mb-6">Pošaljite upit</h2>
            <ContactForm />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}