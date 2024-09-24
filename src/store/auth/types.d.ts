import { AxiosError } from 'axios';
import { STATE } from './useAuthStore';

interface Profile {
	firstName: string;
	lastName: string;
	username: string;
	language: string;
	imageSource: string;
}

export interface IToken {
	accessToken: string;
	refreshToken: string;
}

export interface AuthState {
	name: STATE;
	token?: IToken;
	profile: Profile;
}

interface AuthActions {
	init: () => Promise<void>;
	loading(): void;
	updateToken: (token: IToken) => void;
	authorizate(initData: string): Promise<void>;
	fetchProfile: (callback?: (error: AxiosError) => void) => Promise<void>;
}

export type AuthStore = AuthState & AuthActions;
