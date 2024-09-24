import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAddressStore } from '@/store/addresses';
import { useTranslation } from 'react-i18next';

import { Field } from '@/components/field';
import { Token } from '@/components/settings/token';
import { BackButton } from '@vkruglikov/react-telegram-web-app';
import SearchIcon from '@/assets/icons/fields/search.svg?react';
import styles from './page.module.scss';
import { methods } from '../const';
import { useErrorBoundary } from 'react-error-boundary';
import { Coin } from '@/store/addresses/types';

export const SelectNetwork = () => {
	const params = useParams();
	const navigate = useNavigate();
	
	const { t } = useTranslation();
	const { showBoundary } = useErrorBoundary();
	const { coins, fetchCoins } = useAddressStore();

	const [ searchValue, setSearchValue ] = useState<string>('');
	const method = methods.find((method) => method.key === params.methodName);

	useEffect(() => {
		if (!method) {
			showBoundary({ message: 'Method was not found!', status: 404 });
		}
	}, [ params, navigate, method, showBoundary ]);

	const handleNext = (token: any) => {
		if (method?.widget) {
			navigate(`/payments/${params.methodName}/${token.id}?source=${encodeURIComponent(method.widget)}`);
		} else {
			navigate(`/payments/amount/${params.methodName}/${token.id}`);
		}
	};
	

	useEffect(() => {
		fetchCoins(showBoundary);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ ]);

	const _renderTokens = (coins: Coin[]) => {
		return coins
			.filter((coin) => coin.isVisible && coin.name.toLowerCase().includes(searchValue.toLowerCase()))
			.map((token, key) => (
				<Token
					key={key}
					onClick={() => handleNext(token)}
					token={{
						imageSource: token.imageSource,
						caption: token.name,
						symbol: token.network.replace('_', ' '),
					}}
				/>
			));
	};
	
	return (
		<div className={styles['wrapper']}>
			<BackButton onClick={() => navigate('/payments/select')} />

			<Field
				placeholder={t('receiver.selectNetwork.search')}
				onChange={(e) => setSearchValue(e.target.value)}
				icon={<SearchIcon/>}
				value={searchValue}
			/>

			<div className={styles['header']}>
				<p className={styles['header__label']}>{t('transfer.selectNetwork.allow')}</p>
			</div>

			<div className={styles['tokens']}>{_renderTokens(coins)}</div>
		</div>
	);
};
