-- ── MIGRATION START ───────────────────────────────────────────────────────────
BEGIN;

-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ── news_posts ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS news_posts (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at   timestamptz DEFAULT now(),
  slug         text NOT NULL UNIQUE,
  title        text NOT NULL,
  excerpt      text NOT NULL DEFAULT '',
  content      text NOT NULL DEFAULT '',
  author       text NOT NULL DEFAULT 'ECAN Secretariat',
  category     text NOT NULL DEFAULT 'announcement'
                 CHECK (category IN ('announcement','policy','event','partnership','award')),
  date         date NOT NULL DEFAULT CURRENT_DATE,
  published    boolean NOT NULL DEFAULT false,
  layout       text NOT NULL DEFAULT 'classic'
                 CHECK (layout IN ('classic','hero-image','split','magazine')),
  cover_image  text,
  images       text[] NOT NULL DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_news_slug ON news_posts (slug);
CREATE INDEX IF NOT EXISTS idx_news_published ON news_posts (published);

-- ── blog_posts ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blog_posts (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at   timestamptz DEFAULT now(),
  slug         text NOT NULL UNIQUE,
  title        text NOT NULL,
  excerpt      text NOT NULL DEFAULT '',
  content      text NOT NULL DEFAULT '',
  author       text NOT NULL DEFAULT 'ECAN Editorial',
  category     text NOT NULL DEFAULT 'guide'
                 CHECK (category IN ('guide','destination','visa','scholarship','career','tips')),
  date         date NOT NULL DEFAULT CURRENT_DATE,
  published    boolean NOT NULL DEFAULT false,
  read_time    int NOT NULL DEFAULT 5,
  layout       text NOT NULL DEFAULT 'classic'
                 CHECK (layout IN ('classic','hero-image','split','magazine')),
  cover_image  text,
  images       text[] NOT NULL DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_blog_slug ON blog_posts (slug);
CREATE INDEX IF NOT EXISTS idx_blog_published ON blog_posts (published);

-- ── members ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS members (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at       timestamptz DEFAULT now(),
  name             text NOT NULL,
  city             text NOT NULL,
  focus            text NOT NULL,
  est              int,
  email            text,
  phone            text,
  website          text,
  address          text,
  membership_type  text,
  logo_url         text,
  published        boolean NOT NULL DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_members_name ON members (name);
CREATE INDEX IF NOT EXISTS idx_members_city ON members (city);

-- ── board_members ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS board_members (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text NOT NULL,
  role         text NOT NULL,
  term         text NOT NULL DEFAULT 'current', -- 'current' or e.g., '2022–2024'
  image_url    text,
  sort_order   int DEFAULT 0
);

-- ── events ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS events (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title        text NOT NULL,
  when_text    text NOT NULL,
  where_text   text NOT NULL,
  blurb        text NOT NULL,
  tag          text NOT NULL,
  image_url    text,
  sort_order   int DEFAULT 0
);

-- ── SEED DATA ─────────────────────────────────────────────────────────────────

-- news_posts
INSERT INTO news_posts (slug, title, excerpt, content, author, category, date, published, layout)
VALUES
('ecan-smart-2-launch', 'ECAN Launches Smart 2.0 Initiative for Ethical Consultancy', 'ECAN''s Smart 2.0 initiative sets a new benchmark for transparency and student welfare in Nepal''s outbound education sector.', 'Detailed content...', 'ECAN Secretariat', 'announcement', '2025-03-15', true, 'hero-image')
ON CONFLICT (slug) DO NOTHING;

-- blog_posts
INSERT INTO blog_posts (slug, title, excerpt, content, author, category, date, published, read_time, layout)
VALUES
('australia-student-visa-2025', 'Australia Student Visa 2025', 'A complete breakdown...', 'Content...', 'Priya Sharma', 'visa', '2025-04-10', true, 8, 'hero-image')
ON CONFLICT (slug) DO NOTHING;

-- members
INSERT INTO members (name, city, focus, est, email, phone, website, address, membership_type, published)
VALUES
('ABC Education Consultancy', 'Kathmandu', 'Australia, UK, USA', 2005, 'info@abcedu.com', '01-4444444', 'https://example.com', 'Putalisadak, Kathmandu', 'Full Member', true),
('Global Studies Center', 'Pokhara', 'Canada, New Zealand', 2010, 'contact@globalstudies.com', '061-555555', 'https://example.com', 'Chipledhunga, Pokhara', 'Full Member', true),
('Next Gen Education', 'Chitwan', 'Europe, Japan', 2015, 'hello@nextgen.com', '056-666666', 'https://example.com', 'Bharatpur, Chitwan', 'Associate Member', true);

-- board_members (Current)
INSERT INTO board_members (name, role, term, sort_order)
VALUES
('Laxman Poudel (Andrew)', 'President', 'current', 1),
('Seshraj Bhattarai', 'Immediate Past President', 'current', 2),
('Bashu Deb Dahal', '1st Vice President', 'current', 3),
('Bikalp Raj Pokhrel', '2nd Vice President', 'current', 4),
('Geeta Siwakoti', '3rd Vice President', 'current', 5),
('Bhaba Nath Humagai', 'General Secretary', 'current', 6),
('Suraj Silwal', '1st Secretary', 'current', 7),
('Ashik Karki', '2nd Secretary', 'current', 8),
('Sadhana Pudasaini', 'Treasurer', 'current', 9),
('Govinda Khanal', 'Joint Treasurer', 'current', 10);

-- events
INSERT INTO events (title, when_text, where_text, blurb, tag, sort_order)
VALUES
('27th ECAN Annual Day', '6:00 PM onwards', 'Hotel Everest, New Baneshwor, Kathmandu', 'A celebration of twenty-seven years guiding Nepali students into the world.', 'Annual', 1),
('16th Annual Picnic', '10:00 AM – 5:30 PM', 'Dusit Thani Himalayan Resort', 'Professionalism unplugged — where memories are made.', 'Community', 2),
('EduClave 2.0 — Policy Dialogue', '10:00 AM onwards', 'Marriott Hotel, Naxal, Kathmandu', 'A national dialogue on shaping Nepal''s outbound education policy.', 'Policy', 3);

COMMIT;
-- ── MIGRATION END ─────────────────────────────────────────────────────────────

-- ── events (NEW FEATURE) ─────────────────────────────────────────────────────
-- Renaming old events to avoid conflict with the new schema
ALTER TABLE IF EXISTS events RENAME TO events_old;

CREATE TABLE IF NOT EXISTS events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  location    TEXT,
  map_url     TEXT,
  event_type  TEXT NOT NULL DEFAULT 'general',
  status      TEXT NOT NULL DEFAULT 'upcoming'
                CHECK (status IN ('upcoming','ongoing','past','cancelled')),
  starts_at   TIMESTAMPTZ NOT NULL,
  ends_at     TIMESTAMPTZ,
  cover_image TEXT,
  reg_url     TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_events_status    ON events (status);
CREATE INDEX idx_events_starts_at ON events (starts_at DESC);
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
