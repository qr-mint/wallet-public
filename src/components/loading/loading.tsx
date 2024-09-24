import cn from 'classnames';
import type { FunctionComponent } from 'react';

import styles from './loading.module.scss';
import type { LoadingProps } from './types.d';
import { colors } from './enum';

export const Loading: FunctionComponent<LoadingProps> = ({ hidden, className, color = colors.while, ...props }) => {
	return (
		<div
			{...props}
			className={cn(
				styles['loader'],
				className, { [styles['hidden']]: hidden, [styles[color]]: !!color }
			)}
		>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
		</div>
	);
};
