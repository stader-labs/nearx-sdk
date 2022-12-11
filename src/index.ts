import { readFileSync } from 'fs';
import * as nearjs from 'near-api-js';
import { ConnectConfig, Near } from 'near-api-js';
import * as os from 'os';
import { isBrowser } from './utils';

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
  depositAndStake(
    amount: string,
    memo?: { [k: string]: string }
  ): Promise<void>;

  /**
   * Unstake tokens from the pool.
   * @param amount - Amount of yNEAR(NEAR in 10^24) to be unstaked
   */
  unstake(amount: string, memo?: { [k: string]: string }): Promise<void>;

  /**
   * Unstake tokens from the pool.
   */
  unstakeAll(memo?: { [k: string]: string }): Promise<void>;

  /**
   * Withdraw unstaked tokens from the pool.
   * @param amount - Amount of yNEAR(NEAR in 10^24) to be withdrawn
   */
  withdraw(amount: string, memo?: { [k: string]: string }): Promise<void>;

  /**
   * Withdraw unstaked tokens from the pool.
   */
  withdrawAll(): Promise<void>;

  /**
   * Upgrades the contracts to the given wasm file
   */
  contractUpgrade(wasmFile: string): Promise<any>;

  /**
   * Transfer nearx to user
   */
  transferNearxToUser(
    user: string,
    amount: string,
    memo?: { [k: string]: string }
  ): Promise<any>;

  /**
   * Transfer nearx to contract
   */
  transferNearxToContract(
    receivingContract: string,
    amount: string,
    msg: string,
    memo?: { [k: string]: string }
  ): Promise<any>;
}

