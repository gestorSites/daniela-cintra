import { createClient } from "@supabase/supabase-js";

/*
 * Cliente Supabase singleton.
 * Usa apenas variaveis NEXT_PUBLIC_*, entao funciona tanto no
 * server component (fetchContent) quanto no client (formulario).
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Configuracao do Supabase ausente. Defina NEXT_PUBLIC_SUPABASE_URL e " +
      "NEXT_PUBLIC_SUPABASE_ANON_KEY no arquivo .env.local.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});
