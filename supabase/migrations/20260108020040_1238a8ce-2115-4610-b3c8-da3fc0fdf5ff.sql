-- Create expenses table to track all expenses
CREATE TABLE public.expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  category TEXT,
  store TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Allow all operations for now (will add user_id later with auth)
CREATE POLICY "Allow all operations on expenses"
ON public.expenses
FOR ALL
USING (true)
WITH CHECK (true);

-- Enable realtime for expenses
ALTER PUBLICATION supabase_realtime ADD TABLE public.expenses;