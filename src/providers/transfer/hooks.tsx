import { useContext } from 'react';
import { TransferContext } from './provider';

export const useTransfer = () => {
	return useContext(TransferContext);
};