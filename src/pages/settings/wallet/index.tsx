import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BackButton } from '@vkruglikov/react-telegram-web-app';

import { useAuthStore } from '@/store/auth/useAuthStore';
import { useAddressStore } from '@/store/addresses';
import styles from './styles.module.scss';
import { Controller, useForm } from 'react-hook-form';
import { createRef, useEffect } from 'react';
import { FooterButton } from '@/components/footer-button';
import { notify } from '@/utils/notify';
import { useNotifyError } from '@/hooks/useNotifyError.ts';

export const Wallet = () => {
	const { t } = useTranslation();
	const {
		parse: parseError,
	} = useNotifyError();
	const {
		handleSubmit,
		control,
		setValue,
		formState: { errors, isValid , isSubmitting },
	} = useForm<{ name: string }>({
		mode: 'onChange',
	});
	const auth = useAuthStore();
	const wallet = useAddressStore();
	const navigate = useNavigate();

	const formRef = createRef<HTMLFormElement>();


	useEffect(() => {
		if (wallet.name) {
			setValue('name', wallet.name);
		}
	}, [wallet.name]);

	const onSubmit = async ({ name }: any) => {
		try {
			await wallet.updateName(name);
			notify({
				type: 'success',
				message: t('settings.wallet.name'),
				position: 'top-right'
			});
		} catch (error: unknown) {
			parseError(error);
		}
	};

	return (
		<div className={styles['wrapper']}>
			<BackButton onClick={() => navigate('/settings')} />

			<div className={styles['profile']}>
				<div className={styles['profile__image']}>
					<img src={auth.user?.image_source || ''} alt='' />
				</div>
			</div>

			<form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
				<div className={styles['field']}>
					<p className={styles['field__label']}>{t('settings.wallet.name')}</p>
					<Controller
						render={({ field }) => (
							<input disabled={isSubmitting} type='text' className={styles['field__input']} placeholder='Wallet Name' {...field} />
						)}
						control={control}
						name='name'
						rules={{
							required: true,
							maxLength: 20
						}}
					/>
				</div>
			</form>

			<FooterButton
				text='Update'
				disabled={!isValid || isSubmitting}
				onClick={() => {
					formRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
				}}
			/>
		</div>
	);
};
