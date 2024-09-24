import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import { CryptoMnemonic } from '@/crypto/mnemonic';

export enum ACCOUNT_STATE {
	CONNECTED = 'CONNECTED',
  UNCONNECTED = 'UNCONNECTED',
	LOCKED = 'LOCKED',
}

interface State {
	state: ACCOUNT_STATE;
	name: string;
}

interface Action {
	// blocked(): void;
  connect(): void;
	init: () => Promise<void>;
	unlock(code: string): Promise<string> | any;
	lock(): void;
  clean(): void;
}

type AccountStoreI = State & Action;

export const useAccountStore = create<AccountStoreI>()(
	devtools(
		persist(
			(set, get) => {
				const unlock = async (code: string) => {
					const { connect } = get();
					const mnemonic = new CryptoMnemonic();
					const words = await mnemonic.loadMnemonic(code);
					if (words) {
						mnemonic.saveHash(mnemonic.toHash(words));
						connect();
						return words;
					} else {
						set({ state: ACCOUNT_STATE.UNCONNECTED });
					}
				};

				const lock = () => {
					set((state: State) => ({ ...state, state: ACCOUNT_STATE.LOCKED }));
				};

				const init = async () => {
					const mnemonic = new CryptoMnemonic();
					if (mnemonic.isMnemonic()) {
						set({ state: ACCOUNT_STATE.LOCKED });
					} else {
						set({ state: ACCOUNT_STATE.UNCONNECTED });
					}
				};
        
				const connect = async () => {	
					set({ state: ACCOUNT_STATE.CONNECTED });
				};

				const clean = () => {
					const mnemonic = new CryptoMnemonic();
					mnemonic.clear();
					set({ state: ACCOUNT_STATE.UNCONNECTED });
				};
	
				return {
					state: ACCOUNT_STATE.UNCONNECTED,
					init,
					lock,
					unlock,
					connect,
					clean
				};
			},
			{ name: 'account' },
		),
	),
);
