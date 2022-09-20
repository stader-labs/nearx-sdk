const nearjs = require('near-api-js');

import { ConnectConfig } from 'near-api-js';
import * as os from 'os';
import {
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
  async new(networkId: Network, accountId: string): Promise<NearxPoolClient> {
    // Depending on being in the browser or not,
    // the config is set from a local keystore or the browser wallet:
    const config = configFromNetwork(networkId);
    // Connect to NEAR:
    const near = await nearjs.connect(config);

    let contract: NearxContract;

    let contractName = 'v2-nearx.stader-labs.near';
    if (networkId === 'testnet') {
      contractName = 'v2-nearx.staderlabs.testnet';
    }

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
      async getValidators(): Promise<ValidatorInfo[]> {
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
      async storageDeposit(): Promise<void> {
        await contract.storage_deposit({
          args: {},
          amount: '2500000000000000000000',
        });
      },

      async depositAndStake(amount: string): Promise<void> {
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
      },

      async unstake(amount: string): Promise<void> {
        await contract.unstake({
          args: {
            amount: amount,
          },
        });
      },

      async unstakeAll(): Promise<void> {
        await contract.unstake_all({
          args: {},
        });
      },

      async withdraw(amount: string): Promise<void> {
        await contract.withdraw({
          args: {
            amount: amount,
          },
        });
      },

      async withdrawAll(): Promise<void> {
        await contract.withdraw_all({
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
