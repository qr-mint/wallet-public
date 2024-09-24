import { toast } from 'react-toastify';
import type { TypeOptions, ToastPosition } from 'react-toastify';

type NotifyOptions = {
  type: TypeOptions;
  message: string;
	position?: ToastPosition;
};

export function notify ({ message, type, position = 'bottom-center' }: NotifyOptions) {
	return toast(message, {
		position: position,
		closeOnClick: true,
		draggable: true,
		autoClose: 4000,
		type,
	});
}