export interface INearxPoolClient extends NearxStakingPool {
  near: Near;
  config: ConnectConfig;
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

export const NearxPoolClient = {
  async create(
    networkId: Network,
    accountId: string
  ): Promise<INearxPoolClient> {
    // Depending on being in the browser or not,
    // the config is set from a local keystore or the browser wallet:
    const config = configFromNetwork(networkId);
    // Connect to NEAR:
    const near = await nearjs.connect(config);

    let contractName = 'v2-nearx.stader-labs.near';
    if (networkId === 'testnet') {
      contractName = 'v2-nearx.staderlabs.testnet';
    }

    if (accountId == null) {
      throw new Error('When used in a CLI, the accountId must be specified');
    }
    // Use the previously set keystore:
    const account = new nearjs.Account(near.connection, accountId);

    const client = {
      near,
      config,

      // View methods:
      async getValidators(): Promise<ValidatorInfo[]> {
        return account.viewFunctionV2({
          contractId: contractName,
          methodName: 'get_validators',
          args: {},
        }) as Promise<ValidatorInfo[]>;
      },

      async getUserAccount(user: string): Promise<NearxAccount> {
        return account.viewFunctionV2({
          contractId: contractName,
          methodName: 'get_user_account',
          args: {
            account_id: user,
          },
        }) as Promise<NearxAccount>;
      },

      async getNearxPrice(): Promise<string> {
        return account.viewFunctionV2({
          contractId: contractName,
          methodName: 'get_nearx_price',
          args: {},
        }) as Promise<string>;
      },

      async getTotalNearxSupply(): Promise<string> {
        return account.viewFunctionV2({
          contractId: contractName,
          methodName: 'ft_total_supply',
          args: {},
        }) as Promise<string>;
      },

      async getTotalNearStaked(): Promise<string> {
        return account.viewFunctionV2({
          contractId: contractName,
          methodName: 'get_total_staked_balance',
          args: {},
        }) as Promise<string>;
      },

      async getUserStakePoolAccount(
        user: string
      ): Promise<NearxStakePoolAccount> {
        return account.viewFunctionV2({
          contractId: contractName,
          methodName: 'get_account',
          args: {
            account_id: user,
          },
        }) as Promise<NearxStakePoolAccount>;
      },

      async getUserNearxBalance(user: string): Promise<string> {
        return account.viewFunctionV2({
          contractId: contractName,
          methodName: 'ft_balance_of',
          args: {
            account_id: user,
          },
        }) as Promise<string>;
      },

      async getStorageBalance(user: string): Promise<StorageBalance | null> {
        return account.viewFunctionV2({
          contractId: contractName,
          methodName: 'storage_balance_of',
          args: {
            account_id: user,
          },
        }) as Promise<StorageBalance | null>;
      },

      // User-facing methods:
      async storageDeposit(memo?: { [k: string]: string }): Promise<void> {
        await account.functionCall({
          contractId: contractName,
          methodName: 'storage_deposit',
          args: {
            ...memo,
          },
          attachedDeposit: '2500000000000000000000',
        });
      },

      async depositAndStake(
        amount: string,
        memo?: { [k: string]: string }
      ): Promise<void> {
        // First check storage deposit and then stake, use batch transactions
        const storageBalance = this.getStorageBalance(accountId);

        if (!storageBalance) {
          // add storage_deposit
          await this.storageDeposit(memo);
        }

        await account.functionCall({
          contractId: contractName,
          methodName: 'deposit_and_stake',
          args: {
            ...memo,
          },
          attachedDeposit: amount,
        });
      },

      async unstake(
        amount: string,
        memo?: { [k: string]: string }
      ): Promise<void> {
        await account.functionCall({
          contractId: contractName,
          methodName: 'unstake',
          args: {
            amount: amount,
            ...memo,
          },
        });
      },

      async unstakeAll(memo?: { [k: string]: string }): Promise<void> {
        await account.functionCall({
          contractId: contractName,
          methodName: 'unstake_all',
          args: {
            ...memo,
          },
        });
      },

      async withdraw(
        amount: string,
        memo?: { [k: string]: string }
      ): Promise<void> {
        await account.functionCall({
          contractId: contractName,
          methodName: 'withdraw',
          args: {
            amount: amount,
            ...memo,
          },
        });
      },

      async withdrawAll(memo?: { [k: string]: string }): Promise<void> {
        await account.functionCall({
          contractId: contractName,
          methodName: 'withdraw_all',
          args: {
            ...memo,
          },
        });
      },

      async transferNearxToUser(
        user: string,
        amount: string,
        memo?: { [k: string]: string }
      ): Promise<void> {
        await account.functionCall({
          contractId: contractName,
          methodName: 'ft_transfer',
          args: {
            receiver_id: user,
            amount: amount,
            ...memo,
          },
          attachedDeposit: 1,
        });
      },

      async transferNearxToContract(
        receivingContract: string,
        amount: string,
        msg: string,
        memo?: { [k: string]: string }
      ): Promise<void> {
        await account.functionCall({
          contractId: contractName,
          methodName: 'ft_transfer_call',
          args: {
            receiver_id: receivingContract,
            amount: amount,
            msg: msg,
            ...memo,
          },
          attachedDeposit: 1,
        });
      },

      async contractUpgrade(wasmFile: string): Promise<any> {
        const code = readFileSync(wasmFile);
        // return contract.upgrade(code, '300000000000000');
        await account.functionCall({
          contractId: contractName,
          methodName: 'upgrade',
          args: {
            code: code,
          },
          attachedDeposit: 1,
          gas: '300000000000000',
        });
      },
    };

    return client;
  },
};

function localAccountPath(): string {
  return `${os.homedir()}/.near-credentials`;
}

function configFromNetwork(networkId: Network): ConnectConfig {
  const keyStore = isBrowser()
    ? new nearjs.keyStores.BrowserLocalStorageKeyStore()
    : new nearjs.keyStores.UnencryptedFileSystemKeyStore(localAccountPath());
  const config = {
    keyStore,
    networkId,
    headers: {},
  };

  switch (networkId) {
    case 'testnet':
      return {
        ...config,
        helperUrl: 'https://helper.testnet.near.org',
        nodeUrl: 'https://rpc.testnet.near.org',
        walletUrl: 'https://wallet.testnet.near.org',
      };
    case 'mainnet':
      return {
        ...config,
        helperUrl: 'https://helper.near.org',
        nodeUrl: 'https://rpc.mainnet.near.org',
        walletUrl: 'https://wallet.near.org',
      };
    default:
      throw new Error('Invalid network: ' + networkId);
  }
}
