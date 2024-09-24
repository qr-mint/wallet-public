import cn from 'classnames';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useEffect, useState } from 'react';

import { notify } from '@/utils/notify';
import { currencies } from '@/config';
import { useAddressStore } from '@/store/addresses';
import { BackButton } from '@vkruglikov/react-telegram-web-app';
import { Field } from '@/components/field';
import styles from './styles.module.scss';

import SearchIcon from '@/assets/icons/fields/search.svg?react';
import SuccessIcon from '@/assets/icons/fields/success.svg?react';
import { useErrorBoundary } from 'react-error-boundary';

export const Currency = () => {
	const { showBoundary } = useErrorBoundary();
	const navigate = useNavigate();
	const settings = useSettingsStore();
	const { t } = useTranslation();
	const { loadAddresses } = useAddressStore();

	const [ searchValue, setSearchValue ] = useState<string>('');
	const [ isLoading, setIsLoading ] = useState<boolean>(false);

	const handleChangeCurrency = async (currency: any) => {
		if (isLoading) return;
		
		setIsLoading(true);
		settings.setCurrency(currency.id);

		try {
			await loadAddresses();
		} catch (err) {
			showBoundary(err);
		} finally {
			setIsLoading(false);
		}
	};

	const _renderCurrencies = (currencies: any[]) => {
		return currencies
			.filter((currency) => currency.label.toLowerCase().includes(searchValue.toLowerCase()))
			.map((currency, key) => (
				<button
					disabled={isLoading}
					key={key}
					type='button'
					onClick={() => handleChangeCurrency(currency)}
					className={cn(styles['currency'], { [styles['disabled']]: isLoading })}
				>
					<span className={styles['currency__name']}>{currency.label}</span>
					{settings.currency === currency.id && <SuccessIcon />}
				</button>
			));
	};

	useEffect(() => {
		loadAddresses()
			.catch((error) => {
				if (error?.status === 404) {
					notify({ message: error?.response?.data?.error, type: 'error' });
				} else {
					showBoundary(error);
				}
			});
	}, [ loadAddresses, showBoundary ]);

	return (
		<div className={styles['wrapper']}>
			<BackButton onClick={() => navigate('/settings')} />

			<Field
				icon={<SearchIcon />}
				value={searchValue}
				onChange={({ target: { value } }) => setSearchValue(value)}
				placeholder={t('settings.currencies.search.placeholder')}
			/>

			<div className={styles['currencies']}>{_renderCurrencies(currencies)}</div>
		</div>
	);
};
