import { ITransaction } from '@/types/transaction';

type RecentAddressProps = {
	recentAddress: ITransaction;
	onClick?: (event: MouseEvent<HTMLDivElement>) => void;
};
