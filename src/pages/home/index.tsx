import classNames from 'classnames';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useErrorBoundary } from 'react-error-boundary';
import { useHapticFeedback } from '@vkruglikov/react-telegram-web-app';
import { useEffect, useState } from 'react';
import type { FunctionComponent } from 'react';

import { Link } from 'react-router-dom';

import { symbols } from '@/helpers/fiatCurrencySymbols';
import { useAuthStore } from '@/store/auth/useAuthStore';
import { useFetchNfts } from '@/hooks/requests/useFetchNfts';
import { useFetchAddress } from '@/hooks/requests/useFetchAddress';
import { useSettingsStore } from '@/store/useSettingsStore';
import { numberWithCommas } from '@/helpers/numberFormatter';
import { useTransactionsStore } from '@/store/transactions';

import { Alert } from '@/components/home/alert';
import { Navbar } from '@/components/navbar';
import { Wallet } from '@/components/home/wallet';
import { NFTList } from '@/components/home/nft-list';
import { TokenList } from '@/components/home/token-list';
import { Navigation } from '@/components/home/navigation';
import { TransactionList } from '@/components/home/transaction-list';

import styles from './styles.module.scss';
import CogIcon from '@/assets/icons/wallet/cog.svg?react';

export const Home: FunctionComponent = () => {
	const nft = useFetchNfts();
	const address = useFetchAddress();
	const navigate = useNavigate();
	const location = useLocation();
	const [impactOccurred] = useHapticFeedback();

	const { t } = useTranslation();
	const { fetchProfile } = useAuthStore();
	const { showBoundary } = useErrorBoundary();
	const { setAlert, alert } = useSettingsStore();
	const { fetchTransactions, fetchNextTransactions, ...transactions } = useTransactionsStore();

	const isNftScreen = location.state?.navigation && location.state.navigation === 'nfts';
	const [ integerAmount, amountDecimal ] = numberWithCommas(address.data.fiatAmount, 2).split('.');

	const [ navigation, setNavigation ] = useState<string>(isNftScreen ? t('home.tab.nfts') : t('home.tab.tokens'));

	const handleOpenConfirm = () => {
		const confirmTitle = t('home.confirm.title');

		const callback = (ok: boolean) => {
			if (ok) setAlert(false);
		};

		try {
			window.Telegram.WebApp.showConfirm(confirmTitle, callback);
		} catch {
			const ok = window.confirm(confirmTitle);
			callback(ok);
		}
	};

	useEffect(() => {
		address.fetchAddresses();
		fetchProfile();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const scrollHandler = async () => {
			const isScrollNearBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 100;

			if (!transactions.loading && isScrollNearBottom) {
				await fetchNextTransactions();
			}
		};

		window.addEventListener('scroll', scrollHandler);

		return () => {
			window.removeEventListener('scroll', scrollHandler);
		};
	}, [ transactions.loading, fetchNextTransactions ]);

	useEffect(() => {
		// eslint-disable-next-line no-undef
		let timerID: NodeJS.Timeout;

		if (navigation === t('home.tab.transactions')) {
			timerID = setTimeout(() => {
				fetchTransactions({}, showBoundary);
			}, 300);
		}

		if (navigation === t('home.tab.nfts')) {
			nft.fetchNfts();
		}

		return () => {
			clearTimeout(timerID);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [navigation]);

	return (
		<div className={styles['wrapper']}>
			<Wallet className={classNames(styles['wallet'], { [styles['fetching']]: address.state.fetching })}>
				<div className={styles['wallet-main']}>
					<div className={styles['wallet-main__name']}>{address.data.name}</div>

					<Link to='/settings' onClick={() => impactOccurred('medium')} className={styles['wallet-main__button']}>
						<CogIcon />
					</Link>

					<div className={styles['wallet-main__amount']}>
						<span className={styles['wallet-main__amount-big']}>
							{symbols[address.data.fiatCurrency.toUpperCase()]}
							{integerAmount}.
						</span>
						<span className={styles['wallet-main__amount-small']}>{amountDecimal}</span>
					</div>
				</div>
			</Wallet>

			{alert && (
				<Alert
					onClose={handleOpenConfirm}
					title={t('home.alert.title')}
					description={t('home.alert.description')}
					onInfo={() => {
						impactOccurred('medium');
						navigate('/about-mnemonic');
					}}
					onCopy={() => {
						impactOccurred('medium');
						navigate('/settings/seed-phrase');
					}}
				/>
			)}

			<Navigation
				className={styles['navigation']}
				selectedScreen={navigation}
				onSelect={(navigation) => {
					impactOccurred('medium');
					setNavigation(navigation);
				}}
				screens={[
					{
						name: t('home.tab.tokens'),
						component: <TokenList loading={address.state.loading} tokenList={address.data.tokens} />,
					},
					{
						name: t('home.tab.nfts'),
						component: <NFTList nftList={nft.data} loading={nft.isLoading} />,
					},
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

			<Navbar/>
		</div>
	);
};
