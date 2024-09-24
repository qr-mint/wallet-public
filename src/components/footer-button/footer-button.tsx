import cn from 'classnames';
import type { FunctionComponent } from 'react';

import { Button } from '@/components/button';
import styles from './footer-button.module.scss';
import type { FooterButtonProps } from './types';
import { versions } from './enum';

export const FooterButton: FunctionComponent<FooterButtonProps> = ({ text, onClick, className, version = versions.telegrem, ...props }) => {
	return (
		<div className={cn(styles['navigation'], className)}>
			<Button
				{...props}
				onClick={onClick}
				className={styles['navigation__button']}
				disabled={props.disabled}
			>
				{text}
			</Button>
		</div>
	);
};
