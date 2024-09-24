import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { languages } from '@/config';
import { useLanguage } from '@/hooks/useLanguage';
import { BackButton } from '@vkruglikov/react-telegram-web-app';
import { Field } from '@/components/field';
import styles from './styles.module.scss';

import SearchIcon from '@/assets/icons/fields/search.svg?react';
import SuccessIcon from '@/assets/icons/fields/success.svg?react';

export const Language = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { selectLanguage, lang } = useLanguage();
	const [ searchValue, setSearchValue ] = useState<string>('');

	const _renderLanguages = (languages: any[]) => {
		return languages
			.filter((language) => language.label.toLowerCase().includes(searchValue.toLowerCase()))
			.map((language, key) => (
				<button
					key={key}
					type='button'
					onClick={() => selectLanguage(language)}
					className={styles['language']}
				>
					<span className={styles['language__name']}>{language.label}</span>
					{language.id === lang && <SuccessIcon />}
				</button>
			));
	};

	return (
		<div className={styles['wrapper']}>
			<BackButton onClick={() => navigate('/settings')} />

			<Field
				icon={<SearchIcon />}				
				value={searchValue}
				onChange={({ target: { value } }) => setSearchValue(value)}
				placeholder={t('settings.language.search.placeholder')}
			/>

			<div className={styles['languages']}>{_renderLanguages(languages)}</div>
		</div>
	);
};
