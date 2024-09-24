import cn from 'classnames';
import type { FunctionComponent } from 'react';

import styles from './switch.module.scss';

interface SwitchProps {
	className: string;
	isChecked?: boolean;
	onSwitch?(): void;
}

export const Switch: FunctionComponent<SwitchProps> = ({ className, isChecked, onSwitch }) => {
	return (
		<button
			onClick={() => onSwitch?.()}
			className={cn(styles['switch'], className, { [styles['checked']]: isChecked })}
		>
			<div className={styles['switch__circle']}>
				<svg viewBox='0 0 12 12' fill='none'>
					<path
						d='M2.24734 0.334961L6.0784 4.5918L10.3351 0.760742C10.7513 0.38623 11.3727 0.418945 11.7473 0.834961C12.122 1.25146 12.0893 1.87256 11.673 2.24756L7.41632 6.07861L11.2473 10.335C11.622 10.7515 11.5893 11.3726 11.173 11.7476C10.7568 12.1221 10.1354 12.0894 9.76077 11.6729L5.92972 7.4165L1.67303 11.2476C1.25677 11.6221 0.635376 11.5894 0.260773 11.1729C-0.113861 10.7568 -0.0811462 10.1353 0.335083 9.76074L4.5918 5.92969L0.760773 1.67285C0.386139 1.25684 0.418854 0.635254 0.835083 0.260742C1.25134 -0.11377 1.87274 -0.0810547 2.24734 0.334961Z'
						clipRule='evenodd'
						fill='#FF5454'
						fillOpacity='1.000000'
						fillRule='evenodd'
					/>
				</svg>

				<svg viewBox='0 0 12.0075 11.8955' fill='none'>
					<path
						d='M1.00397 6.60352L4.46936 10.8389C4.53577 10.9199 4.66202 10.9126 4.71854 10.8242L11.004 1.00342'
						stroke='#1470F5'
						strokeOpacity='1.000000'
						strokeWidth='2.000000'
						strokeLinejoin='round'
						strokeLinecap='round'
					/>
				</svg>
			</div>
		</button>
	);
};
