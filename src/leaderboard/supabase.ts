import { createClient } from "@supabase/supabase-js";

const options = {
  schema: 'public',
}

export const supabase = createClient(
  'https://dohysbywpvqieovitawt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvaHlzYnl3cHZxaWVvdml0YXd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTI0ODcwMTQsImV4cCI6MTk2ODA2MzAxNH0.rYFZrXwMUOhgnzhnVBRaMb3i9ZGatErKkWSZYN9RZAg',
  options,
);
