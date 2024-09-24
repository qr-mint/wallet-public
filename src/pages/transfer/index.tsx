import { Routes, Route } from 'react-router-dom';

import { SelectCoin } from './select-coin';
import { TransferProvider } from '../../providers/transfer/provider';
import { Address } from './address';
import { AmountPage } from './amount';
import { Confirm } from './confirm';
import { PinCode } from './pin-code';

import { Wrapper } from './wrapper';

export const TransferRouter = () => {
	return (
		<TransferProvider>
			<Routes>
				<Route path='/select-coin' element={<SelectCoin />} />

				<Route path='/' element={<Wrapper />}>
					<Route path='/address/:network' element={<Address />} />
					<Route path='/amount/:network' element={<AmountPage />} />
					<Route path='/confirm/:network' element={<Confirm />} />
					<Route path='/pin-code/:network' element={<PinCode />} />
				</Route>
			</Routes>
		</TransferProvider>
	);
};
