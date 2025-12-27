import { createClient } from '@supabase/supabase-js';
// このファイルはSupabaseの初期設定ファイル

// createClientは第一引数にプロジェクトURL、第二引数にプロジェクトAPIキーを指定できる
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_API_KEY,
);
