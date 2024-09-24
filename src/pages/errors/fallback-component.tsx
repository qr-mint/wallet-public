import { FallbackProps } from 'react-error-boundary';
import { Error404 } from './404';
import { Error503 } from './503';
import { type FunctionComponent } from 'react';

export const FallbackComponent: FunctionComponent<FallbackProps> = ({ error }) => {
	if (error.status === 404) {
		return <Error404 />;
	} else if (error.status >= 500) {
		return <Error503 error={error} />;
	}
	return;
};
