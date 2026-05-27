-- Upgrade board_members table
ALTER TABLE board_members ADD COLUMN IF NOT EXISTS category text DEFAULT 'officer' CHECK (category IN ('officer', 'executive', 'advisory', 'past-presidential'));

-- Seed more board data
INSERT INTO board_members (name, role, term, sort_order, category)
VALUES
('Ananta Raj Ghimire', 'Executive Member', 'current', 11, 'executive'),
('Uddab Ban', 'Executive Member', 'current', 12, 'executive'),
('Vivek Basnet', 'Executive Member', 'current', 13, 'executive'),
('Damodar Sharma', 'Executive Member', 'current', 14, 'executive'),
('Ashok Kumar Hathi', 'Executive Member', 'current', 15, 'executive'),
('Dinesh Paudel', 'Executive Member', 'current', 16, 'executive'),
('Sanjeev Pandey', 'Executive Member', 'current', 17, 'executive'),
('Shiva Prasad Aryal', 'Executive Member', 'current', 18, 'executive'),
('Kamal Prasad Timalsina', 'Executive Member', 'current', 19, 'executive'),
('Pradip Bhusal', 'Executive Member', 'current', 20, 'executive'),
('Sudip KC', 'Executive Member', 'current', 21, 'executive'),
('Mr. Arun Lamichhane', 'Chairperson — ECAN Advisory Committee', 'current', 50, 'advisory'),
('Mr. Mahesh Kumar Karki', 'Member — ECAN Advisory Committee', 'current', 51, 'advisory'),
('Mr. Saroj Kumar Basnet', 'Member — ECAN Advisory Committee', 'current', 52, 'advisory'),
('Deepak Gurung', 'Chairperson — ECAN Past Presidential Council', 'current', 100, 'past-presidential'),
('Rajendra Baral', 'Member — ECAN Past Presidential Council', 'current', 101, 'past-presidential')
ON CONFLICT DO NOTHING;