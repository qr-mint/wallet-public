import cn from 'classnames';
import type { FunctionComponent } from 'react';

import { Loading } from '../loading';
import styles from './button.module.scss';
import type { ButtonProps } from './types';

export const Button: FunctionComponent<ButtonProps> = ({
	children,
	className,
	theme = 'primary',
	type = 'button',
	disabled = false,
	loading = false,
	...rest
}) => {
	return (
		<button
			type={type}
			disabled={disabled}
			className={cn(styles['button'], className, styles[theme], {
				[styles.loading]: loading,
				[styles.disabled]: disabled,
			})}
			{...rest}
		>
			{loading ? <Loading className={styles['button__loading-icon']} /> : children}
		</button>
	);
};
