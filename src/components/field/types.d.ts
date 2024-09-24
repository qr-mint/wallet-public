import type { ChangeEvent, ReactNode } from 'react';

export interface FieldProps {
	iconClassName?: string;
	className?: string;

	icon?: ReactNode;
	buttonIcon?: ReactNode;

	onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
	placeholder?: string;
	value?: string;
}