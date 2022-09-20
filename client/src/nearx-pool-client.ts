const nearjs = require('near-api-js');

import { ConnectConfig } from 'near-api-js';
import * as os from 'os';
import {
  Balance,
  NearxAccount,
  NearxPoolClient as Iface,
  NearxStakePoolAccount,
  Network,
  StorageBalance,
  ValidatorInfo,
} from '.';
import { createContract, NearxContract } from './contract';
import { isBrowser } from './utils';

type NearxPoolClient = Iface;
export const NearxPoolClient = {
  async new(
    networkId: 'testnet' | 'mainnet',
    contractName: string,
    accountId: string,
  ): Promise<NearxPoolClient> {
    // Depending on being in the browser or not,
    // the config is set from a local keystore or the browser wallet:
    const config = configFromNetwork(networkId);
    // Connect to NEAR:
    const near = await nearjs.connect(config);

    let contract: NearxContract;

    if (accountId == null) {
      throw new Error('When used in a CLI, the accountId must be specified');
    }
    // Use the previously set keystore:
    const account = new nearjs.Account(near.connection, accountId);

    contract = createContract(account, contractName);

    const client = {
      near,
      config,
      contract,

      // View methods:
      async stakedBalance(): Promise<Balance> {
        return BigInt(
          await contract.get_account_staked_balance({
            account_id: accountId,
          }),
        );
      },
      async totalBalance(): Promise<Balance> {
        return BigInt(
          await contract.get_account_total_balance({
            account_id: accountId,
          }),
        );
      },

      async validators(): Promise<ValidatorInfo[]> {
        return contract.get_validators({});
      },

      async getUserAccount(user: string): Promise<NearxAccount> {
        return contract.get_user_account({
          account_id: user,
        });
      },

      async getNearxPrice(): Promise<string> {
        return contract.get_nearx_price({});
      },

      async getTotalNearxSupply(): Promise<string> {
        return contract.ft_total_supply({});
      },

      async getTotalNearStaked(): Promise<string> {
        return contract.get_total_staked_balance({});
      },

      async getUserStakePoolAccount(user: string): Promise<NearxStakePoolAccount> {
        return contract.get_account({
          account_id: user,
        });
      },

      async getUserNearxBalance(user: string): Promise<string> {
        return contract.ft_balance_of({
          account_id: user,
        });
      },

      async getStorageBalance(user: string): Promise<StorageBalance | null> {
        return contract.storage_balance_of({
          account_id: user,
        });
      },

      // User-facing methods:
      async storageDeposit(): Promise<string> {
        return contract.storage_deposit({
          args: {},
          amount: '2500000000000000000000',
        });
      },

      async depositAndStake(amount: string): Promise<string> {
        // First check storage deposit and then stake, use batch transactions
        const storageBalance = await contract.storage_balance_of({
          account_id: accountId,
        });

        let actions = [];

        if (!storageBalance) {
          // add storage_deposit
          actions.push(
            nearjs.transactions.functionCall(
              'storage_deposit',
              Buffer.from(JSON.stringify({})),
              10000000000000,
              // We need to pay 0.0025N for storage deposit
              '2500000000000000000000',
            ),
          );
        }

        actions.push(
          nearjs.transactions.functionCall(
            'deposit_and_stake',
            Buffer.from(JSON.stringify({})),
            10000000000000,
            amount,
          ),
        );

        await account.signAndSendTransaction({
          receiverId: contractName,
          actions,
        });

        return '';
      },

      async unstake(amount: string): Promise<string> {
        return contract.unstake({
          args: {
            amount: amount,
          },
        });
      },

      async unstakeAll(): Promise<string> {
        return contract.unstake_all({
          args: {},
        });
      },

      async withdraw(amount: string): Promise<string> {
        return contract.withdraw({
          args: {
            amount: amount,
          },
        });
      },

      async withdrawAll(): Promise<string> {
        return contract.withdraw_all({
          args: {},
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
