import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import type { IUser } from '@/types/user';
import { VERSION } from './types';

interface State {
  user: IUser;
}

interface Action {
  setUser: (user: IUser) => void;
}

type UserStore = State & Action;

export const useUserStore = create<UserStore>()(
	devtools(
		persist(
			(set) => ({
				user: {} as IUser,
				setUser: (user) => set((state) => ({ ...state, user })),
			}),
			{ name: 'user', version: VERSION }
		)
	)
);
