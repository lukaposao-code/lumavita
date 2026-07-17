import { Link } from "@tanstack/react-router";
import { useSettings } from "@/lib/site-queries";
import { Instagram, Mail, Phone } from "lucide-react";

export function Footer() {
  const { data: s } = useSettings();
  return (
    <footer className="bg-secondary/40 border-t border-border/50 mt-16">
      <div className="mx-auto max-w-7xl px-6 py-14 grid gap-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">

           

            <img src="/logo.png" alt="LumaVita logo" className="w-9 h-9 rounded-full object-cover" />

            <div className="font-display text-xl">LumaVita</div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground max-w-xs">
            Profesionalne dekoracije za sve prilike — vaš događaj pretvaramo u bajku.
          </p>
        </div>
        <div>
          <h4 className="kicker mb-4">Kategorije</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/vencanja" className="hover:text-foreground text-muted-foreground">Venčanja</Link></li>
            <li><Link to="/rodjendani" className="hover:text-foreground text-muted-foreground">Rođendani</Link></li>
            <li><Link to="/krstenja" className="hover:text-foreground text-muted-foreground">Krštenja</Link></li>
            <li><Link to="/gender-reveal" className="hover:text-foreground text-muted-foreground">Gender Reveal</Link></li>
            <li><Link to="/punoletstva" className="hover:text-foreground text-muted-foreground">Punoletstva</Link></li>
            <li><Link to="/poslovni-dogadjaji" className="hover:text-foreground text-muted-foreground">Poslovni događaji</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="kicker mb-4">Kontakt</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            {s?.contact_phone && (
              <li className="flex items-center gap-2"><Phone size={14} /> {s.contact_phone}</li>
            )}
            {s?.contact_email && (
              <li className="flex items-center gap-2"><Mail size={14} /> {s.contact_email}</li>
            )}
            {s?.contact_instagram && (
              <li className="flex items-center gap-2"><Instagram size={14} /> {s.contact_instagram}</li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-border/50 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} LumaVita. Sva prava zadržana.
      </div>
    </footer>
  );
}