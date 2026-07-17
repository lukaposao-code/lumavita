import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  useCategories,
  useDecorations,
  useGallery,
  useSettings,
  useTestimonials,
  useIsAdmin,
} from "@/lib/site-queries";
import { uploadImage } from "@/lib/upload-image";
import { Trash2, Upload, Plus, LogOut, ArrowUp, ArrowDown, Save } from "lucide-react";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Admin — LumaVita" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminPage,
});

type Tab =
  | "settings"
  | "categories"
  | "decorations"
  | "gallery"
  | "testimonials";

function AdminPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<Tab>("settings");
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        navigate({ to: "/auth" });
      } else {
        setReady(true);
      }
    });
  }, [navigate]);

  if (!ready || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">Učitavam...</div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h1 className="font-display text-3xl mb-4">Nemate pristup</h1>
          <p className="text-muted-foreground mb-6">
            Ovaj nalog nema admin ovlašćenja. Prijavite se na vlasnički email da biste dobili pristup panelu.
          </p>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/auth" });
            }}
            className="pill"
          >
            <LogOut size={16} /> Odjavi se
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-secondary/30">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="font-display text-xl">
              LumaVita
            </Link>
            <span className="text-xs uppercase tracking-widest text-muted-foreground">
              Admin
            </span>
          </div>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/" });
            }}
            className="text-sm flex items-center gap-2 hover:text-foreground text-muted-foreground"
          >
            <LogOut size={16} /> Odjava
          </button>
        </div>
        <div className="mx-auto max-w-6xl px-6 flex gap-1 overflow-x-auto">
          {(
            [
              ["settings", "Podešavanja"],
              ["categories", "Kategorije"],
              ["decorations", "Dekoracije"],
              ["gallery", "Galerija"],
              ["testimonials", "Recenzije"],
            ] as [Tab, string][]
          ).map(([k, l]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`px-4 py-3 text-sm whitespace-nowrap border-b-2 transition-colors ${
                tab === k
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">
        {tab === "settings" && <SettingsTab />}
        {tab === "categories" && <CategoriesTab />}
        {tab === "decorations" && <DecorationsTab />}
        {tab === "gallery" && <GalleryTab />}
        {tab === "testimonials" && <TestimonialsTab />}
      </main>
    </div>
  );
}

/* ---------- Shared UI ---------- */

function ImageField({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  return (
    <div className="flex items-center gap-4">
      <div className="w-24 h-24 rounded-xl bg-muted overflow-hidden shrink-0 border">
        {value && <img src={value} alt="" className="w-full h-full object-cover" />}
      </div>
      <label className="pill-outline cursor-pointer text-sm">
        <Upload size={14} />
        {uploading ? "Šaljem..." : "Nova slika"}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          disabled={uploading}
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setUploading(true);
            try {
              const url = await uploadImage(file);
              onChange(url);
              toast.success("Slika otpremljena");
            } catch (err: unknown) {
              toast.error(err instanceof Error ? err.message : "Greška");
            } finally {
              setUploading(false);
            }
          }}
        />
      </label>
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${props.className ?? ""}`}
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${props.className ?? ""}`}
    />
  );
}

/* ---------- Settings tab ---------- */

const SETTING_FIELDS: { key: string; label: string; long?: boolean }[] = [
  { key: "hero_kicker", label: "Hero nadnaslov" },
  { key: "hero_title", label: "Hero naslov", long: true },
  { key: "hero_subtitle", label: "Hero podnaslov", long: true },
  { key: "about_kicker", label: "O nama — nadnaslov" },
  { key: "about_title", label: "O nama — naslov" },
  { key: "about_text", label: "O nama — tekst", long: true },
  { key: "contact_phone", label: "Telefon" },
  { key: "contact_email", label: "Email" },
  { key: "contact_instagram", label: "Instagram" },
  { key: "contact_address", label: "Adresa" },
  { key: "google_maps_embed", label: "Google Maps embed URL", long: true },
];

function SettingsTab() {
  const { data: settings } = useSettings();
  const qc = useQueryClient();
  const [local, setLocal] = useState<Record<string, string>>({});

  useEffect(() => {
    if (settings) setLocal({ ...settings });
  }, [settings]);

  async function saveOne(key: string) {
    const value = local[key] ?? "";
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key, value }, { onConflict: "key" });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Sačuvano");
      qc.invalidateQueries({ queryKey: ["site_settings"] });
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl">Podešavanja sajta</h2>
      <div className="space-y-4">
        {SETTING_FIELDS.map((f) => (
          <div key={f.key} className="bg-card border border-border rounded-xl p-5">
            <label className="block text-sm font-medium mb-2">{f.label}</label>
            {f.long ? (
              <Textarea
                rows={3}
                value={local[f.key] ?? ""}
                onChange={(e) => setLocal({ ...local, [f.key]: e.target.value })}
              />
            ) : (
              <Input
                value={local[f.key] ?? ""}
                onChange={(e) => setLocal({ ...local, [f.key]: e.target.value })}
              />
            )}
            <button
              onClick={() => saveOne(f.key)}
              className="mt-3 pill-outline text-xs"
            >
              <Save size={12} /> Sačuvaj
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Categories tab ---------- */

function CategoriesTab() {
  const { data: categories } = useCategories();
  const qc = useQueryClient();

  async function save(
    slug: string,
    patch: {
      name: string;
      kicker: string | null;
      description: string | null;
      hero_image: string | null;
    },
  ) {
    const { error } = await supabase.from("categories").update(patch).eq("slug", slug);
    if (error) toast.error(error.message);
    else {
      toast.success("Sačuvano");
      qc.invalidateQueries({ queryKey: ["categories"] });
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl">Kategorije</h2>
      <div className="space-y-4">
        {categories?.map((c) => (
          <details
            key={c.slug}
            className="bg-card border border-border rounded-xl overflow-hidden"
          >
            <summary className="cursor-pointer px-5 py-4 font-medium flex items-center justify-between">
              <span>{c.name}</span>
              <span className="text-xs text-muted-foreground">/{c.slug}</span>
            </summary>
            <CategoryEditor category={c} onSave={(p) => save(c.slug, p)} />
          </details>
        ))}
      </div>
    </div>
  );
}

function CategoryEditor({
  category,
  onSave,
}: {
  category: { slug: string; name: string; kicker: string | null; description: string | null; hero_image: string | null };
  onSave: (patch: {
    name: string;
    kicker: string | null;
    description: string | null;
    hero_image: string | null;
  }) => void;
}) {
  const [name, setName] = useState(category.name);
  const [kicker, setKicker] = useState(category.kicker ?? "");
  const [description, setDescription] = useState(category.description ?? "");
  const [heroImage, setHeroImage] = useState<string | null>(category.hero_image);

  return (
    <div className="p-5 border-t border-border space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Naziv</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Nadnaslov</label>
        <Input value={kicker} onChange={(e) => setKicker(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Opis</label>
        <Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Naslovna slika</label>
        <ImageField value={heroImage} onChange={setHeroImage} />
      </div>
      <button
        onClick={() =>
          onSave({
            name,
            kicker: kicker || null,
            description: description || null,
            hero_image: heroImage,
          })
        }
        className="pill text-sm"
      >
        <Save size={14} /> Sačuvaj promene
      </button>
    </div>
  );
}

/* ---------- Decorations tab ---------- */

function DecorationsTab() {
  const { data: categories } = useCategories();
  const [selected, setSelected] = useState<string>("");

  useEffect(() => {
    if (!selected && categories && categories[0]) setSelected(categories[0].slug);
  }, [categories, selected]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 flex-wrap">
        <h2 className="font-display text-2xl">Dekoracije</h2>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
        >
          {categories?.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      {selected && <DecorationList slug={selected} />}
    </div>
  );
}

function DecorationList({ slug }: { slug: string }) {
  const { data: items } = useDecorations(slug);
  const qc = useQueryClient();

  async function add() {
    const maxNum = Math.max(0, ...(items?.map((i) => i.number) ?? []));
    const maxSort = Math.max(0, ...(items?.map((i) => i.sort_order) ?? []));
    const { error } = await supabase.from("decorations").insert({
      category_slug: slug,
      number: maxNum + 1,
      title: `Dekoracija ${maxNum + 1}`,
      description: "",
      sort_order: maxSort + 1,
    });
    if (error) toast.error(error.message);
    else qc.invalidateQueries({ queryKey: ["decorations"] });
  }

  async function remove(id: string) {
    if (!confirm("Obrisati ovu dekoraciju?")) return;
    const { error } = await supabase.from("decorations").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Obrisano");
      qc.invalidateQueries({ queryKey: ["decorations"] });
    }
  }

  async function move(id: string, dir: -1 | 1) {
    if (!items) return;
    const idx = items.findIndex((i) => i.id === id);
    const other = items[idx + dir];
    if (!other) return;
    const a = items[idx];
    await supabase.from("decorations").update({ sort_order: other.sort_order }).eq("id", a.id);
    await supabase.from("decorations").update({ sort_order: a.sort_order }).eq("id", other.id);
    qc.invalidateQueries({ queryKey: ["decorations"] });
  }

  return (
    <div className="space-y-4">
      <button onClick={add} className="pill text-sm">
        <Plus size={14} /> Dodaj dekoraciju
      </button>
      {items?.map((d, idx) => (
        <DecorationCard
          key={d.id}
          item={d}
          onDelete={() => remove(d.id)}
          onMoveUp={idx > 0 ? () => move(d.id, -1) : undefined}
          onMoveDown={idx < (items.length - 1) ? () => move(d.id, 1) : undefined}
        />
      ))}
    </div>
  );
}

function DecorationCard({
  item,
  onDelete,
  onMoveUp,
  onMoveDown,
}: {
  item: { id: string; number: number; title: string; description: string | null; image_url: string | null };
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}) {
  const qc = useQueryClient();
  const [number, setNumber] = useState(item.number);
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description ?? "");
  const [imageUrl, setImageUrl] = useState<string | null>(item.image_url);

  async function save() {
    const { error } = await supabase
      .from("decorations")
      .update({ number, title, description: description || null, image_url: imageUrl })
      .eq("id", item.id);
    if (error) toast.error(error.message);
    else {
      toast.success("Sačuvano");
      qc.invalidateQueries({ queryKey: ["decorations"] });
    }
  }

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={onMoveUp}
            disabled={!onMoveUp}
            className="p-2 disabled:opacity-30 hover:bg-secondary rounded"
          >
            <ArrowUp size={14} />
          </button>
          <button
            onClick={onMoveDown}
            disabled={!onMoveDown}
            className="p-2 disabled:opacity-30 hover:bg-secondary rounded"
          >
            <ArrowDown size={14} />
          </button>
        </div>
        <button onClick={onDelete} className="text-destructive p-2 hover:bg-destructive/10 rounded">
          <Trash2 size={14} />
        </button>
      </div>
      <div className="grid md:grid-cols-[auto_1fr] gap-4 items-start">
        <div className="w-40">
          <label className="block text-xs mb-1">Broj</label>
          <Input
            type="number"
            value={number}
            onChange={(e) => setNumber(Number(e.target.value))}
          />
        </div>
        <div>
          <label className="block text-xs mb-1">Naslov</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
      </div>
      <div>
        <label className="block text-xs mb-1">Opis</label>
        <Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div>
        <label className="block text-xs mb-1">Slika</label>
        <ImageField value={imageUrl} onChange={setImageUrl} />
      </div>
      <button onClick={save} className="pill text-sm">
        <Save size={14} /> Sačuvaj
      </button>
    </div>
  );
}

/* ---------- Gallery tab ---------- */

function GalleryTab() {
  const { data: items } = useGallery();
  const qc = useQueryClient();
  const [uploading, setUploading] = useState(false);

  async function onUpload(file: File) {
    setUploading(true);
    try {
      const url = await uploadImage(file);
      const maxSort = Math.max(0, ...(items?.map((i) => i.sort_order) ?? []));
      const { error } = await supabase
        .from("gallery_items")
        .insert({ image_url: url, sort_order: maxSort + 1 });
      if (error) throw error;
      toast.success("Dodato u galeriju");
      qc.invalidateQueries({ queryKey: ["gallery"] });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Greška");
    } finally {
      setUploading(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Obrisati sliku?")) return;
    const { error } = await supabase.from("gallery_items").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      qc.invalidateQueries({ queryKey: ["gallery"] });
      toast.success("Obrisano");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl">Galerija</h2>
        <label className="pill text-sm cursor-pointer">
          <Upload size={14} /> {uploading ? "Šaljem..." : "Dodaj sliku"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
          />
        </label>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items?.map((g) => (
          <div key={g.id} className="relative group">
            <div className="aspect-square rounded-xl overflow-hidden bg-muted">
              <img src={g.image_url} alt="" className="w-full h-full object-cover" />
            </div>
            <button
              onClick={() => remove(g.id)}
              className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Testimonials tab ---------- */

function TestimonialsTab() {
  const { data: items } = useTestimonials();
  const qc = useQueryClient();

  async function add() {
    const maxSort = Math.max(0, ...(items?.map((i) => i.sort_order) ?? []));
    const { error } = await supabase
      .from("testimonials")
      .insert({ author_name: "Novi klijent", content: "Recenzija...", sort_order: maxSort + 1 });
    if (error) toast.error(error.message);
    else qc.invalidateQueries({ queryKey: ["testimonials"] });
  }

  async function remove(id: string) {
    if (!confirm("Obrisati recenziju?")) return;
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      qc.invalidateQueries({ queryKey: ["testimonials"] });
      toast.success("Obrisano");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl">Recenzije</h2>
        <button onClick={add} className="pill text-sm">
          <Plus size={14} /> Dodaj
        </button>
      </div>
      {items?.map((t) => (
        <TestimonialCard key={t.id} item={t} onDelete={() => remove(t.id)} />
      ))}
    </div>
  );
}

function TestimonialCard({
  item,
  onDelete,
}: {
  item: { id: string; author_name: string; content: string };
  onDelete: () => void;
}) {
  const qc = useQueryClient();
  const [name, setName] = useState(item.author_name);
  const [content, setContent] = useState(item.content);

  async function save() {
    const { error } = await supabase
      .from("testimonials")
      .update({ author_name: name, content })
      .eq("id", item.id);
    if (error) toast.error(error.message);
    else {
      toast.success("Sačuvano");
      qc.invalidateQueries({ queryKey: ["testimonials"] });
    }
  }

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-3">
      <div className="flex justify-end">
        <button onClick={onDelete} className="text-destructive p-2 hover:bg-destructive/10 rounded">
          <Trash2 size={14} />
        </button>
      </div>
      <div>
        <label className="block text-xs mb-1">Ime</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label className="block text-xs mb-1">Tekst</label>
        <Textarea rows={3} value={content} onChange={(e) => setContent(e.target.value)} />
      </div>
      <button onClick={save} className="pill text-sm">
        <Save size={14} /> Sačuvaj
      </button>
    </div>
  );
}