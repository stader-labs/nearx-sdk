import { ConnectConfig, Near } from 'near-api-js';
import { NearxContract } from './contract';
export { NearxPoolClient } from './nearx-pool-client';

export type Balance = bigint;
export type Epoch = bigint;
export type AccountId = string;

/** Based on the network, the sdk selects the contract to interact with
 * mainnet network will interact with v2-nearx.stader-labs.near
 * testnet network will interact with v2-nearx.staderlabs.testnet
 */
export type Network = 'testnet' | 'mainnet';

export interface NearxStakingPool {
  // View methods:

  /**
   * Returns a list of the validators.
   */
  getValidators(): Promise<ValidatorInfo[]>;

  /**
   * Returns user's account which contains the staked, unstaked balance and the epoch height
   * at which the user can withdraw the unstaked balance
   * @param user - User whose account we want to view
   */
  getUserAccount(user: string): Promise<NearxAccount>;

  /**
   * Returns user's account similar to getUserAccount but returns in a format compaitable with
   * traditional NEAR stake pools. The only difference being that rather than specifying the epoch
   * height at which user the user can withdraw the unstaked balance, we return a boolean which indicates
   * if the user can withdraw the unstaked balance
   * @param user - User whose account we want to view
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
   * @param user - User whose NEARX balance we want to view
   */
  getUserNearxBalance(user: string): Promise<string>;

  /**
   * Returns the storage balance of the user
   * @param user - User whose storage balance we want to view
   */
  getStorageBalance(user: string): Promise<StorageBalance | null>;

  // User-facing methods:

  /**
   * Deposit NEAR(0.0025N to be exact) to reserve storage on the NEARx contract
   */
  storageDeposit(): Promise<void>;

  /**
   * Stake tokens inside the pool.
   * @param amount - Amount of yNEAR(NEAR in 10^24) to be deposited
   */
  depositAndStake(amount: string): Promise<void>;

  /**
   * Unstake tokens from the pool.
   * @param amount - Amount of yNEAR(NEAR in 10^24) to be unstaked
   */
  unstake(amount: string): Promise<void>;

  /**
   * Unstake tokens from the pool.
   */
  unstakeAll(): Promise<void>;

  /**
   * Withdraw unstaked tokens from the pool.
   * @param amount - Amount of yNEAR(NEAR in 10^24) to be withdrawn
   */
  withdraw(amount: string): Promise<void>;

  /**
   * Withdraw unstaked tokens from the pool.
   */
  withdrawAll(): Promise<void>;
}

export interface NearxPoolClient extends NearxStakingPool {
  near: Near;
  config: ConnectConfig;
  contract: NearxContract;
}

// DTOs:

/**
 * Information of a validator in the NEARX stake pool
 */
export interface ValidatorInfo {
  /** Account id of the validator. This is the address of the stake pool contract */
  account_id: AccountId;
  /** Total amount staked with the validator by the NEARX contract */
  staked: Balance;
  /** Total amount unstaked with the validator by the NEARX contract */
  unstaked: Balance;
  /** The epoch at which we last reconciled the rewards for this validator  */
  last_asked_rewards_epoch_height: Epoch;
  /** The epoch at which we last unstaked from this validator */
  last_unstake_start_epoch: Epoch;
  /** true if the validator is in the validator set of NEARX */
  paused: boolean;
}

/**
 * User account in NEARx. This account needs to be created using storage_deposit
 */
export interface NearxAccount {
  /** Account id of the user */
  account_id: AccountId;
  /** Total NEAR which the user has unstaked */
  unstaked_balance: Balance;
  /** Total NEAR value of the users NEARX. It is the product of the users NEARX balance
   * and the NEARX price
   */
  staked_balance: Balance;
  /** The epoch at which a user can withdraw their unstaked NEAR */
  withdrawable_epoch: Epoch;
}

/**
 * Similar to NearxAccount but has an interface similar to the user account
 * interface of traditional NEAR stake pool contract
 */
export interface NearxStakePoolAccount {
  /** Account id of the user */
  account_id: AccountId;
  /** Total NEAR which the user has unstaked */
  unstaked_balance: Balance;
  /** Total NEAR value of the users NEARX. It is the product of the users NEARX balance
   * and the NEARX price
   */
  staked_balance: Balance;
  /** true if the user can withdraw his unstaked amount.
   * It is essentially withdrawable_epoch <= current_epoch
   */
  can_withdraw: Epoch;
}

/**
 * Amount of Near user has given for storage balance in the NEARx contract
 * The amount of NEAR user will give is fixed to 0.0025N
 */
export interface StorageBalance {
  total: string;
  available: string;
}
