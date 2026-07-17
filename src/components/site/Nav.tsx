import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { useIsAdmin } from "@/lib/site-queries";

const NAV_LINKS: { to: string; label: string }[] = [
  { to: "/", label: "Početna" },
  { to: "/vencanja", label: "Venčanja" },
  { to: "/rodjendani", label: "Rođendani" },
  { to: "/krstenja", label: "Krštenja" },
  { to: "/gender-reveal", label: "Gender Reveal" },
  { to: "/punoletstva", label: "Punoletstva" },
  { to: "/poslovni-dogadjaji", label: "Poslovno" },
  { to: "/galerija", label: "Galerija" },
  { to: "/kontakt", label: "Kontakt" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const { data: isAdmin } = useIsAdmin();

  return (
    <header className="sticky top-0 z-50 bg-background/85 backdrop-blur-md border-b border-border/60">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src="/logo.png" alt="LumaVita logo" className="w-9 h-9 rounded-full object-cover" />

          <div className="leading-tight">
            <div className="font-display text-xl tracking-wide">LumaVita</div>
            <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
              Dekoracije
            </div>
          </div>
        </Link>
        <nav className="hidden lg:flex items-center gap-5 text-sm">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-foreground/80 hover:text-foreground transition-colors"
              activeProps={{ className: "text-foreground font-medium" }}
            >
              {l.label}
            </Link>
          ))}

          {isAdmin && (
            <Link
              to="/admin"
              className="text-accent-foreground/80 hover:text-foreground text-xs uppercase tracking-widest"
            >
              Admin
            </Link>
          )}
        </nav>
        <button
          onClick={() => navigate({ to: "/kontakt" })}
          className="hidden lg:inline-flex pill text-sm"
        >
          Pošalji upit
        </button>
        <button
          className="lg:hidden p-2"
          onClick={() => setOpen(!open)}
          aria-label="Meni"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <div className="lg:hidden border-t border-border/60 bg-background">
          <nav className="flex flex-col p-6 gap-4 text-sm">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="text-foreground/80"
              >
                {l.label}
              </Link>
            ))}

            {isAdmin && (
              <Link to="/admin" onClick={() => setOpen(false)} className="text-foreground/80">
                Admin panel
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}