import cn from 'classnames';
import { useForm } from 'react-hook-form';
import { createRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Controller } from 'react-hook-form';
import { BackButton } from '@vkruglikov/react-telegram-web-app';
import type { FunctionComponent } from 'react';

import { useImporter } from '@/providers/importer';
import { FooterButton } from '@/components/footer-button';
import styles from './styles.module.scss';
import { useNotifyError } from '@/hooks/useNotifyError.ts';

interface IForm {
	mnemonic: string;
}

export const ImportSeedPhrase: FunctionComponent = () => {
	const importer = useImporter();
	const navigate = useNavigate();
	const { t } = useTranslation();
	const {
		parse: parseError,
	} = useNotifyError();
	const {
		handleSubmit,
		control,
		formState: { errors, isSubmitting, isValid },
	} = useForm<IForm>({
		mode: 'onChange',
	});

	const formRef = createRef<HTMLFormElement>();

	const handleImport = async ({ mnemonic }: IForm) => {
		try {
			const isValid = await importer.verifyMnemonic(mnemonic);

			importer.setWords(mnemonic);
			
			if (isValid) {
				navigate('/add-addresses/pin-code');
			} else {
				navigate('/add-addresses/name');
			}
		} catch (error) {
			parseError(error);
		}
	};

	return (
		<div className={styles['seed-phrase']}>
			<BackButton onClick={() => navigate('/')} />

			<h1 className={styles['seed-phrase__title']}>{t('auth.import.title')}</h1>

			<form ref={formRef} onSubmit={handleSubmit(handleImport)}>
				<div className={cn(styles['field'], { field__invalid: !errors.mnemonic })}>
					<div className={styles['field__label']}>
						<span>{t('auth.import.enter')}</span>
					</div>
					<Controller
						render={({ field }) => <textarea className={styles['field__input']} {...field} />}
						control={control}
						name='mnemonic'
						defaultValue={importer.words}
						rules={{
							validate: {
								require: (val: string) => {
									return importer.validateWords(val);
								},
							},
						}}
					/>

					{errors.mnemonic && errors.mnemonic.message && (
						<div className={styles['field__feedback']}>{t(errors.mnemonic.message)}</div>
					)}
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
