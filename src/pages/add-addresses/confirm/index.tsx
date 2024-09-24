import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { BackButton } from '@vkruglikov/react-telegram-web-app';

import { notify } from '@/utils/notify';
import { useImporter } from '@/providers/importer';
import { getRandomInt } from '@/utils/random';

import styles from './styles.module.scss';

export function Confirm () {
	const importer = useImporter();
	const navigate = useNavigate();
	const { t } = useTranslation();

	const [ rand, setRand ] = useState(getRandomInt(8));
	const [ randomWords, setRandomWords ] = useState<string[]>([]);

	useEffect(() => {
		const words = importer.shuffleMnemonic();
		setRandomWords(words);
	}, [importer]);

	const handleVerifyWord = (word: string) => {
		if (word === importer.words.split(' ')[rand - 1]) {
			navigate('/add-addresses/name');
		} else {
			notify({
				type: 'error',
				message: t('notify.errors.mnemonic.confirm')
			});
			const words = importer.shuffleMnemonic();
			setRand(getRandomInt(6));
			setRandomWords(words);
		}
	};

	const _renderMnemonic = () => {
		return randomWords.map((word: string) => {
			return (
				<div
					onClick={() => handleVerifyWord(word)}
					key={word}
					className={styles['mnemonics-item']}
				>
					<span>{word}</span>
				</div>
			);
		});
	};

	return (
		<div className={styles['seed-phrase']}>
			<BackButton onClick={() => navigate(-1)} />
			<h1 className={styles['seed-phrase__title']}>{t('auth.confirm.title')}</h1>
			{/* <p className={styles['seed-phrase__subtitle']}>
				{t('auth.confirm.subtitle')}
			</p> */}

			<div className={styles['check-mnemonic']}>
				<p className={styles['check-mnemonic__title']}>
					{t('auth.confirm.select', { position: rand })}
				</p>
				<div className={styles['check-mnemonic__mnemonic']}>
					<span>{rand}</span>
					<span>{t('auth.confirm.rightWord')}</span>
				</div>
			</div>

			<div className={styles['seed-phrase__footer']}>
				<div className={styles['mnemonics']}>{_renderMnemonic()}</div>
			</div>
		</div>
	);
}
