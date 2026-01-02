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

  // 第一引数に現在のID,第二引数に親のIDが渡ってくる
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

  // ノートの検索処理
  async findByKeyword(user_id: string, keyword: string) {
    const { data } = await supabase
      .from('notes')
      .select()
      .eq('user_id', user_id)
      .or(`title.ilike.%${keyword}%,content.ilike.%${keyword}%`) // %が両方で検索が部分一致でもヒットする書き方
      .order('created_at', { ascending: false });
    return data;
  },

  // 特定のIDのノートのデータを取得する処理
  async findOne(user_id: string, id: number) {
    const { data } = await supabase
      .from('notes')
      .select()
      .eq('id', id)
      .eq('user_id', user_id)
      .single();
    return data;
  },

  // ノートのタイトルの更新処理
  async update(id: number, note: { title?: string; content?: string }) {
    const { data } = await supabase.from('notes').update(note).eq('id', id).select().single();
    return data;
  },

  //自作SQLを用いて、ノートの削除の処理
  async delete(id: number) {
    const { error } = await supabase.rpc('delete_children_notes_recursively', { note_id: id });
    if (error !== null) throw new Error(error.message);
    return true;
  },
};
