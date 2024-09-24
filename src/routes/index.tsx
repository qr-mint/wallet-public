import { useEffect, useMemo, useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import { useAuthStore, AUTH_STATE } from '@/store/auth/useAuthStore';
import { D_Apps } from '@/pages/dapps';
import { Loading } from '@/pages/loading';
import { AccountRoutes } from './account';
import { AddAddressRouter } from '@/pages/add-addresses/router';
import { useAccountStore } from '@/store/useAccountStore';

export const MainRoutes = () => {
	const appState = useAuthStore();
	const account = useAccountStore();
	const [ isLoading, setIsLoading ] = useState(true);

	useEffect(() => {
		window.Telegram.WebApp.ready();

		const initializeApp = async () => {
			if (appState.name !== AUTH_STATE.AUTHORIZED) {
				await appState.init();
			} else if (appState.name === AUTH_STATE.AUTHORIZED) {
				account.init();
			}
			
			setIsLoading(false);
		};

		initializeApp();
	}, []);


	const routes = useMemo(() => {
		if (!isLoading && appState.name === AUTH_STATE.AUTHORIZED) {
			return [
				{ path: '/dapps', element: <D_Apps /> },
				{ path: '/add-addresses/*', element: <AddAddressRouter /> },
				{ path: '/*', element: <AccountRoutes /> },
			];
		}
		return [];
	}, [ isLoading, appState.name ]);

	if (isLoading) {
		return (
			<div className="container-loading">
				<Loading />
			</div>
		);
	}

	return (
		<Routes>
			{routes.map((route, key) => (
				<Route {...route} key={key} />
			))}
		</Routes>
	);
};
