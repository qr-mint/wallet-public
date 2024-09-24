interface HapticFeedback {
	impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
}

interface InitDataUnsafe {
	user: {
		username: string;
	};
}

interface WebApp extends Event {
	initData: string;
	initDataUnsafe: InitDataUnsafe;
	HapticFeedback: HapticFeedback;
	ready: () => void;
	showConfirm: (text: string, callback?: (ok: boolean) => void) => void;
}

interface Telegram {
	WebApp: WebApp;
}

interface Window {
	Telegram: Telegram;
}

declare global {
	interface Buffer {}
}
