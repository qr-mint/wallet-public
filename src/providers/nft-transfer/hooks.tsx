import { useContext } from 'react';
import { NFTTransferContext } from './provider';

export const useNFTTransfer = () => {
	return useContext(NFTTransferContext);
};