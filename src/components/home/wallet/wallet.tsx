import cn from 'classnames';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useHapticFeedback } from '@vkruglikov/react-telegram-web-app';
import { FunctionComponent, useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/home/button';
import type { WalletProps } from './types';

import styles from './wallet.module.scss';
import QRIcon from '@/assets/icons/wallet/qr.svg?react';
import PlusIcon from '@/assets/icons/wallet/plus.svg?react';
import ArrowUpIcon from '@/assets/icons/wallet/arrow-up.svg?react';
import ArrowUpDownIcon from '@/assets/icons/wallet/arrow-up-down.svg?react';
import XIcon from '@/assets/icons/x.svg?react';
import { MIN_COINS_FOR_SWAP, SwapRoutes } from '@/constants';
import { useAddressStore } from '@/store/addresses';
import { UiTooltip } from '@/components';

export const Wallet: FunctionComponent<WalletProps> = ({ children, className, isDetailed, wallet }) => {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [impactOccured] = useHapticFeedback();

	const textColor = isDetailed ? 'blue' : 'white';

	const [tippyVisible, setTippyVisible] = useState<boolean>(true);

	const coins = useAddressStore(state => state.coins);
	const fetchCoins = useAddressStore(state => state.fetchCoins);

	const canSwap = useMemo<boolean>(() => {
		const availableCoins = coins.filter(coin => coin.isVisible);
		return availableCoins.length >= MIN_COINS_FOR_SWAP;
	}, [ coins ]);

	useEffect(() => {
		if (!coins.length) {
			fetchCoins();
		}
	}, [ coins ]);

	return (
		<div className={cn(styles['wallet'], className, { [styles['detailed']]: isDetailed })}>
			{children}

			<div className={styles['wallet__actions']}>
				<Button
					icon={<ArrowUpIcon />}
					textColor={textColor}
					onClick={() => {
						impactOccured('medium');
						navigate(
							isDetailed && wallet
								? `/transfer/address/${wallet.id}?prevURL=${location.pathname}`
								: '/transfer/select-coin',
						);
					}}
				>
					{t('home.buttons.transfer')}
				</Button>

				<Button
					icon={<PlusIcon />}
					textColor={textColor}
					onClick={() => {
						impactOccured('medium');
						navigate(
							isDetailed && wallet
								? `/select-deposit?selected-coin=${wallet.id}&prevURL=${location.pathname}`
								: '/select-deposit',
						);
					}}
				>
					{t('home.buttons.deposit')}
				</Button>

				<Button
					icon={<QRIcon />}
					textColor={textColor}
					onClick={() => {
						impactOccured('medium');
						navigate(isDetailed && wallet ? `/receiver/${wallet.id}?prevURL=${location.pathname}` : '/receiver');
					}}
				>
					{t('home.buttons.receive')}
				</Button>

				<UiTooltip
					visible={tippyVisible}
					interactive
					render={() => {
						if (canSwap || !tippyVisible) {
							return undefined;
						}

						return (
							<div className={styles['tippyContainer']}>
								<div>{t('home.swap.alert')}</div>

								<XIcon
									className={styles['cross']}
									onClick={() => setTippyVisible(false)}
								/>
							</div>
						);
					}}
				>
					<Button
						icon={<ArrowUpDownIcon />}
						textColor={textColor}
						disabled={!canSwap}
						onClick={() => {
							navigate(SwapRoutes.SWAP(isDetailed && wallet ? `?coinId=${wallet.id}` : undefined));
						}}
					>
						{t('home.buttons.swap')}
					</Button>
				</UiTooltip>
			</div>
		</div>
	);
};
