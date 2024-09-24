import cn from 'classnames';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { useAddressStore } from '@/store/addresses';
import { useSettingsStore } from '@/store/useSettingsStore';
import { numberWithCommas } from '@/helpers/numberFormatter';
import { symbols } from '@/helpers/fiatCurrencySymbols';
import { BackButton } from '@vkruglikov/react-telegram-web-app';
import LanguageIcon from '@/assets/icons/settings/language.svg?react';
import CurrencyIcon from '@/assets/icons/settings/currency.svg?react';
import NewsIcon from '@/assets/icons/settings/news.svg?react';
import TokensIcon from '@/assets/icons/settings/tokens.svg?react';
import ChevronRightIcon from '@/assets/icons/chevron-right.svg?react';
import SeedPhraseIcon from '@/assets/icons/settings/seed-phrase.svg?react';
import LedgerIcon from '@/assets/icons/settings/ledger.svg?react';
import HelpIcon from '@/assets/icons/settings/help.svg?react';
import styles from './styles.module.scss';
import { useLanguage } from '@/hooks/useLanguage';
import { useAccountStore } from '@/store/useAccountStore';
import { useAuthStore } from '@/store/auth/useAuthStore';

export const Settings = () => {
	const auth = useAuthStore();
	const account = useAccountStore();
	const wallet = useAddressStore();
	const navigate = useNavigate();
	const { t } = useTranslation();
	const { lang } = useLanguage();
	const { currency } = useSettingsStore();

	const handleLogout = () => {
		account.clean();

		const hasBeenСleared = localStorage.getItem('hasBeenСleared');
		localStorage.clear();
		if (hasBeenСleared) {
			localStorage.setItem('hasBeenСleared', 'true');
		}

		navigate('/add-addresses');
	};

	const _renderWallet = () => {
		const amount = numberWithCommas(wallet.fiatAmount, 2);

		return (
			<Link to='/settings/wallet' className={styles['nav__wallet-link']}>
				{auth.profile.imageSource
					? <img className={styles.avatar} src={auth.profile.imageSource} alt='' />
					: <div className={styles.placeholder} />}


				<p>{wallet.name}</p>
				<span>
					{symbols[wallet.fiatCurrency.toUpperCase()]}
					{amount}
				</span>

				<ChevronRightIcon />
			</Link>
		);
	};

	return (
		<div className={styles['settings']}>
			<BackButton onClick={() => navigate('/')} />

			<div className={styles['nav']}>
				{_renderWallet()}

				<Link to='/settings/language' className={styles['nav__link']}>
					<div className={styles['nav__link-left']}>
						<LanguageIcon />
						<span>{t('settings.language.title')}</span>
					</div>

					<div className={styles['nav__link-right']}>
						<span>{t(`languages.${lang}`)}</span>

						<ChevronRightIcon />
					</div>
				</Link>

				<Link to='/settings/currency' className={styles['nav__link']}>
					<div className={styles['nav__link-left']}>
						<CurrencyIcon />

						<span>{t('settings.currency.title')}</span>
					</div>

					<div className={styles['nav__link-right']}>
						<span>{currency}</span>

						<ChevronRightIcon />
					</div>
				</Link>

				<Link to='/settings/tokens' className={styles['nav__link']}>
					<div className={styles['nav__link-left']}>
						<TokensIcon />
						<span>{t('settings.tokens.title')}</span>
					</div>

					<div className={styles['nav__link-right']}>
						<ChevronRightIcon />
					</div>
				</Link>
			</div>

			<br />

			<div className={styles['nav']}>
				<Link to='/settings/seed-phrase' className={styles['nav__link']}>
					<div className={styles['nav__link-left']}>
						<SeedPhraseIcon />
						<span>Seed Phrase</span>
					</div>

					<div className={styles['nav__link-right']}>
						<ChevronRightIcon />
					</div>
				</Link>

				<Link to='#' className={cn(styles['nav__link'], styles['disabled'])}>
					<div className={styles['nav__link-left']}>
						<LedgerIcon />
						<span>{t('auth.select.ledger.title')}</span>
					</div>

					<div className={styles['nav__link-right']}>
						<ChevronRightIcon />
					</div>
				</Link>
			</div>

			<br />

			<div className={styles['nav']}>
				<a href='https://t.me/+eKKKQ_dXKOk0ZDk0' className={cn(styles['nav__link'])}>
					<div className={styles['nav__link-left']}>
						<HelpIcon />
						<span>{t('settings.support.title')}</span>
					</div>

					<div className={styles['nav__link-right']}>
						<ChevronRightIcon />
					</div>
				</a>

				<a href='https://t.me/nexuswallet' className={styles['nav__link']}>
					<div className={styles['nav__link-left']}>
						<NewsIcon />
						<span>{t('settings.news.title')}</span>
					</div>

					<div className={styles['nav__link-right']}>
						<ChevronRightIcon />
					</div>
				</a>

				<div onClick={handleLogout} className={styles['nav__link']}>
					<div className={styles['nav__link-left']}>
						<span>{t('settings.logout.title')}</span>
					</div>
				</div>
			</div>

			<div className={styles['links']}>
				<Link to={'#'} className={styles['links__item']}>
					{t('settings.legal-information.title')}
				</Link>

				<Link to={'#'} className={styles['links__item']}>
					{t('settings.terms.title')}
				</Link>
			</div>
		</div>
	);
};
