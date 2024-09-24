import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

import styles from './index.module.scss';
import { useSwapStore } from '@/store/swap';
import { UiImage } from '@/components';
import { Button } from '@/components/button';
import { SwapRoutes } from '@/constants';
import { ExchangeApi } from '@/api';
import ArrowRightIcon from '@/assets/icons/arrow-right.svg?react';
import { formatAddress } from '@/helpers/addressFormatter.ts';
import { notify } from '@/utils/notify.ts';
import { buildTransfer } from '@/api/transfer/build_transfer.ts';
import { transfer } from '@/api/transfer/transfer.ts';
import { BackButton } from '@vkruglikov/react-telegram-web-app';
import { PinPad } from '@/components/pin-pad';
import networks from '@/crypto/networks';
import { CryptoMnemonic } from '@/crypto/mnemonic.ts';

export const SwapConfirmPage = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();

	// Выбранные токены
	const fromCoin = useSwapStore(state => state.fromCoin);
	const toCoin = useSwapStore(state => state.toCoin);
	// Количество from токенов для обмена
	const fromValue = useSwapStore(state => state.fromValue);
	// Количество to токенов для обмена
	const toValue = useSwapStore(state => state.toValue);

	const [ pinVisible, setPinVisible ] = useState<boolean>(false);

	const fetchExchangeAddress = async (): Promise<string> => {
		if (fromCoin && toCoin) {
			const response = await ExchangeApi.getExchangeAddress({
				amount: fromValue,
				address_coin_id_from: fromCoin.id,
				address_coin_id_to: toCoin.id
			});

			return response?.pay_in_address ?? '';
		}

		return '';
	};

	const handleSwap = async (code: string): Promise<void> => {
		const crypto = networks[fromCoin?.network as 'trc20' | 'ton'];
		
		let seed: string = '';
		
		try {
			seed = await new CryptoMnemonic().loadMnemonic(code);
		} catch {
			notify({
				type: 'error',
				message: t('swapWrongPin'),
				position: 'top-right',
			});

			setPinVisible(false);
			return;
		}
		
		const keys = await crypto.getAccount(seed);

		let signerMessages: null = null;

		try {
			const response = await fetchExchangeAddress();

			signerMessages = await buildTransfer({
				coin_name: fromCoin?.name ?? '',
				network: fromCoin?.network ?? '',
				address_to: response,
				amount: fromValue,
				version: fromCoin?.network === 'ton' ? 42 : undefined,
				public_key: fromCoin?.network === 'ton' ? keys.public.toString('hex') : undefined,
			});
		} catch {
			notify({
				type: 'error',
				message: t('swapMessageError'),
				position: 'top-right',
			});

			setPinVisible(false);
			return;
		}

		await crypto.sign(signerMessages, keys.private);

		try {
			if (signerMessages && fromCoin) {
				await transfer({
					message: signerMessages,
					network: fromCoin.network,
					coin_name: fromCoin.name,
					amount: fromValue
				});

				navigate(SwapRoutes.SUCCESS);
			}
		} catch {
			notify({
				type: 'error',
				message: t('swapMessageTransfer'),
				position: 'top-right',
			});
		} finally {
			setPinVisible(false);
		}
	};

	if (pinVisible) {
		return (
			<div className={styles['wrapper']}>
				<BackButton onClick={() => setPinVisible(false)} />
				<PinPad onChange={handleSwap} title={t('pincode.cheque.title')} />
			</div>
		);
	}

	return (
		<div className={styles['wrapper']}>
			<div className={styles['coins']}>
				<div className={styles['coins__item']}>
					<div className={styles['coins__image']}>
						<UiImage
							className={styles['swap-header__image']}
							src={fromCoin?.imageSource}
							alt="coin"
							isRemoteImage
						/>
					</div>

					<p className={styles['coins__title']}>
						{t('swapSwap')}
					</p>
					<p className={styles['coins__amount']}>
						{fromValue}
					</p>
				</div>

				<div className={styles['coins__icon']}>
					<ArrowRightIcon />
				</div>

				<div className={styles['coins__item']}>
					<div className={styles['coins__image']}>
						<UiImage
							className={styles['swap-header__image']}
							src={toCoin?.imageSource}
							alt="coin"
							isRemoteImage
						/>
					</div>

					<p className={styles['coins__title']}>
						{t('swapTo')}
					</p>
					<p className={styles['coins__amount']}>
						{toValue || 0}
					</p>
				</div>
			</div>

			<div className={styles['information']}>
				<div className={styles['information-row']}>
					<span className={styles['information-row__title']}>
						{t('swapFrom')}
					</span>
					<span className={styles['information-row__value']}>
						{formatAddress(fromCoin?.address ?? '')}
					</span>
				</div>

				<div className={styles['information-row']}>
					<span className={styles['information-row__title']}>
						{t('swapTo')}
					</span>
					<span className={styles['information-row__value']}>
						{formatAddress(toCoin?.address ?? '')}
					</span>
				</div>
			</div>

			<div className={styles['actions']}>
				<Button
					theme='secondary'
					className={styles['actions__item']}
					onClick={() => navigate(SwapRoutes.SWAP())}
				>
					{t('swapChange')}
				</Button>

				<Button
					className={styles['actions__item']}
					onClick={() => setPinVisible(true)}
				>
					{t('confirm')}
				</Button>
			</div>
		</div>
	);
};
