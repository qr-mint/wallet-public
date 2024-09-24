import Confetti from 'react-confetti';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { BackButton, useHapticFeedback } from '@vkruglikov/react-telegram-web-app';

import { useTransfer } from '@/providers/transfer/hooks';
import { formatAddress } from '@/helpers/addressFormatter';
import { PinPad } from '@/components/pin-pad';
import { Button } from '@/components/button';
import { colors, Loading } from '@/components/loading';
import Copy from '@/assets/icons/copy.svg?react';
import styles from './styles.module.scss';

import SuccessIcon from '@/assets/icons/success-circled.svg?react';
import ErrorIcon from '@/assets/icons/error.svg?react';
import { copyToClipboard } from '@/utils/copyToClipboard.ts';
import { notify } from '@/utils/notify.ts';

enum states {
    locked = 'locked',
    loading = 'loading',
    success = 'success',
    failed = 'failed',
}

type WrongFn = (err: string) => void;

export const PinCode = () => {
	const [impactOccurred] = useHapticFeedback();

	const [ hash, setHash ] = useState<string>('');
	const [ value, setValue ] = useState<string>('');
	const { t } = useTranslation();
	const navigate = useNavigate();
	const transfer = useTransfer();

	const [ state, setState ] = useState(states.locked);
	let lastWrong: null | WrongFn = null;

	const _renderIcon = () => {
		if (state === states.loading) {
			return <Loading className={styles.loader} color={colors.blue}/>;
		}
		if (state === states.success) {
			return <SuccessIcon/>;
		}
		return <ErrorIcon/>;
	};

	const handleCopy = (hash: string) => {
		copyToClipboard(hash)
			.then(() => {
				notify({ message: t('notify.success.hash.copy'), type: 'success' });
			});
	};

	const handleSend = async (value: string, wrong: WrongFn) => {
		lastWrong = wrong;
		setState(states.loading);
		setValue(value);
	};

	const [ isProcessSend, setIsProcessSend ] = useState(false);

	let sendTimeoutId: number | null = null;
	// Если стейт лоадинг, нужно выполнить транзакцию
	useEffect(() => {
		if (state !== states.loading || isProcessSend) {
			return;
		}

		const send = async () => {
			if (isProcessSend) {
				return;
			}
			try {
				setIsProcessSend(true);
				const hash = await transfer.send(value);
				setHash(hash);
				setState(states.success);
				impactOccurred('medium');
			} catch (err) {
				setState(states.failed);

				if (lastWrong) {
					lastWrong(t('pincode.notify.wrongPincode'));
					return;
				}

				notify({
					type: 'error',
					message: t('pincode.notify.badTransfer'),
					position: 'top-right',
				});
			} finally {
				setIsProcessSend(false);
			}
		};

		sendTimeoutId = setTimeout(() => {
			send();
		}, 50) as unknown as number;

		return () => {
			if (sendTimeoutId) {
				clearTimeout(sendTimeoutId);
			}
		};


	}, [ state, value ]);

	if (state === states.locked) {
		return (
			<div className={styles['wrapper']}>
				<BackButton onClick={() => navigate(-1)} />
				<PinPad onChange={handleSend} title={t('pincode.cheque.title')} />
			</div>
		);
	}
	return (
		<div className={styles['container']}>
			{state === states.success && <Confetti width={window.screen.width} height={window.screen.height} />}
			<div className={styles['success__icon']}>{_renderIcon()}</div>
			<h1 className={styles['success__title']}>{transfer.getAmountLabel()}</h1>
			<p className={styles['success__subtitle']}>
				{t('to')} <span> {formatAddress(transfer.address)}</span>
			</p>
			{hash && <div className={styles['container__hash']}>
				<div onClick={() => handleCopy(hash)} className={styles.copy}>
					<Copy/>
				</div>

				<div>
					{formatAddress(hash)}
				</div>
			</div>}
			<div className={styles['actions']}>
				<Button onClick={() => navigate('/')}>{t('transfer.success.home')}</Button>
			</div>
		</div>
	);
};
