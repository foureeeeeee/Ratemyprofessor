-- Run this in your Supabase SQL Editor

-- Create Professors table
CREATE TABLE professors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  title TEXT NOT NULL,
  image TEXT NOT NULL,
  average_rating NUMERIC DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Courses table
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  description TEXT,
  professor_ids UUID[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  professor_id UUID REFERENCES professors(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  rating NUMERIC NOT NULL,
  difficulty NUMERIC NOT NULL,
  tags TEXT[] DEFAULT '{}',
  comment TEXT NOT NULL,
  course_code TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  clarity NUMERIC NOT NULL,
  fairness NUMERIC NOT NULL,
  communication NUMERIC NOT NULL,
  expertise NUMERIC NOT NULL,
  approachability NUMERIC NOT NULL,
  for_credit BOOLEAN DEFAULT true,
  attendance TEXT DEFAULT 'N/A',
  would_take_again BOOLEAN DEFAULT true,
  grade TEXT DEFAULT 'N/A',
  textbook_used BOOLEAN DEFAULT false,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Reports table
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  target_id UUID NOT NULL,
  target_type TEXT NOT NULL,
  reason TEXT NOT NULL,
  details TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  reporter_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE professors ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on professors" ON professors FOR SELECT USING (true);
CREATE POLICY "Allow public read access on courses" ON courses FOR SELECT USING (true);
CREATE POLICY "Allow public read access on reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Allow public read access on reports" ON reports FOR SELECT USING (true);

-- Create policies for public insert access (for demo purposes, usually you'd restrict this)
CREATE POLICY "Allow public insert on professors" ON professors FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on courses" ON courses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on reviews" ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on reports" ON reports FOR INSERT WITH CHECK (true);

-- Create policies for public update access (for demo purposes)
CREATE POLICY "Allow public update on professors" ON professors FOR UPDATE USING (true);
CREATE POLICY "Allow public update on courses" ON courses FOR UPDATE USING (true);
CREATE POLICY "Allow public update on reviews" ON reviews FOR UPDATE USING (true);
CREATE POLICY "Allow public update on reports" ON reports FOR UPDATE USING (true);

-- Create policies for public delete access (for demo purposes)
CREATE POLICY "Allow public delete on professors" ON professors FOR DELETE USING (true);
CREATE POLICY "Allow public delete on courses" ON courses FOR DELETE USING (true);
CREATE POLICY "Allow public delete on reviews" ON reviews FOR DELETE USING (true);
CREATE POLICY "Allow public delete on reports" ON reports FOR DELETE USING (true);
