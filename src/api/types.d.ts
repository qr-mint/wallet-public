import type { AxiosResponse } from 'axios';

export interface Response<T> {
	ok: boolean;
	data: T;
	error: string;
}

export interface IError<T = any> {
	message: string;
	status: number;
	response?: AxiosResponse<Response<T>>;
}

export interface Result<T> {
	data?: T;
	error?: IError<T>;
}

export interface ServerResponse<T> {
	data: T | null
	error: string
}
