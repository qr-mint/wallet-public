import cn from 'classnames';
import { useForm } from 'react-hook-form';
import { createRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Controller } from 'react-hook-form';
import { BackButton } from '@vkruglikov/react-telegram-web-app';
import type { FunctionComponent } from 'react';

import { notify } from '@/utils/notify';
import { useErrorBoundary } from 'react-error-boundary';
import { useImporter } from '@/providers/importer';
import { FooterButton } from '@/components/footer-button';
import styles from './styles.module.scss';
import { AxiosError } from 'axios';

interface IForm {
	name: string;
}

export const Name: FunctionComponent = () => {
	const importer = useImporter();
	const navigate = useNavigate();
	const { t } = useTranslation();
	const { showBoundary } = useErrorBoundary();
	const {
		control,
		handleSubmit,
		formState: { errors, isValid, isSubmitting },
	} = useForm<IForm>();

	const formRef = createRef<HTMLFormElement>();

	const next = async ({ name }: IForm) => {
		importer.setName(name);

		try {
			if (!importer.words) {
				const words = await importer.generateMnemonic();
				
				if (words) {
					importer.setWords(words);
				}
			}
			navigate('/add-addresses/pin-code');
		} catch (e) {
			const error = e as AxiosError;

			if (error?.status === 404) {
				notify({ message: error?.response?.data?.error, type: 'error' });
			} else {
				showBoundary(error);
			}
		}
	};

	return (
		<div className={styles.container}>
			<BackButton onClick={() => navigate('/import')} />

			<h1 className={styles['name__title']}>{t('auth.name.title')}</h1>

			<form ref={formRef} onSubmit={handleSubmit(next)}>
				<div className={cn(styles['field'], { field__invalid: !errors.name })}>
					<div className={styles['field__label']}>
						<span>{t('auth.name.enter')}</span>
					</div>

					<Controller
						render={({ field }) => (
							<div className={styles['field__center']}>
								<input max={36} type='text' className={styles['field__input']} {...field} />
							</div>
						)}
						control={control}
						defaultValue={importer.name}
						name='name'
						rules={{
							maxLength: 20,
							validate: {
								require: (val: string) => {
									if (!val) {
										return t('addAddress.name.required');
									}
									//return await auth.validateAddress(val);
								},
							},
						}}
					/>
				</div>
			</form>

			<FooterButton
				text={t('auth.next')}
				disabled={!isValid || isSubmitting}
				onClick={() => {
					if (formRef.current) {
						formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
					}
				}}
			/>
		</div>
	);
};
