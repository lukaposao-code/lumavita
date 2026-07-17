
-- =========================
-- ROLE SYSTEM
-- =========================
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Auto-grant admin to the site owner's verified email
CREATE OR REPLACE FUNCTION public.grant_admin_for_owner_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email_confirmed_at IS NOT NULL
     AND lower(NEW.email) = 'luka.aleksic@logistar.rs' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_grant_admin
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.grant_admin_for_owner_email();

CREATE TRIGGER on_auth_user_confirmed_grant_admin
AFTER UPDATE OF email_confirmed_at ON auth.users
FOR EACH ROW
WHEN (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL)
EXECUTE FUNCTION public.grant_admin_for_owner_email();

-- =========================
-- SHARED updated_at helper
-- =========================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- =========================
-- CATEGORIES
-- =========================
CREATE TABLE public.categories (
  slug text PRIMARY KEY,
  name text NOT NULL,
  kicker text,
  description text,
  hero_image text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can insert categories" ON public.categories FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update categories" ON public.categories FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete categories" ON public.categories FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================
-- DECORATIONS
-- =========================
CREATE TABLE public.decorations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_slug text NOT NULL REFERENCES public.categories(slug) ON DELETE CASCADE,
  number int NOT NULL,
  title text NOT NULL,
  description text,
  image_url text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX decorations_category_idx ON public.decorations(category_slug, sort_order);
GRANT SELECT ON public.decorations TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.decorations TO authenticated;
GRANT ALL ON public.decorations TO service_role;
ALTER TABLE public.decorations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view decorations" ON public.decorations FOR SELECT USING (true);
CREATE POLICY "Admins can insert decorations" ON public.decorations FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update decorations" ON public.decorations FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete decorations" ON public.decorations FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER decorations_updated_at BEFORE UPDATE ON public.decorations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================
-- GALLERY
-- =========================
CREATE TABLE public.gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  caption text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gallery_items TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.gallery_items TO authenticated;
GRANT ALL ON public.gallery_items TO service_role;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view gallery" ON public.gallery_items FOR SELECT USING (true);
CREATE POLICY "Admins can insert gallery" ON public.gallery_items FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update gallery" ON public.gallery_items FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete gallery" ON public.gallery_items FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER gallery_items_updated_at BEFORE UPDATE ON public.gallery_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================
-- TESTIMONIALS
-- =========================
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name text NOT NULL,
  content text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.testimonials TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.testimonials TO authenticated;
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Admins can insert testimonials" ON public.testimonials FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update testimonials" ON public.testimonials FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete testimonials" ON public.testimonials FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER testimonials_updated_at BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================
-- SITE SETTINGS (key/value)
-- =========================
CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can insert settings" ON public.site_settings FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update settings" ON public.site_settings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete settings" ON public.site_settings FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================
-- SEED DATA
-- =========================
INSERT INTO public.categories (slug, name, kicker, description, hero_image, sort_order) VALUES
  ('vencanja', 'Venčanja', 'ROMANTIKA I ELEGANCIJA', 'Dekoracije za venčanja koje odražavaju vašu ljubavnu priču — od intimnih ceremonija do velikih svečanosti.', '/lumavita/vencanja-1.jpg', 1),
  ('rodjendani', 'Rođendani', 'SLAVLJE ŽIVOTA', 'Rođendanske dekoracije za sve uzraste — od dečijih tema do rafiniranih odraslih proslava.', '/lumavita/rodjendan-1.jpg', 2),
  ('krstenja', 'Krštenja', 'NEŽNI POČECI', 'Nežne i profinjene dekoracije za najsvetiji porodični dan.', '/lumavita/krstenje-1.jpg', 3),
  ('gender-reveal', 'Gender Reveal', 'IZNENAĐENJE U ROZE ILI PLAVOJ', 'Dekoracije za otkrivanje pola bebe — magičan trenutak koji se pamti zauvek.', '/lumavita/gender-1.jpg', 4),
  ('punoletstva', 'Punoletstva', 'PRVI VELIKI KORAK', 'Dekoracije za 18. rođendan — elegancija dostojna prekretnice u životu.', '/lumavita/punoletstvo-1.jpg', 5),
  ('poslovni-dogadjaji', 'Poslovni događaji', 'PROFESIONALIZAM SA STILOM', 'Dekoracije za korporativne događaje, konferencije, gala večere i team building-e.', '/lumavita/poslovno-1.jpg', 6);

INSERT INTO public.decorations (category_slug, number, title, description, image_url, sort_order) VALUES
  ('vencanja', 1, 'Dekoracija 1', 'Klasičan romantični sto sa belim ružama, sveće i nežne tekstile.', '/lumavita/vencanja-1.jpg', 1),
  ('vencanja', 2, 'Dekoracija 2', 'Bohemski luk sa peonijama i eukaliptusom, savršen za venčanje na otvorenom.', '/lumavita/vencanja-2.jpg', 2),
  ('rodjendani', 1, 'Dekoracija 1', 'Pastelni baloni sa cvetnim aranžmanima — savršeno za slavlja svih uzrasta.', '/lumavita/rodjendan-1.jpg', 1),
  ('rodjendani', 2, 'Dekoracija 2', 'Zlatna elegancija sa personalizovanim natpisom.', '/lumavita/rodjendan-2.jpg', 2),
  ('krstenja', 1, 'Dekoracija 1', 'Nežni beli aranžman sa detaljima u boji slonovače.', '/lumavita/krstenje-1.jpg', 1),
  ('krstenja', 2, 'Dekoracija 2', 'Roze / plavi aranžman sa dečijim motivima.', '/lumavita/krstenje-2.jpg', 2),
  ('gender-reveal', 1, 'Dekoracija 1', 'Zid od balona u roze i plavoj sa "boy or girl" natpisom.', '/lumavita/gender-1.jpg', 1),
  ('gender-reveal', 2, 'Dekoracija 2', 'Kuli od cupcakes-a i cvetni aranžman.', '/lumavita/gender-2.jpg', 2),
  ('punoletstva', 1, 'Dekoracija 1', 'Glamurozni sto sa zlatnim detaljima i personalizovanim brojem 18.', '/lumavita/punoletstvo-1.jpg', 1),
  ('punoletstva', 2, 'Dekoracija 2', 'Moderna kompozicija u ljubičastoj i srebrnoj.', '/lumavita/punoletstvo-2.jpg', 2),
  ('poslovni-dogadjaji', 1, 'Dekoracija 1', 'Minimalistička korporativna dekoracija sa brendiranim detaljima.', '/lumavita/poslovno-1.jpg', 1),
  ('poslovni-dogadjaji', 2, 'Dekoracija 2', 'Elegantna gala dekoracija za svečane večere.', '/lumavita/poslovno-2.jpg', 2);

INSERT INTO public.gallery_items (image_url, sort_order) VALUES
  ('/lumavita/gallery-1.jpg', 1),
  ('/lumavita/gallery-2.jpg', 2),
  ('/lumavita/gallery-3.jpg', 3),
  ('/lumavita/gallery-4.jpg', 4),
  ('/lumavita/gallery-5.jpg', 5),
  ('/lumavita/gallery-6.jpg', 6);

INSERT INTO public.testimonials (author_name, content, sort_order) VALUES
  ('Dragana M.', 'LumaVita je premašio sva naša očekivanja. Naše venčanje je izgledalo kao iz bajke — svaki detalj je bio besprekoran.', 1),
  ('Jovana P.', 'Organizovali su rođendan mojoj ćerki i sve je bilo čarobno. Deca su bila oduševljena, a mi roditelji potpuno mirni.', 2),
  ('Milica S.', 'Profesionalizam, kreativnost i toplina — sve na jednom mestu. Preporučujem od srca.', 3);

INSERT INTO public.site_settings (key, value) VALUES
  ('hero_kicker', 'DEKORACIJE ZA SVE PRILIKE'),
  ('hero_title', 'Vaš najvažniji dan pretvaramo u bajku'),
  ('hero_subtitle', 'LumaVita — profesionalne dekoracije za venčanja, rođendane, krštenja i sve životne slavlja.'),
  ('about_kicker', 'ŠTA NUDIMO'),
  ('about_title', 'Dekoracije za svaku priliku'),
  ('about_text', 'Sa strašću prema detaljima i osećajem za estetiku, kreiramo dekoracije koje ostavljaju bez daha. Svaki događaj je jedinstven, i zato svaki aranžman prilagođavamo baš vama.'),
  ('contact_phone', '+381 60 000 0000'),
  ('contact_email', 'office@lumavita.rs'),
  ('contact_instagram', '@lumavita.dekoracije'),
  ('contact_address', 'Beograd, Srbija'),
  ('google_maps_embed', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11315.286275867644!2d20.4573!3d44.8125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x475a7aa3d7b53fbd%3A0x1c26a5f4e9b6a4b!2sBelgrade!5e0!3m2!1sen!2srs!4v1700000000000');
