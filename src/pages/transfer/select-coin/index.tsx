import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BackButton } from '@vkruglikov/react-telegram-web-app';

import { useTransfer } from '@/providers/transfer/hooks';
import { Field } from '@/components/field';
import { TokenSkeleton } from '@/components/home/token-list';
import styles from './styles.module.scss';
import SearchIcon from '@/assets/icons/fields/search.svg?react';
import type { Coin } from '@/store/addresses/types';

export function SelectCoin () {
	const transfer = useTransfer();
	const navigate = useNavigate();
	const { t } = useTranslation();

	const [ search, setSearch ] = useState('');

	const _renderAllowCoins = (tokens: Coin[]) => {
		if (!tokens.length) {
			return <TokenSkeleton count={6} />;
		}

		const filteredCoins = tokens.filter(
			(token) =>
				token.name.toLowerCase().includes(search.toLowerCase()) ||
				token.symbol.toLowerCase().includes(search.toLowerCase()),
		);

		return filteredCoins.map((coin, key) => (
			<div key={key} onClick={() => navigate(`/transfer/address/${coin.id}`)} className={styles['token']}>
				<img src={`${process.env.API_URL}/${coin.imageSource}`} alt='' className={styles['token__image']} />
				<p className={styles['token__name']}>{coin.name}</p>
				<p className={styles['token__symbol']}>{coin.symbol}</p>
			</div>
		));
	};

	return (
		<div className={styles['wrapper']}>
			<BackButton onClick={() => navigate('/')} />

			<Field
				icon={<SearchIcon />}
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				placeholder={t('transfer.selectNetwork.search')}
			/>

			<div className={styles['header']}>
				<p className={styles['header__label']}>{t('transfer.selectNetwork.allow')}</p>
			</div>

			<div className={styles['tokens']}>{_renderAllowCoins(transfer.tokens)}</div>
		</div>
	);
}
