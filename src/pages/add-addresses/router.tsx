import { Routes, Route } from 'react-router-dom';

import { Name } from './name';
import { ImportSeedPhrase } from './import-seed-phrase';
import { Confirm } from './confirm';
import { PinCode } from './pin-code';
import { Select } from './select';

import { ImporterProvider } from '@/providers/importer';

export const AddAddressRouter = () => {
	return (
		<ImporterProvider>
			<Routes>
				<Route path='/' element={<Select />} />
				<Route path='/confirm' element={<Confirm />} />
				<Route path='/import' element={<ImportSeedPhrase />} />
				<Route path='/name' element={<Name />} />
				<Route path='/pin-code' element={<PinCode />} />
			</Routes>
		</ImporterProvider>
	);
};
