export interface PinPadProps {
	title: string;
	onChange: (digit: string, wrong: (error: string) => void) => void ;
}
