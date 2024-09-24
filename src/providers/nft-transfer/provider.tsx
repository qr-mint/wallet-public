/* eslint-disable react-hooks/rules-of-hooks */
import { createContext } from 'react';
import type { FunctionComponent, PropsWithChildren } from 'react';

import { NFTTransfer } from '@/providers/nft-transfer';

export const NFTTransferContext = createContext<NFTTransfer>({} as NFTTransfer);

export const NFTTransferProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
	const nftTransfer = new NFTTransfer();
	return <NFTTransferContext.Provider value={nftTransfer}>{children}</NFTTransferContext.Provider>;
};
