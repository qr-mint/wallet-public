import type { ICoinNetwork } from '@/types/coin';

export interface IRecentAddress {
  address: string;
  datetime: string;
  network: ICoinNetwork;
}
