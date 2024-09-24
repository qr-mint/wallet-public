import cn from 'classnames';
import { useState } from 'react';
import type { FunctionComponent } from 'react';

import { Switch } from '../switch';
import type { TokenProps } from './types';
import styles from './token.module.scss';

export const Token: FunctionComponent<TokenProps> = ({ className, token, disabled, checked = false, onSwitch, onClick }) => {
	const [ isChecked, setIsChecked ] = useState<boolean>(checked);

	const handleSwitch = () => {
		if (disabled || !onSwitch) return;

		setIsChecked((prev) => {
			onSwitch(!prev);
			return !prev;
		});
	};

	return (
		<div onClick={onClick} className={cn(styles['token'], className, { [styles['disabled']]: disabled })}>
			<img
				src={`${process.env.API_URL}/${token.imageSource}`}
				alt='token image'
				className={styles['token__image']}
			/>

			<p className={styles['token__name']}>{token.caption}</p>
			<p className={styles['token__symbol']}>{token.symbol}</p>

			{onSwitch && <Switch isChecked={isChecked} onSwitch={handleSwitch} className={styles['token__switch']} />}
		</div>
	);
};
