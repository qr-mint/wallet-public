import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useErrorBoundary } from 'react-error-boundary';
import { useEffect, useState } from 'react';
import { BackButton } from '@vkruglikov/react-telegram-web-app';

import { useAddressStore } from '@/store/addresses';
import type { Coin as ICoin } from '@/store/addresses/types';
import { Field } from '@/components/field';
import { Token } from '@/components/settings/token';
import styles from './styles.module.scss';
import SearchIcon from '@/assets/icons/fields/search.svg?react';
import { TokenSkeleton } from '@/components/home/token-list';

export const SelectNetwork = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const { showBoundary } = useErrorBoundary();
	const { coins, fetchCoins } = useAddressStore();

	const [ searchValue, setSearchValue ] = useState<string>('');

	useEffect(() => {
		fetchCoins(showBoundary);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const _renderTokens = (coins: ICoin[]) => {
		if (!coins.length) return <TokenSkeleton count={6} />;

		const filteredCoins = coins.filter(
			(coin) =>
				(coin.name.toLowerCase().includes(searchValue.toLowerCase()) ||
					coin.symbol.toLowerCase().includes(searchValue.toLowerCase())) &&
				coin.isVisible,
		);

		return filteredCoins.map((token, key) => (
			<Token
				key={key}
				onClick={() => navigate(`/receiver/${token.id}`)}
				token={{
					imageSource: token.imageSource,
					caption: token.name,
					symbol: token.symbol.replace('_', ' '),
				}}
			/>
		));
	};

	return (
		<div className={styles['wrapper']}>
			<BackButton onClick={() => navigate('/')} />

			<Field
				placeholder={t('receiver.selectNetwork.search')}
				onChange={(e) => setSearchValue(e.target.value)}
				icon={<SearchIcon />}
				value={searchValue}
			/>

			<div className={styles['header']}>
				<p className={styles['header__label']}>{t('transfer.selectNetwork.allow')}</p>
			</div>

			<div className={styles['tokens']}>{_renderTokens(coins)}</div>
		</div>
	);
};
