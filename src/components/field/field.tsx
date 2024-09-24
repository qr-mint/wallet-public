import cn from 'classnames';
import type { FieldProps } from './types';
import styles from './field.module.scss';
import { forwardRef } from 'react';

export const Field = forwardRef<HTMLInputElement, FieldProps>(
	({ className, iconClassName, buttonIcon, icon, ...props }: FieldProps, ref) => {
		return (
			<div className={cn(className, styles['field'])}>
				{icon && <div className={cn(iconClassName, styles['field__icon'])}>{icon}</div>}
				<input ref={ref} {...props} />

				{buttonIcon}
			</div>
		);
	},
);
