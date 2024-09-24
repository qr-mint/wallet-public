import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { AxiosError } from 'axios';

import { VERSION } from '@/store/types.ts';
import { apiClient } from '@/api/utils/request';
import type { AuthStore, AuthState, IToken, Profile } from './types';

export enum AUTH_STATE {
	LOADING = 'LOADING',
	AUTHORIZED = 'AUTHORIZED',
	UNAUTHORIZED = 'UNAUTHORIZED',
}

const initialState: AuthState = {
	name: AUTH_STATE.LOADING,
	profile: {} as Profile,
};

export const useAuthStore = create<AuthStore>()(
	devtools(
		persist(
			(set, get) => ({
				...initialState,

				authorizate: async (initData: string) => {
					try {
						const response = await apiClient.post('/api/v1/auth/telegram', { telegram_query: initData });
						const token = response.data.data;

						set({
							name: AUTH_STATE.AUTHORIZED,
							token: { accessToken: token.access_token, refreshToken: token.refresh_token },
						});
					} catch (error) {
						console.error('Authorization failed:', error);
					}
				},

				loading: () => {
					set({ name: AUTH_STATE.LOADING });
				},

				fetchProfile: async (callback) => {
					try {
						const response = await apiClient.get('/api/v1/profile');
						const { last_name, first_name, image_source, ...rest } = response.data.data;

						set({
							profile: {
								lastName: last_name,
								firstName: first_name,
								imageSource: image_source,
								...rest,
							},
						});
					} catch (e) {
						console.error(e);
						callback?.(e as AxiosError);
					}
				},

				updateToken: (token: IToken) => {
					set({ token });
				},

				init: async () => {
					const { authorizate } = get();

					let initData;
					if (process.env.MODE === 'dev') {
						initData =
							'query_id=AAHBqDoYAAAAAMGoOhjf96I7&user=%7B%22id%22%3A406497473%2C%22first_name%22%3A%22Victor%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22resecher0dev%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1717165747&hash=3a88dac88ff5d1fe715a658ed07d5719977caf245648a061b5ef7983a2335052';
					} else {
						initData = window.Telegram.WebApp.initData;
					}

					await authorizate(initData);
				},
			}),
			{
				name: 'auth',
				version: VERSION,
			},
		),
	),
);
