import axios from 'axios';

import { useAuthStore } from '@/store/auth/useAuthStore';
import { CryptoMnemonic } from '@/crypto/mnemonic';
import { useSettingsStore } from '@/store/useSettingsStore';
import { refreshAuthToken } from '../auth';

export const apiClient = axios.create({
	baseURL: process.env.API_URL,
	withCredentials: false,
	timeout: 30000,
});

interface IHeader {
	'Authorization': string,
	'Refresh-Token': string,
	'Currency-Code'?: string,
	'Mnemonic-Hash'?: string | null
}

const buildHeaders = (token: any, existingHeaders: any): IHeader => {
	const { currency } = useSettingsStore.getState();

	const headers:IHeader = {
		Authorization: `Bearer ${token.accessToken}`,
		'Refresh-Token': `${token.refreshToken}`,
	};

	const crypto = new CryptoMnemonic();
	if (currency) {
		headers['Currency-Code'] = currency.toLowerCase();
	}
	if (existingHeaders['Currency-Code']) {
		headers['Currency-Code'] = existingHeaders['Currency-Code'];
	}

	if (crypto.isMnemonicHash()) {
		headers['Mnemonic-Hash'] = crypto.getHash();
	}
	return headers;
};

apiClient.interceptors.request.use((config: any) => {
	const { token } = useAuthStore.getState();

	if (token) {
		const headers = buildHeaders(token, config.headers);
		config.headers = headers;
	}
	return config;
});

apiClient.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (error.response.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			try {
				const response = await refreshAuthToken();
				const { updateToken } = useAuthStore.getState();
				updateToken({ accessToken: response.access_token, refreshToken: response.refresh_token });
				const headers = buildHeaders(response, {});

				originalRequest.headers = headers;
				return apiClient(originalRequest);
			} catch {
				try {
					const { init } = useAuthStore.getState();
					await init();
					const headers = buildHeaders(useAuthStore.getState().token, {});
					originalRequest.headers = headers;
					return apiClient(originalRequest);
				} catch (err) {
					return Promise.reject(err);
				}
			}
		} else {
			return Promise.reject(error);
		}
	},
);
