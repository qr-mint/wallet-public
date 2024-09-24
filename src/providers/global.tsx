import { BrowserRouter } from 'react-router-dom';
import { WebAppProvider } from '@vkruglikov/react-telegram-web-app';
import { I18nextProvider } from 'react-i18next';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';
import type { FunctionComponent, PropsWithChildren } from 'react';

import { i18n } from '@/i18n';

export const Providers: FunctionComponent<PropsWithChildren> = ({ children }) => {
	return (
		<BrowserRouter>
			<WebAppProvider>
				<I18nextProvider i18n={i18n}>
					<QueryParamProvider adapter={ReactRouter6Adapter}>{children}</QueryParamProvider>
				</I18nextProvider>
			</WebAppProvider>
		</BrowserRouter>
	);
};
