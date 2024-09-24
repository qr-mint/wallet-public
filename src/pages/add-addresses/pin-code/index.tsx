import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BackButton } from '@vkruglikov/react-telegram-web-app';
import Confetti from 'react-confetti';

import { PinPad } from '@/components/pin-pad';
import { useImporter } from '@/providers/importer';
import { FooterButton } from '@/components/footer-button';
import styles from './styles.module.scss';
import { colors, Loading } from '@/components/loading';
import ErrorIcon from '@/assets/icons/error.svg?react';
import { Button } from '@/components/button';
import { useAuthStore } from '@/store/auth/useAuthStore';
import { useErrorBoundary } from 'react-error-boundary';
import SuccessIcon from '@/assets/icons/success-circled.svg?react';
import { notify } from '@/utils/notify.ts';

enum states {
	locked = 'locked',
	loading = 'loading',
	success = 'success',
	failed = 'failed',
}

export const PinCode = () => {
	const auth = useImporter();
	const appState = useAuthStore();
	const { t } = useTranslation();
	const { showBoundary } = useErrorBoundary();

	const [ state, setState ] = useState(states.locked);
	const navigate = useNavigate();

	const [ code, setCode ] = useState('');

	const handleChange = async (value: string, wrong: (error: string) => void) => {
		if (value.length !== 4) return;
		else if (!code) {
			return setCode(value);
		} else if (code === value) {
			setCode(code);
			setState(states.loading);
		} else {
			wrong(t('pincode.notify.wrongPincode'));
		}
	};

	const [ isRunConnect, setIsRunConnect ] = useState(false);

	let connectTimeoutId: number | null = null;

	// Следим за state, если лоадинг + есть код, значит нужно создать кошелек
	useEffect(() => {
		if (state !== states.loading || !code || isRunConnect) {
			return;
		}
		const runConnect = async (): Promise<void> => {
			if (isRunConnect) {
				return;
			}

			setIsRunConnect(true);
			try {
				await auth.connect(code);
				setState(states.success);
			} catch (error) {
				if (error?.status === 404) {
					notify({ message: error?.response?.data?.error, type: 'error' });
				} else {
					showBoundary(error);
				}
				setState(states.failed);
			} finally {
				setIsRunConnect(false);
			}
		};

		// Уводим в очередь что бы дать перерисовать лоадер
		connectTimeoutId = setTimeout(() => {
			runConnect();
		}, 100) as unknown as number;

		return () => {
			if (connectTimeoutId) {
				clearTimeout(connectTimeoutId);
			}
		};

	}, [ state, code ]);

	const _renderPinCode = (code: string) => {
		if (code) {
			return <PinPad key='repeat' onChange={handleChange} title={t('pincode.repeat.title')} />;
		}
		return <PinPad key='create' onChange={handleChange} title={t('pincode.create.title')} />;
	};

	const _renderImage = (state: states) => {
		if (state === states.loading) {
			return <Loading className={styles.loader} />;
		} else if (state === states.failed) {
			return <ErrorIcon />;
		} else {
			return <SuccessIcon />;
		}
	};

	if (state === states.locked) {
		return (
			<div className={styles['wrapper']}>
				<BackButton onClick={() => navigate('/add-addresses/name')} />

				{_renderPinCode(code)}
			</div>
		);
	}

	return (
		<div className={styles['container']}>
			{state === states.success && <Confetti width={window.screen.width} height={window.screen.height} />}

			<div className={styles['container__user']}>{_renderImage(state)}</div>

			<h1 className={styles['container__title']}>
				{states.loading === state ? t('auth.success.creating') : t('auth.success.title')}
			</h1>

			{state === states.loading && (
				<div className={styles['inner']}>
					<Loading color={colors.blue}></Loading>
				</div>
			)}

			<div className={styles['navigation']}>
				<Button
					disabled={states.loading === state}
					onClick={() => navigate('/')}
					className={styles['navigation__button']}
				>
					{t('auth.success.home')}
				</Button>
			</div>
		</div>
	);
};
