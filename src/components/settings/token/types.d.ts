interface IToken {
	imageSource: string;
	caption: string;
	symbol: string;
}

export interface TokenProps {
	className?: string;
	disabled?: boolean;
	token: IToken;
	checked?: boolean;
	onSwitch?: (visible: boolean) => void;
	onClick?: (event: MouseEvent<HTMLDivElement>) => void;
}
