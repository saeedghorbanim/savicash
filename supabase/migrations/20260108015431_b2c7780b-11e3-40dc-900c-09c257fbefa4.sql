-- Create budget_limits table to track user spending limits
CREATE TABLE public.budget_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL DEFAULT 'total',
  limit_amount DECIMAL(10,2) NOT NULL,
  current_spent DECIMAL(10,2) NOT NULL DEFAULT 0,
  period TEXT NOT NULL DEFAULT 'monthly',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (public for now since no auth)
ALTER TABLE public.budget_limits ENABLE ROW LEVEL SECURITY;

-- Allow all operations for now (will add user_id later with auth)
CREATE POLICY "Allow all operations on budget_limits"
ON public.budget_limits
FOR ALL
USING (true)
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_budget_limits_updated_at
BEFORE UPDATE ON public.budget_limits
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();