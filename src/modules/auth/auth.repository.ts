import { supabase } from '@/lib/supabase';

// Repository(データ取得、保存、更新を担当する層)をいう設計パターンで作られている
// Supabaseとの直接のやり取りを１箇所にまとめるための仕組み

// オブジェクトで今度signin,signoutが増える可能性がある→まとめやすい
export const authRepository = {
  // signupというメソッドを定義→中には文を書いて良い
  async signup(name: string, email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error != null || data.user == null) throw new Error(error?.message);
    console.log(data);
    return {
      // userNameは後でアクセスするときに使いやすい形にしている
      ...data.user,
      userName: data.user.user_metadata.name,
    };
  },

  async signin(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error != null || data.user == null) throw new Error(error?.message);

    return {
      ...data.user,
      userName: data.user.user_metadata.name,
    };
  },
};
