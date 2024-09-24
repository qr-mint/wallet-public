import { Route, Routes } from 'react-router-dom';
import { SwapPage } from './index';
import { SwapConfirmPage } from './confirm/index';
import { SwapSuccessPage } from './success/index';

export const SwapRouter = () => {
	return (
		<Routes>
			<Route path="/" element={<SwapPage />} />
			<Route path="/confirm" element={<SwapConfirmPage />} />
			<Route path="/success" element={<SwapSuccessPage />} />
		</Routes>
	);
};