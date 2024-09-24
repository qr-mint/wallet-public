export interface AmountFieldProps {
	onMax?: () => void;
	onChange: (value: string) => void;
	onBlur: (value: string) => void;
	t: (value: string) => string;
	onExchange?: (currency: string) => null;
	onConvert?: (value: number, currenceType: string) => void;
	value?: string | number;
	network: string;
	className?: string;
	placeholder: string;
	max?: string;
	min?: string;
	name: string;
	fiatCurrency: string;
	currencyType: string;
}
