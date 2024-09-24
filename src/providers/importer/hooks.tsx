import { useContext } from 'react';
import { ImporterContext } from './importer';

export const useImporter = () => {
	return useContext(ImporterContext);
};
