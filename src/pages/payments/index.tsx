import { Route, Routes } from 'react-router-dom';

import { Select } from './select';
import { Amount } from './amount';
import { SelectNetwork } from './select-network';
import { Payment } from './payment';
import { Uniramp } from './uniramp';
import { LetsExachange } from './letsexachange';

export const PaymentsRouter = () => {
	return (
		<Routes>
			<Route path="/select" element={<Select />} />
			<Route path="/select/:methodName/network" element={<SelectNetwork />} />
			<Route path="/lets_exachange" element={<LetsExachange />} />
			<Route path="/uniramp" element={<Uniramp />} />
			<Route path="/amount/:methodName/:network" element={<Amount />} />
			<Route path="/:methodName/:network" element={<Payment />} />
		</Routes>
	);
};