import type { ReactNode } from 'react';

export interface IScreen {
	name: string;
	component: ReactNode;
}

export interface NavigationProps {
	screens: IScreen[];
	className?: string;
	selectedScreen?: string;
	onSelect?: (navigation: string) => void;
}

export interface NavigationButtonProps {
	text: string;
	active?: boolean;
	onClick?(event: MouseEvent<HTMLButtonElement>): void;
}
