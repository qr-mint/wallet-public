import type { FunctionComponent } from 'react';
import styles from './alert.module.scss';
import FilledInfoIcon from '@/assets/icons/filled-info.svg?react';
import InfoIcon from '@/assets/icons/info.svg?react';
import XIcon from '@/assets/icons/x.svg?react';
import { useTranslation } from 'react-i18next';

type AlertProps = {
	title: string;
	description: string;
	onCopy: () => void;
	onClose: () => void;
	onInfo: () => void;
};

export const Alert: FunctionComponent<AlertProps> = ({ title, description, onCopy, onClose, onInfo }) => {
	const { t } = useTranslation();

	return (
		<div className={styles['message']}>
			<button type='button' onClick={onClose} className={styles['message__close-button']}>
				<XIcon />
			</button>

			<h3 className={styles['message__title']}>
				<FilledInfoIcon />
				<span>{title}</span>
			</h3>

			<p className={styles['message__description']}>{description}</p>

			<div className={styles['message__actions']}>
				<button onClick={onCopy} type='button' className={styles['message__button-copy']}>
					{t('home.alert.button')}
				</button>

				<button onClick={onInfo} type='button' className={styles['message__button-info']}>
					<InfoIcon />
				</button>
			</div>
		</div>
	);
};
