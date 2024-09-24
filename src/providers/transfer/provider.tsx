/* eslint-disable react-hooks/rules-of-hooks */
import { createContext } from 'react';
import type { FunctionComponent, PropsWithChildren } from 'react';

import { Transfer } from '@/providers/transfer/transfer';

export const TransferContext = createContext<Transfer>({} as Transfer);

export const TransferProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
	const transfer = new Transfer();
	return <TransferContext.Provider value={transfer}>{children}</TransferContext.Provider>;
};
