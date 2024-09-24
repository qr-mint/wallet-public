import { Route, Routes } from 'react-router-dom';
import { Settings } from './index';
import { Language } from './language';
import { Currency } from './currency';
import { Tokens } from './tokens';
import { Wallet } from './wallet';
import { SeedPhraseOfSettings } from './seed-phrase';

export const SettingsRouter = () => {
	return (
		<Routes>
			<Route path="/" element={<Settings />} />
			<Route path="/seed-phrase" element={<SeedPhraseOfSettings />} />
			<Route path="/pin-code" element={<Language />} />
			<Route path="/language" element={<Language />} />
			<Route path="/currency" element={<Currency />} />
			<Route path="/tokens" element={<Tokens />} />
			<Route path="/:wallet" element={<Wallet />} />
		</Routes>
	);
};