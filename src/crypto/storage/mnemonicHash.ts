const STORAGE_NAME = 'mnemonic-hash';

export const saveMnemonicHash = (mnemonic: string): void => { 
	localStorage.setItem(STORAGE_NAME, mnemonic);
};

export const getMnemonicHash = () => {
	const mnemonicHash = localStorage.getItem(STORAGE_NAME);
	return mnemonicHash;
};

export const clearMnenonicHash = () => {
	localStorage.removeItem(STORAGE_NAME);
};