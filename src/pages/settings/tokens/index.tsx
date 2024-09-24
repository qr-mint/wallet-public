import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useErrorBoundary } from 'react-error-boundary';
import { BackButton } from '@vkruglikov/react-telegram-web-app';

import { useAddressStore } from '@/store/addresses';
import { Token } from '@/components/settings/token';
import { Field } from '@/components/field';
import styles from './styles.module.scss';
import SearchIcon from '@/assets/icons/fields/search.svg?react';
import type { Coin } from '@/store/addresses/types';

export const Tokens = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const { showBoundary } = useErrorBoundary();
	const { coins, fetchCoins, switchCoin } = useAddressStore();

	const [ isLoading, setIsLoading ] = useState<boolean>(false);
	const [ searchValue, setSearchValue ] = useState<string>('');

	const _renderCoins = (coins: Coin[]) => {
		const filteredCoins = coins.filter(
			(coin) =>
				coin.name.toLowerCase().includes(searchValue.toLowerCase()) ||
				coin.symbol.toLowerCase().includes(searchValue.toLowerCase()),
		);

		return filteredCoins.map((coin) => {
			return (
				<Token
					key={coin.id}
					checked={coin.isVisible ?? false}
					disabled={isLoading}
					onSwitch={(visible) => {
						setIsLoading(true);
						switchCoin({ network: coin.network, visible: visible, id: coin.id }).finally(() => {
							setIsLoading(false);
							fetchCoins(showBoundary);
						});
					}}
					token={{
						imageSource: coin.imageSource,
						caption: coin.caption,
						symbol: coin.symbol,
					}}
				/>
			);
		});
	};

	useEffect(() => {
		fetchCoins(showBoundary);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className={styles['wrapper']}>
			<BackButton onClick={() => navigate('/settings')} />

			<Field
				placeholder={t('settings.tokens.search')}
				onChange={({ target: { value } }) => setSearchValue(value)}
				icon={<SearchIcon />}
				value={searchValue}
			/>

			<div className={styles['tokens']}>{_renderCoins(coins)}</div>
		</div>
	);
};
