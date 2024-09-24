import PinField from 'react-pin-field';
import { useState } from 'react';
import type { FunctionComponent } from 'react';

import { notify } from '@/utils/notify';
import styles from './pin-pad.module.scss';
import type { PinPadProps } from './types';

import EyeIcon from '@/assets/icons/eye.svg?react';

enum PinPadType {
	text = 'text',
	password = 'password',
}

export const PinPad: FunctionComponent<PinPadProps> = ({ title, onChange }) => {
	const [ disable, setDisabled ] = useState(false);
	const [ type, setType ] = useState(PinPadType.password);

	const wrong = (error: string) => {
		setDisabled(false);
		notify({
			type: 'error',
			message: error,
			position: 'top-right',
		});
	};

	const handleChange = (digit: string) => {
		if (digit.length === 4) {
			onChange(digit, wrong);
		}
	};

	const handleToggleType = () => {
		setType((prev) => (prev === PinPadType.password ? PinPadType.text : PinPadType.password));
	};

	return (
		<div className={styles['pin-pad']}>
			<h1 className={styles['pin-pad__title']}>{title}</h1>

			<div className={styles['field']}>
				<div className={styles['field__label']}>
					<span>{title}</span>

					<button type='button' onClick={handleToggleType}>
						{PinPadType.password ? <EyeIcon /> : <EyeIcon />}
					</button>
				</div>

				<div className={styles['field-inputs']}>
					<PinField
						autoFocus
						validate='0123456789'
						inputMode='numeric'
						type={type}
						length={4}
						onChange={handleChange}
						disabled={disable}
						className={styles['field-inputs__input']}
						onComplete={() => {
							setDisabled(true);
						}}
					/>
				</div>
			</div>
		</div>
	);
};
