import { Route, Routes } from 'react-router-dom';

import { SelectNetwork } from './select-network';
import { Address } from './address';

export const ReceiverRouter = () => {
	return (
		<Routes>
			<Route path="/" element={<SelectNetwork />} />
			<Route path="/:network" element={<Address />} />
		</Routes>
	);
};