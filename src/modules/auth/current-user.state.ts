import { User } from '@supabase/supabase-js';
import { atom, useAtom } from 'jotai';

// jotaiからatomを呼び出して、supabaseの型であるUserを利用する
const currentUserAtom = atom<User>();

export const useCurrentUserStore = () => {
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  return { currentUser, set: setCurrentUser };
};

const currentUserStore = useCurrentUserStore();
currentUserStore.set(userData);
currentUserStore.currentUser;
