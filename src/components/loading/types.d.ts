import type { DetailedHTMLProps, HTMLAttributes } from 'react';
import { colors } from './enum';

export interface LoadingProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	hidden?: boolean;
	color?: colors;
}
