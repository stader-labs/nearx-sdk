import * as nearjs from 'near-api-js';
import {
  NearxAccount,
  NearxStakePoolAccount,
  StorageBalance,
  ValidatorInfo,
} from '.';
import { nameof } from './utils';

export type NearxContract = nearjs.Contract & RpcCallsStakingPool & RpcCallsFt;

/**
 * The parameters used for every RPC call to the contract.
 */
export interface CallRpcParams {
  /** The gas the caller is willing to pay for the transaction. */
  gas?: string;
  /** The deposit joined to the call. */
  amount?: string;
  /** The contract arguments. */
  args: any;
}

export interface ViewRpcParams {
  [name: string]: any;
}

export interface RpcCallsFt {
  ft_balance_of(params: ViewRpcParams): Promise<string>;
  ft_total_supply(params: ViewRpcParams): Promise<string>;

  ft_transfer(params: CallRpcParams): Promise<string>;
  ft_transfer_call(params: CallRpcParams): Promise<string>;
}

export interface RpcCallsStakingPool {
  get_account_staked_balance(params: ViewRpcParams): Promise<string>;
  get_account_total_balance(params: ViewRpcParams): Promise<string>;
  get_total_staked_balance(params: ViewRpcParams): Promise<string>;
  get_nearx_price(params: ViewRpcParams): Promise<string>;
  get_validators(params: ViewRpcParams): Promise<ValidatorInfo[]>;
  get_user_account(params: ViewRpcParams): Promise<NearxAccount>;
  // this is the same interface as that of the stake pool get_account
  get_account(params: ViewRpcParams): Promise<NearxStakePoolAccount>;
  storage_balance_of(params: ViewRpcParams): Promise<StorageBalance | null>;

  storage_deposit(params: CallRpcParams): Promise<string>;
  deposit(params: CallRpcParams): Promise<string>;
  deposit_and_stake(params: CallRpcParams): Promise<string>;
  stake(params: CallRpcParams): Promise<string>;
  withdraw(params: CallRpcParams): Promise<string>;
  withdraw_all(params: CallRpcParams): Promise<string>;
  unstake(params: CallRpcParams): Promise<string>;
  unstake_all(params: CallRpcParams): Promise<string>;
}

export function createContract(
  account: nearjs.Account,
  contractName: string
): NearxContract {
  return new nearjs.Contract(
    // The account object that is connecting:
    account,

    // Name of contract you're connecting to:
    contractName,

    // Options:
    {
      viewMethods: [
        // Fungible Token:
        nameof<RpcCallsFt>('ft_balance_of'),
        nameof<RpcCallsFt>('ft_total_supply'),
        // Staking Pool:
        nameof<RpcCallsStakingPool>('get_account_staked_balance'),
        nameof<RpcCallsStakingPool>('get_account_total_balance'),
        nameof<RpcCallsStakingPool>('get_total_staked_balance'),
        nameof<RpcCallsStakingPool>('get_nearx_price'),
        nameof<RpcCallsStakingPool>('get_account'),
        nameof<RpcCallsStakingPool>('get_user_account'),
        nameof<RpcCallsStakingPool>('get_validators'),
        nameof<RpcCallsStakingPool>('storage_balance_of'),
      ],
      changeMethods: [
        // Storage management
        nameof<RpcCallsStakingPool>('storage_deposit'),

        // Staking Pool:
        nameof<RpcCallsStakingPool>('deposit'),
        nameof<RpcCallsStakingPool>('deposit_and_stake'),
        nameof<RpcCallsStakingPool>('stake'),
        nameof<RpcCallsStakingPool>('withdraw'),
        nameof<RpcCallsStakingPool>('withdraw_all'),
        nameof<RpcCallsStakingPool>('unstake'),
        nameof<RpcCallsStakingPool>('unstake_all'),
        nameof<RpcCallsFt>('ft_transfer'),
        nameof<RpcCallsFt>('ft_transfer_call'),
      ],
    }
  ) as NearxContract;
}
