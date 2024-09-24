import { useTranslation } from 'react-i18next';
import { useErrorBoundary } from 'react-error-boundary';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';

import { BackButton } from '@vkruglikov/react-telegram-web-app';
import type { FunctionComponent } from 'react';

import { notify } from '@/utils/notify';
import { useTokenInfo } from '@/store/token';
import { useTransactionsStore } from '@/store/transactions';

import { Wallet } from '@/components/home/wallet';
import { Loading } from '@/pages/loading';
import { Navigation } from '@/components/home/navigation';
import { TransactionList } from '@/components/home/transaction-list';
import styles from './styles.module.scss';
import { AxiosError } from 'axios';
import { TokenInfo } from '@/store/token/types.ts';
import { Token } from '@/store/addresses/types';

export const DetailedToken: FunctionComponent = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const { token } = useParams();
	const { showBoundary } = useErrorBoundary();
	const { tokenInfo, loadTokenInfo } = useTokenInfo();
	const { fetchTransactions, fetchNextTransactions, ...transactions } = useTransactionsStore();

	const [ isLoading, setIsLoading ] = useState(!tokenInfo.id);

	// Получение информаций о монете
	const fetchWalletInfo = useCallback(async () => {
		if (!token) return;

		try {
			await loadTokenInfo(token);
		} catch (e) {
			const error = e as AxiosError;

			if (error?.status === 404) {
				notify({ message: error.response?.data.error, type: 'error' });
			} else {
				showBoundary(error);
			}
		}

		setIsLoading(false);
	}, [ loadTokenInfo, showBoundary, token ]);

	useEffect(() => {
		fetchWalletInfo();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (tokenInfo.id) {
			fetchTransactions({ address_coin_id: tokenInfo.id });
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tokenInfo.id]);

	useEffect(() => {
		const scrollHandler = async () => {
			const isScrollNearBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 100;

			if (!transactions.loading && isScrollNearBottom) {
				await fetchNextTransactions({ address_coin_id: tokenInfo.id });
			}
		};

		window.addEventListener('scroll', scrollHandler);

		return () => {
			window.removeEventListener('scroll', scrollHandler);
		};
	}, [ transactions.loading, fetchNextTransactions, tokenInfo.id ]);

	if (isLoading) {
		return <Loading />;
	}

	if (!tokenInfo.id || typeof token !== 'string') {
		showBoundary({ message: 'Token or coin was not found!', status: 404 });
	}

	return (
		<div className={styles['wrapper']}>
			<BackButton onClick={() => navigate('/')} />

			<Wallet isDetailed className={styles['wallet']} wallet={tokenInfo as TokenInfo & Token}>
				<div className={styles['wallet-main']}>
					<Link to={tokenInfo.explorerLink} target='_blank' className={styles['wallet-main__link']}>
						See in exploler
					</Link>

					<p className={styles['wallet-main__amount']}>
						{tokenInfo.amount} {tokenInfo.symbol}
					</p>

					<div className={styles['wallet-main__image']}>
						<img src={`${process.env.API_URL}/${tokenInfo.imageSource}`} alt={tokenInfo.caption} />
					</div>
				</div>
			</Wallet>

			<Navigation
				className={styles['navigation']}
				screens={[
					{
						name: t('home.tab.transactions'),
						component: (
							<TransactionList
								noMore={transactions.noMore}
								loading={transactions.loading}
								fetching={transactions.fetching}
								transactionList={transactions.transactions}
							/>
						),
					},
				]}
			/>
		</div>
	);
};
