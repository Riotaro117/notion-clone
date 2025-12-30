import { supabase } from '@/lib/supabase';
// DBに変更を加える処理をこのファイルに書いている

// 以下はSupabaseのnotesテーブルに「新しいノートを１件作成する」処理を書いている

export const noteRepository = {
  // ?がついているのは指定されなくてもOKということ
  async create(userId: string, params: { title?: string; parentId?: number }) {
    const { data, error } = await supabase
      .from('notes') // どこのデータテーブルを参照にするか
      .insert([
        {
          user_id: userId,
          title: params.title,
          parent_document: params.parentId,
        },
      ]) // 挿入したい時に使うメソッド
      .select() //変更した行はデフォルトでは返さないから、selectメソッドを使って返す
      .single(); //デフォルトでは配列で複数行返してしまうから配列ではなくオブジェクトとして返すため
    if (error != null) throw new Error(error.message);
    return data;
  },

  async find(userId: string, parentDocumentId?: number) {
    const query = supabase
      .from('notes')
      .select() //
      .eq('user_id', userId) //第一引数（データベースのカラム名）＝第二引数という条件（変数）
      .order('created_at', { ascending: false }); //並び順の変更falseなら新しい順
    const { data } =
      parentDocumentId != null
        ? await query.eq('parent_document', parentDocumentId)
        : await query.is('parent_document', null);
    return data;
  },
};
