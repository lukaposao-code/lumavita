import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [{ title: "Prijava — LumaVita" }, { name: "robots", content: "noindex" }],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/admin" },
        });
        if (error) throw error;
        toast.success("Nalog kreiran! Prijavljujem vas...");
        // Auto-signin since email confirmation is disabled
        const { error: siErr } = await supabase.auth.signInWithPassword({ email, password });
        if (siErr) throw siErr;
        navigate({ to: "/admin" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/admin" });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Greška";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <section className="py-20">
        <div className="mx-auto max-w-md px-6">
          <div className="rounded-3xl bg-secondary/40 p-8">
            <h1 className="font-display text-3xl mb-2 text-center">
              {mode === "signin" ? "Prijava" : "Registracija"}
            </h1>
            <p className="text-center text-sm text-muted-foreground mb-6">
              Admin panel za upravljanje sajtom
            </p>
            <form onSubmit={submit} className="space-y-4">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full rounded-full border border-border bg-background px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Lozinka"
                className="w-full rounded-full border border-border bg-background px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button type="submit" disabled={loading} className="pill w-full justify-center">
                {loading ? "..." : mode === "signin" ? "Prijavi se" : "Registruj se"}
              </button>
            </form>
            <button
              type="button"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="mt-5 w-full text-center text-sm text-muted-foreground hover:text-foreground"
            >
              {mode === "signin"
                ? "Nemate nalog? Registrujte se"
                : "Već imate nalog? Prijavite se"}
            </button>
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Admin ovlašćenja se automatski dodeljuju vlasniku sajta.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
}