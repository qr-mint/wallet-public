import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BackButton } from '@vkruglikov/react-telegram-web-app';

import { notify } from '@/utils/notify';
import { useAccountStore } from '@/store/useAccountStore';
import { copyToClipboard } from '@/utils/copyToClipboard';
import { PinPad } from '@/components/pin-pad';
import styles from './styles.module.scss';

import InfoIcon from '@/assets/icons/info.svg?react';
import CopyIcon from '@/assets/icons/fields/copy.svg?react';

export function SeedPhraseOfSettings () {
	const [ words, setWords ] = useState('');
	const { t } = useTranslation();
	const app = useAccountStore();
	const navigate = useNavigate();

	const handleSend = async (value: string, wrong: (error: string) => void) => {
		if (value.length !== 4) return;
		try {
			const words = await app.unlock(value);
			setWords(words);
		} catch {
			wrong(t('pincode.notify.wrongPincode'));
		}
	};

	const handleCopy = (words: string) => {
		copyToClipboard(words).then(() => {
			notify({ message: t('notify.success.seed-phrase.copy'), type: 'success' });
		});
	};

	if (!words) {
		return (
			<div className={styles['pin-pad-wrapper']}>
				<PinPad onChange={handleSend} title={t('pincode.cheque.title')} />
			</div>
		);
	}

	return (
		<div className={styles['wrapper']}>
			<BackButton onClick={() => navigate(-1)} />

			<div className={styles['field']}>
				<div className={styles['field__header']}>
					<p className={styles['field__label']}>Seed phrase</p>

					<button onClick={() => navigate('/about-mnemonic')} type='button' className={styles['field__button-info']}>
						<InfoIcon />
					</button>
				</div>

				<textarea className={styles['field__textarea']}>{words}</textarea>

				<button className={styles['field__button-copy']} onClick={() => handleCopy(words)}>
					<CopyIcon />
				</button>
			</div>
		</div>
	);
}
