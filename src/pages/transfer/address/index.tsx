import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef } from 'react';
import { useHapticFeedback, useScanQrPopup } from '@vkruglikov/react-telegram-web-app';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import type { FunctionComponent } from 'react';

import { Controller } from 'react-hook-form';
import { BackButton } from '@vkruglikov/react-telegram-web-app';

import { notify } from '@/utils/notify';
import { useTransfer } from '@/providers/transfer/hooks';
import { useTransactionsStore } from '@/store/transactions';
import type { ITransaction } from '@/types/transaction';

import { Field } from '@/components/field';
import { Loading } from '@/pages/loading';
import { FooterButton } from '@/components/footer-button';
import { RecentAddress } from '@/components/transfer/recent-address';

import styles from './styles.module.scss';
import QRIcon from '@/assets/icons/fields/qr.svg?react';

interface FormValues {
	address: string;
}

export const Address: FunctionComponent = () => {
	const params = useParams<{ network: string }>();
	const transfer = useTransfer();
	const navigate = useNavigate();
	const [vibrate] = useHapticFeedback();
	const [searchParams] = useSearchParams();
	const [ show, close ] = useScanQrPopup();

	const { t } = useTranslation();
	const { fetchTransactions, transactions, loading } = useTransactionsStore();

	const {
		handleSubmit,
		control,
		setValue,
		formState: { errors, isValid, isSubmitting },
	} = useForm<FormValues>({
		mode: 'onChange',
	});

	const formRef = useRef<HTMLFormElement>(null);

	const handleOpenScanner = () => {
		vibrate('medium');

		try {
			show({ text: t('transfer.qr-code') }, (value) => {
				if (!value) return;
				const addressValidation = transfer.validateAddress(value, t);

				if (addressValidation) {
					close();
					notify({ type: 'error', message: addressValidation, position: 'top-right' });
					return;
				}

				setValue('address', value);
				close();
			});
		} catch (error) {
			console.error(error);
			notify({ type: 'error', message: t('transfer.address.qr.error') });
		}
	};

	const handleNavigation = (value: FormValues) => {
		vibrate('medium');

		const addressValidation = transfer.validateAddress(value.address, t);

		if (addressValidation) return notify({ type: 'error', message: addressValidation, position: 'top-right' });

		try {
			navigate(`/transfer/amount/${params.network}?address=${value.address}`);
		} catch (err) {
			const error = err as Error;

			notify({
				type: 'error',
				message: error.message,
			});
		}
	};

	const renderRecentAddresses = (recentAddresses: ITransaction[]) => {
		if (!recentAddresses) return;

		return recentAddresses.map((item, key) => (
			<RecentAddress onClick={() => handleNavigation({ address: item.addressTo })} recentAddress={item} key={key} />
		));
	};

	useEffect(() => {
		fetchTransactions({ address_coin_id: Number(params.network), only_out: true, limit: 10 });
	}, [ fetchTransactions, params.network ]);

	if (loading) {
		return <Loading />;
	}

	return (
		<div className={styles.address}>
			<BackButton
				onClick={() => {
					const prevURL = searchParams.get('prevURL');
					navigate(prevURL || '/transfer/select-coin');
				}}
			/>

			<div className={styles.wrapper}>
				<form ref={formRef} className={styles.field} onSubmit={handleSubmit(handleNavigation)}>
					<Controller
						render={({ field }) => (
							<Field
								placeholder={t('transfer.address.search')}
								buttonIcon={
									<div className={styles['field__after']}>
										<button type='button' onClick={handleOpenScanner} className={styles['field__qr-button']}>
											<QRIcon />
										</button>
									</div>
								}
								{...field}
							/>
						)}
						control={control}
						defaultValue={transfer.address ?? ''}
						name='address'
					/>
					{!isValid && <div className={styles.field__feedback}>{errors.address?.message}</div>}
				</form>

				<div className={styles.header}>
					<p className={styles.header__label}>{t('transfer.address.recent')}</p>
				</div>

				<div className={styles.recentAddresses}>{renderRecentAddresses(transactions)}</div>
			</div>

			<div className={styles.actions}>
				<FooterButton
					text={t('transfer.next')}
					disabled={!isValid || isSubmitting}
					onClick={() => {
						formRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
					}}
				/>
			</div>
		</div>
	);
};
