import React, { LegacyRef, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useIMask } from 'react-imask';
import type { MaskedNumberOptions } from 'imask';
import cn from 'classnames';
import { get } from 'lodash';
import { useErrorBoundary } from 'react-error-boundary';

import { BackButton } from '@vkruglikov/react-telegram-web-app';
import { Button } from '@/components/button';
import { UiTooltip, UiImage } from '@/components';
import { useAddressStore } from '@/store/addresses';
import styles from './index.module.scss';
import { Coin } from '@/store/addresses/types';
import { ExchangeLimitResponse } from '@/types';
import { cryptoToFiat } from '@/api/estimate';
import ExchangeIcon from '@/assets/icons/fields/exchange.svg?react';
import { ExchangeApi } from '@/api';
import { useSwapStore } from '@/store/swap';
import { SwapRoutes } from '@/constants';

export const SwapPage = () => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const { t } = useTranslation();
	const { showBoundary } = useErrorBoundary();

	const coins = useAddressStore(state => state.coins);
	const fetchCoins = useAddressStore(state => state.fetchCoins);

	const setStoreFromValue = useSwapStore(state => state.setFromValue);
	const setStoreToValue = useSwapStore(state => state.setToValue);
	const resetStore = useSwapStore(state => state.resetStore);

	// Сохраненные токены в сторе и их сеттеры
	const storeFromCoin = useSwapStore(state => state.fromCoin);
	const storeToCoin = useSwapStore(state => state.toCoin);
	const setStoreFromCoin = useSwapStore(state => state.setFromCoin);
	const setStoreToCoin = useSwapStore(state => state.setToCoin);

	// Сохраненные токены в компоненте
	const [ componentFromCoin, setComponentFromCoin ] = useState<Coin | null>(null);
	const [ componentToCoin, setComponentToCoin ] = useState<Coin | null>(null);

	// Состояние видимость дропдаунов для выбора
	const [ fromTippyVisible, setFromTippyVisible ] = useState<boolean>(false);
	const [ toTippyVisible, setToTippyVisible ] = useState<boolean>(false);

	// Лимиты для пары
	const [ limits, setLimits ] = useState<ExchangeLimitResponse | null>(null);

	// Конвертация fromValue в USD
	const [ convertedFromValue, setConvertedFromValue ] = useState<string>('');

	// Конвертация fromValue в to Tокен
	const [ convertedToValue, setConvertedToValue ] = useState<string>('');

	// Доступные токены для замены блок сверху
	const fromAvailableCoins = useMemo<Coin[]>(() => {
		return coins.filter(coin => coin.id !== componentFromCoin?.id && coin.isVisible);
	}, [ coins, componentFromCoin ]);

	// Доступные токены для замены блок снизу
	const toAvailableCoins = useMemo<Coin[]>(() => {
		return coins.filter(coin => coin.id !== componentToCoin?.id && coin.isVisible);
	}, [ coins, componentToCoin ]);

	const maskOptions = useMemo<MaskedNumberOptions>(() => ({
		mask: Number,
		min: Math.ceil(Number(limits?.min ?? 0)),
		max: Math.min(Number(limits?.max ?? 0), Number(componentFromCoin?.amount ?? 0)),
		radix: '.',
		scale: get(String(componentFromCoin?.amount).split('.'), '1', '').length,
	}), [limits]);


	// Проверка на возмножность обмена
	const isDisabledInputs = useMemo<boolean>(() => {
		return (maskOptions.min ?? 0) > (maskOptions.max ?? 0);
	}, [maskOptions]);

	const {
		ref: inputRef,
		setValue: setInputValue,
		typedValue: typedInputValue,
	} = useIMask(maskOptions, { defaultValue: '' });

	const resetData = (): void => {
		setInputValue('');
		setConvertedFromValue('');
		setConvertedToValue('');
	};

	// Сетит токены при замене
	const updateCoins = (coin: Coin, isFromCoin?: true): void => {
		if (isFromCoin) {
			setComponentFromCoin(coin);
			coin.id === componentToCoin?.id
				&& setComponentToCoin(toAvailableCoins.find(_coin => _coin.id !== coin.id) ?? null);

			setFromTippyVisible(false);
		} else {
			setComponentToCoin(coin);
			coin.id === componentFromCoin?.id
				&& setComponentFromCoin(fromAvailableCoins.find(_coin => _coin.id !== coin.id) ?? null);

			setToTippyVisible(false);
		}
	};
	
	const swapCoins = (): void => {
		setComponentFromCoin(componentToCoin);
		setComponentToCoin(componentFromCoin);
	};

	// Сетит максимальное количество токенов
	const setMax = (): void => {
		if (!isDisabledInputs) {
			setInputValue(String(Math.min(Number(limits?.max ?? 0), Number(componentFromCoin?.amount ?? 0))));
		}
	};

	const handleToSwap = () => {
		setStoreFromCoin(componentFromCoin);
		setStoreToCoin(componentToCoin);
		setStoreFromValue(typedInputValue);
		setStoreToValue(convertedToValue);

		navigate(SwapRoutes.CONFIRM);
	};

	const handleBack = (): void => {
		resetStore();
		navigate('/');
	};

	const fetchExchangeLimits = async (): Promise<void> => {
		if (componentFromCoin && componentToCoin) {
			const response = await ExchangeApi.getExchangeLimits({
				address_coin_id_from: componentFromCoin.id,
				address_coin_id_to: componentToCoin.id
			});

			resetData();
			setLimits(response);
		}
	};

	const fetchRates = async (): Promise<void> => {
		if (typedInputValue && componentFromCoin) {
			const response = await cryptoToFiat({
				network: componentFromCoin.network,
				coin_name: componentFromCoin.name,
				crypto_amount: String(typedInputValue),
			});

			setConvertedFromValue(response.payable_amount.toFixed(2));
		}
	};

	const fetchExchangeAmount = async (): Promise<void> => {
		if (componentFromCoin && componentToCoin && typedInputValue && (typedInputValue >= (maskOptions.min ?? 0))) {
			const response = await ExchangeApi.getExchangeAmount({
				send_amount: typedInputValue,
				address_coin_id_from: componentFromCoin.id,
				address_coin_id_to: componentToCoin.id
			});

			setConvertedToValue(response?.receive_amount ?? '');
		}
	};

	// Подгрузка лимитов на операции
	useEffect(() => {
		fetchRates();
		fetchExchangeAmount();
	}, [typedInputValue]);

	// Подгрузка лимитов на операции
	useEffect(() => {
		fetchExchangeLimits();
	}, [ componentFromCoin, componentToCoin ]);

	useEffect(() => {
		fetchCoins(showBoundary);
	}, []);

	// Установка токенов при первом рендере
	useEffect(() => {
		const currentCoinId = searchParams.get('coinId');

		if (storeFromCoin && storeToCoin) {
			setComponentFromCoin(storeFromCoin);
			setComponentToCoin(storeToCoin);
		} else if (coins.length) {
			let _fromCoin: Coin | null = null;

			if (currentCoinId) {
				_fromCoin = coins
					.filter(coin => coin.isVisible)
					.find(coin => coin.id === Number(currentCoinId)) ?? null;
			} else {
				_fromCoin = coins[0];
			}

			const _toCoin = coins
				.filter(coin => coin.isVisible)
				.find(coin => coin.id !== _fromCoin?.id) ?? null;

			setComponentFromCoin(_fromCoin);
			setComponentToCoin(_toCoin);
		}
	}, [coins]);

	return (
		<div className={styles['page']}>
			<BackButton onClick={handleBack} />

			<div className={styles['swap-wrapper']}>
				<div className={styles['swap']}>
					<div className={styles['swap-header']}>
						<UiTooltip
							visible={fromTippyVisible}
							interactive
							whenVisibleChange={visible => setFromTippyVisible(visible)}
							render={() => {
								if (!fromTippyVisible) {
									return undefined;
								}

								return (
									<div className={styles['tippyContainer']}>
										{fromAvailableCoins.map(coin => (
											<div
												key={coin.id}
												className={styles['swap-header__left']}
												onClick={() => updateCoins(coin, true)}
											>
												<UiImage
													className={styles['swap-header__image']}
													src={coin?.imageSource}
													alt="coin"
													isRemoteImage
												/>

												<div className={styles['swap-header__info']}>
													{coin?.caption}
												</div>
											</div>
										))}
									</div>
								);
							}}
						>
							<div className={styles['swap-header__left']}>
								<UiImage
									className={styles['swap-header__image']}
									src={componentFromCoin?.imageSource}
									alt="coin"
									isRemoteImage
								/>

								<div className={styles['swap-header__info']}>
									{Boolean(componentFromCoin?.caption) && <span>{componentFromCoin?.caption}</span>}
									{Boolean(componentFromCoin?.amount) && <span>{componentFromCoin?.amount}</span>}
								</div>
							</div>
						</UiTooltip>

						<div className={styles['swap-header__button-max']} onClick={setMax}>
							Max
						</div>
					</div>

					<div className={styles['swap-main']}>
						<input
							ref={inputRef as LegacyRef<HTMLInputElement>}
							placeholder="0"
							disabled={isDisabledInputs}
							className={styles['swap-main__field']}
						/>

						<p className={styles['swap-main__conversion']}>
							~ {convertedFromValue || 0} USD
						</p>

						<p className={styles['swap-main__subtitle']}>
							{t('swapSwap')}
						</p>
					</div>
				</div>

				<button
					type='button'
					className={styles['swap-wrapper__button-exchange']}
					onClick={swapCoins}
				>
					<ExchangeIcon />
				</button>

				<div className={cn(styles['swap'], styles['swapBottom'])}>
					<div className={styles['swap-header']}>
						<UiTooltip
							visible={toTippyVisible}
							interactive
							whenVisibleChange={(visible) => setToTippyVisible(visible)}
							render={() => {
								if (!toTippyVisible) {
									return undefined;
								}

								return (
									<div className={styles['tippyContainer']}>
										{toAvailableCoins.map(coin => (
											<div
												key={coin.id}
												className={styles['swap-header__left']}
												onClick={() => updateCoins(coin)}
											>
												<UiImage
													className={styles['swap-header__image']}
													src={coin?.imageSource}
													alt="coin"
													isRemoteImage
												/>

												<div className={styles['swap-header__info']}>
													{coin?.caption}
												</div>
											</div>
										))}
									</div>
								);
							}}
						>
							<div className={styles['swap-header__left']}>
								<UiImage
									className={styles['swap-header__image']}
									src={componentToCoin?.imageSource}
									alt="coin"
									isRemoteImage
								/>

								<div className={styles['swap-header__info']}>
									<span>{componentToCoin?.caption}</span>
								</div>
							</div>
						</UiTooltip>
					</div>

					<div className={styles['swap-main']}>
						<div className={cn(styles['swap-main__field'], styles['toValue'])}>
							{convertedToValue || 0}
						</div>

						<p className={styles['swap-main__subtitle']}>
							{t('swapTo')}
						</p>
					</div>
				</div>
			</div>

			{isDisabledInputs && (
				<p className={styles['errorMessage']}>
					{t('swapError')} {maskOptions.min} {componentFromCoin?.symbol}
				</p>
			)}

			<Button
				className={styles['button']}
				disabled={!componentFromCoin || !componentToCoin || (typedInputValue < (maskOptions.min ?? 0))}
				onClick={handleToSwap}
			>
				{t('confirm')}
			</Button>
		</div>
	);
};
