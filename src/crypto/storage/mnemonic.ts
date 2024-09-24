const STORAGE_NAME = 'crypto-key';

export const saveMnemonic = (mnemonic: string) => { 
	localStorage.setItem(STORAGE_NAME, mnemonic);
};

export const getMnemonic = () => {
	return localStorage.getItem(STORAGE_NAME);
};

export const clearMnenonic = () => {
	localStorage.removeItem(STORAGE_NAME);
};