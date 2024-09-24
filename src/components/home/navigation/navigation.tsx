import classNames from 'classnames';
import { useState } from 'react';
import type { FunctionComponent } from 'react';

import { NavigationButton } from './navigation-button';
import styles from './navigation.module.scss';
import type { NavigationProps } from './types';

export const Navigation: FunctionComponent<NavigationProps> = ({ className, onSelect, screens, selectedScreen }) => {
	const [ current, setCurrent ] = useState<string>(selectedScreen || screens[0].name);

	return (
		<div className={classNames(className, styles['navigation'])}>
			<div className={styles['navigation-header']}>
				{screens.map((screen, key) => (
					<NavigationButton
						key={key}
						text={screen.name}
						active={screen.name === current}
						onClick={() => {
							setCurrent(screen.name);
							onSelect?.(screen.name);
						}}
					/>
				))}
			</div>

			{screens.map(
				(screen, key) =>
					screen.name === current && (
						<div key={key} className={styles['navigation-screen']}>
							{screen.component}
						</div>
					),
			)}
		</div>
	);
};
