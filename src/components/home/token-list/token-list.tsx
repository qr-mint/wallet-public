import cn from 'classnames';
import { useNavigate } from 'react-router-dom';
import { useHapticFeedback } from '@vkruglikov/react-telegram-web-app';
import type { FunctionComponent } from 'react';

import { useTokenInfo } from '@/store/token';
import { useAddressStore } from '@/store/addresses';

import { Token } from './token';
import { TokenSkeleton } from './token-skeleton';
import styles from './token.module.scss';
import type { TokenListProps } from './types';
import type { Token as IToken } from '@/store/addresses/types';

export const TokenList: FunctionComponent<TokenListProps> = ({ className, tokenList, loading }) => {
	const navigate = useNavigate();
	const [impactOccurred] = useHapticFeedback();

	const address = useAddressStore();
	const { saveTokenInfo } = useTokenInfo();

	const handleSelectToken = (tokenID: number) => {
		const selectedToken = address.tokens.find((token) => token.id === tokenID);

		if (selectedToken) {
			impactOccurred('medium');
			saveTokenInfo(selectedToken);
			return navigate(`/coins/${selectedToken.id}`);
		}
	};

	const _renderTokens = (tokens: IToken[]) => {
		if (loading || !tokens.length) {
			return <TokenSkeleton count={6} />;
		}
		return tokens.map((token, key) => <Token onClick={() => handleSelectToken(token.id)} token={token} key={key} />);
	};

	return <div className={cn(styles['token-list'], className)}>{_renderTokens(tokenList)}</div>;
};
