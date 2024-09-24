import cn from 'classnames';
import type { FunctionComponent } from 'react';

import styles from './navigation.module.scss';
import type { NavigationButtonProps } from './types';

export const NavigationButton: FunctionComponent<NavigationButtonProps> = ({ text, onClick, active }) => {
	return (
		<button onClick={onClick} className={cn(styles['navigation-header__button'], { [styles.active]: active })}>
			{text}
		</button>
	);
};
