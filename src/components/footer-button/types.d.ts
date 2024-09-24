import type { MainButtonProps } from '@vkruglikov/react-telegram-web-app';
import { versions } from './enum';

export interface FooterButtonProps extends MainButtonProps {
	text: string;
	className?: string;
  disabled?: boolean;
	version?: versions;
	onClick?: () => void;
	loading?: boolean;
}
