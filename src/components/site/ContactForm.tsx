import { useState } from "react";
import { toast } from "sonner";

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const payload = {
          ime: formData.get("ime")?.toString().trim() ?? "",
          prezime: formData.get("prezime")?.toString().trim() ?? "",
          email: formData.get("email")?.toString().trim() ?? "",
          telefon: formData.get("telefon")?.toString().trim() ?? "",
          poruka: formData.get("poruka")?.toString().trim() ?? "",
        };

        try {
          const response = await fetch("/api/contact", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            const data = await response.json().catch(() => null);
            throw new Error(data?.error ?? "Greška pri slanju poruke.");
          }

          toast.success("Vaša poruka je poslata. Javićemo se uskoro!");
          form.reset();
        } catch (error: unknown) {
          toast.error(error instanceof Error ? error.message : "Greška pri slanju poruke.");
        } finally {
          setLoading(false);
        }
      }}
    >
      <div className="grid grid-cols-2 gap-4">
        <input required name="ime" placeholder="Ime" className="w-full rounded-full border border-border bg-background px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        <input required name="prezime" placeholder="Prezime" className="w-full rounded-full border border-border bg-background px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
      </div>
      <input required type="email" name="email" placeholder="Email" className="w-full rounded-full border border-border bg-background px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
      <input name="telefon" placeholder="Telefon (opciono)" className="w-full rounded-full border border-border bg-background px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
      <textarea required name="poruka" placeholder="Poruka — recite nam o vašem događaju" rows={5} className="w-full rounded-3xl border border-border bg-background px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
      <button type="submit" disabled={loading} className="pill w-full justify-center">
        {loading ? "Šaljem..." : "Pošalji upit"}
      </button>
    </form>
  );
}