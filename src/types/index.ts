import { Operations, TRANSACTION_STATUS } from 'src/constants';

export interface PaginationInterface{
  page?:number,
  size?:number,
  total?:number
}
export interface limitInput {
  max: number;
  min: number;
}

export interface TransactionRecord {
  operate: Operations,
  hash: string,
  txlink: string,
  status: TRANSACTION_STATUS,
  data?: {
    wallet: string,
  }
}

export interface StoreData {
  abis: { [address: string]: string }
  abiOptions?: { [name: string]: string }
}