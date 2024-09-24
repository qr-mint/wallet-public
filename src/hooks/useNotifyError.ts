import { useErrorBoundary } from 'react-error-boundary';
import { notify } from '@/utils/notify';
import { AxiosError, AxiosResponse, isAxiosError } from 'axios';
import { HttpStatusCodes } from '@/constants/httpStatusCodes.ts';
import { BackendResponseError } from '@/types/common';

interface UseNotifyErrorPublic {
	parse: (error: unknown) => void;
}

export const useNotifyError = (): UseNotifyErrorPublic => {
	const { showBoundary } = useErrorBoundary();

	const parse = (error: unknown): void => {
		const isAxios = isAxiosError(error);

		if (!isAxios || error.status !== HttpStatusCodes.NOT_FOUND) {
			showBoundary(error);
		}

		const errorAxios = error as AxiosError<BackendResponseError>;


		notify({ message: errorAxios?.response?.data?.error ?? '', type: 'error' });
	};

	return {
		parse,
	};
};
