import { ConnectConfig, Near } from 'near-api-js';
import { NearxContract } from './contract';
export { NearxPoolClient } from './nearx-pool-client';

export type Balance = bigint;
export type Epoch = bigint;
export type AccountId = string;

export type Network = 'testnet' | 'mainnet';

export interface NearxStakingPool {
  // View methods:

  /**
   * Returns the user's number of tokens staked inside the pool.
   */
  stakedBalance(user: string): Promise<Balance>;

  /**
   * Returns the user's total number of tokens inside the pool
   * (both staked and unstaked).
   */
  totalBalance(user: string): Promise<Balance>;

  /**
   * Returns a list of the validators.
   */
  validators(): Promise<ValidatorInfo[]>;

  /**
   * Returns user's account which contains the staked, unstaked balance and the epoch height
   * at which the user can withdraw the unstaked balance
   */
  getUserAccount(user: string): Promise<NearxAccount>;

  /**
   * Returns user's account similar to getUserAccount but returns in a format compaitable with
   * traditional NEAR stake pools. The only difference being that rather than specifying the epoch
   * height at which user the user can withdraw the unstaked balance, we return a boolean which indicates
   * if the user can withdraw the unstaked balance
   */
  getUserStakePoolAccount(user: string): Promise<NearxStakePoolAccount>;

  /**
   * Returns the price of NEARX token in NEAR
   */
  getNearxPrice(): Promise<string>;

  /**
   * Returns the total supply of NEARX
   */
  getTotalNearxSupply(): Promise<string>;

  /**
   * Returns the total NEAR staked
   */
  getTotalNearStaked(): Promise<string>;

  /**
   * Returns the total amount of NEARX the user has in his/her account
   */
  getUserNearxBalance(user: string): Promise<string>;

  /**
   * Returns the storage balance of the user
   * @param user - A valid accountId
   */
  getStorageBalance(user: string): Promise<StorageBalance | null>;

  // User-facing methods:

  /**
   * Deposit NEAR(0.0025N to be exact) to reserve storage on the NEARx contract
   */
  storageDeposit(): Promise<string>

  /**
   * Stake tokens inside the pool.
   */
  depositAndStake(amount: string): Promise<string>;

  /**
   * Unstake tokens from the pool.
   */
  unstake(amount: string): Promise<string>;
  /**
   * Unstake tokens from the pool.
   */
  unstakeAll(): Promise<string>;

  /**
   * Withdraw unstaked tokens from the pool.
   */
  withdraw(amount: string): Promise<string>;
  /**
   * Withdraw unstaked tokens from the pool.
   */
  withdrawAll(): Promise<string>;
}

export interface NearxPoolClient extends NearxStakingPool {
  near: Near;
  config: ConnectConfig;
  contract: NearxContract;
}

// DTOs:

export interface ValidatorInfo {
  account_id: AccountId;
  staked: Balance;
  unstaked: Balance;
  last_asked_rewards_epoch_height: Epoch;
  last_unstake_start_epoch: Epoch;
  paused: boolean;
}

export interface SnapshotUser {
  accountId: AccountId;
  nearxBalance: Balance;
}

export interface NearxAccount {
  account_id: AccountId;
  unstaked_balance: Balance;
  staked_balance: Balance;
  withdrawable_epoch: Epoch;
}

export interface NearxStakePoolAccount {
  account_id: AccountId;
  unstaked_balance: Balance;
  staked_balance: Balance;
  can_withdraw: Epoch;
}

export interface NearxStakePoolAccount {
  account_id: AccountId;
  unstaked_balance: Balance;
  staked_balance: Balance;
  can_withdraw: Epoch;
}

export interface StorageBalance {
  total: string;
  available: string;
}
