import cn from 'classnames';
import type { ButtonProps } from './types';
import type { FunctionComponent } from 'react';
import styles from './button.module.scss';

export const Button: FunctionComponent<ButtonProps> = ({
	icon,
	children,
	className,
	disabled,
	textColor = 'blue',
	...props
}) => {
	return (
		<button
			{...props}
			disabled={disabled}
			className={cn(styles['button'], className, styles[textColor], { [styles['disabled']]: disabled })}
		>
			<div className={styles['button__icon']}>{icon}</div>
			<span className={styles['button__text']}>{children}</span>
		</button>
	);
};
