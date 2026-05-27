// ── Types for ECAN (Database Mapped) ──────────────────────────────────────────

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: "announcement" | "policy" | "event" | "partnership" | "award";
  date: string;
  published: boolean;
  layout?: "classic" | "hero-image" | "split" | "magazine";
  cover_image?: string | null;
  images?: string[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: "guide" | "destination" | "visa" | "scholarship" | "career" | "tips";
  date: string;
  published: boolean;
  read_time: number;
  layout?: "classic" | "hero-image" | "split" | "magazine";
  cover_image?: string | null;
  images?: string[];
}

export interface Member {
  id: string;
  name: string;
  city: string;
  focus: string;
  est: number | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  address: string | null;
  membership_type: string | null;
  logo_url: string | null;
  published: boolean;
}

export interface BoardMember {
  id: string;
  name: string;
  role: string;
  term: string;
  image_url: string | null;
  sort_order: number;
}

export interface Event {
  id: string;
  title: string;
  when_text: string;
  where_text: string;
  blurb: string;
  tag: string;
  image_url: string | null;
  sort_order: number;
}
