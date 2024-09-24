import { useState, useEffect, ReactNode } from 'react';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';

interface PortalProps {
	children: ReactNode
}

export const Portal = ({ children }:PortalProps) => {
	const [ mounted, setMounted ] = useState(false);

	useEffect(() => {
		setMounted(true);
		return () => setMounted(false);
	}, []);

	return mounted
		? ReactDom.createPortal(children, document.getElementById('root') as HTMLElement)
		: <></>;
};

Portal.propTypes = {
	children: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.object,
	]),
};
