import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	icon: ReactNode;
	children: ReactNode;
	textColor?: 'blue' | 'white';
}
