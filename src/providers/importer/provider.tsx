import type { FunctionComponent, PropsWithChildren } from 'react';

import { Importer, ImporterContext } from './importer';

export const ImporterProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
	const importer = new Importer();

	return <ImporterContext.Provider value={importer}>{children}</ImporterContext.Provider>;
};