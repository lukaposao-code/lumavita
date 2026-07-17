export type Category = {
  slug: string;
  name: string;
  kicker: string | null;
  description: string | null;
  hero_image: string | null;
  sort_order: number;
};

export type Decoration = {
  id: string;
  category_slug: string;
  number: number;
  title: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
};

export type GalleryItem = {
  id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
};

export type Testimonial = {
  id: string;
  author_name: string;
  content: string;
  sort_order: number;
};

export type SiteSetting = {
  key: string;
  value: string | null;
};

export const CATEGORY_ROUTES: Record<string, string> = {
  vencanja: "/vencanja",
  rodjendani: "/rodjendani",
  krstenja: "/krstenja",
  "gender-reveal": "/gender-reveal",
  punoletstva: "/punoletstva",
  "poslovni-dogadjaji": "/poslovni-dogadjaji",
};