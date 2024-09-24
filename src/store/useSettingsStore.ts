import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { VERSION } from './types';

interface State {
	language: string;
	currency: string;
	alert: boolean;
	qrImages?: object;
}

interface Action {
	setLanguage: (language: string) => void;
	setCurrency: (currency: string) => void;
	setAlert: (alert: boolean) => void;
}

type SettingsStore = State & Action;

export const useSettingsStore = create<SettingsStore>()(
	devtools(
		persist(
			(set) => ({
				// State
				language: 'en',
				currency: 'USD',
				alert: false,

				// Action
				setLanguage: (language) => set((state) => ({ ...state, language })),
				setCurrency: (currency) => set((state) => ({ ...state, currency })),
				setAlert: (alert) => set((state) => ({ ...state, alert })),
			}),
			{ name: 'settings', version: VERSION },
		),
	),
);
