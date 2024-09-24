import qs from 'qs';
import { apiClient } from '@/api/utils/request';

export interface RequestBody {
	amount?: string;
	address_coin_id: number;
}

export interface RequestResponse {
	error: 'string';
	data: {
		redirect_url: 'string';
	};
}

export interface LimitResponse {
	error: '';
	data: {
		min: string;
		max: string;
	};
}

export class Payment {
	public name: string;
	
	constructor (name: string) {
		this.name = name;
	}

	public async request (data: RequestBody): Promise<RequestResponse> {
		const res = await apiClient.get(`/api/v1/deposit/${this.name}/redirect?${qs.stringify(data)}`);
		return res.data;
	}

	public async limit (data: RequestBody): Promise<LimitResponse> {
		const res = await apiClient.get(`/api/v1/deposit/${this.name}/limits?${qs.stringify(data)}`);
		return res.data;
	}
}
