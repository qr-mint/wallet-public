import { ErrorBoundary } from 'react-error-boundary';
import { ToastContainer } from 'react-toastify';
import type { FunctionComponent } from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'react-toastify/dist/ReactToastify.css';

import { MainRoutes } from './routes';
import { Providers } from './providers/global';
import { FallbackComponent } from './pages/errors/fallback-component';
import '@/assets/styles/globals.scss';
import '@/assets/styles/toast.scss';

export const App: FunctionComponent = () => {
	if (typeof window !== 'undefined') {
		const hasBeenСleared = localStorage.getItem('hasBeenСleared');
		
		if (!hasBeenСleared) {
			localStorage.clear();
			localStorage.setItem('hasBeenСleared', 'true');
		}
	}

	return (
		<Providers>
			<ErrorBoundary
				FallbackComponent={FallbackComponent}
				onError={(error, info) => {
					console.error('[Error Boundary]: Error ', error);
					console.log('[Error Boundary]: Info ', info);
				}}
			>
				<MainRoutes />
			</ErrorBoundary>
			<ToastContainer limit={4} /> {/* Уведомление */}
		</Providers>
	);
};
