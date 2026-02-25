import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oupftzzalbueddbxzhih.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91cGZ0enphbGJ1ZWRkYnh6aGloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMTIxMjUsImV4cCI6MjA3NzU4ODEyNX0.TLUkKeDXGdmF2qZ5_SsK_wyBjWG_vVq21l8SmUu5dqo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);