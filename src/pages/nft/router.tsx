import { Routes, Route } from 'react-router-dom';
import type { FunctionComponent } from 'react';

import { NFTTransferProvider } from '@/providers/nft-transfer';

import { DetailedNFT } from './detailed';
import { Transfer } from './transfer';
import { Confirm } from './confirm';
import { Wrapper } from './wrapper';
import { PinCode } from './pin-code';

export const NFTRouter: FunctionComponent = () => {
	return (
		<NFTTransferProvider>
			<Routes>
				<Route path='/' element={<Wrapper />}>
					<Route path='/:id' element={<DetailedNFT />} />
					<Route path='/:id/transfer' element={<Transfer />} />
					<Route path='/:id/confirm' element={<Confirm />} />
					<Route path='/:id/pin-code' element={<PinCode />} />
				</Route>
			</Routes>
		</NFTTransferProvider>
	);
};
