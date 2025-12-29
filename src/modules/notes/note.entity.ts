import { Database } from "database.types";

// TypeScriptの型を呼び出しやすいように定義
// 型はブラケット記法しか使えない
export type Note = Database["public"]["Tables"]["notes"]["Row"]