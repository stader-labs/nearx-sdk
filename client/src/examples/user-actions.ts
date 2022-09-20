import { Network } from '..';
import { NearxPoolClient } from '../nearx-pool-client';

const depositAndStake = async (network: Network, accountId: string, amount: string) => {
  const nearxPoolClient = await NearxPoolClient.new(network, accountId);

  nearxPoolClient.depositAndStake(amount);
};

const unstakeAll = async (network: Network, accountId: string) => {
  const nearxPoolClient = await NearxPoolClient.new(network, accountId);

  nearxPoolClient.unstakeAll();
};

const unstake = async (network: Network, accountId: string, amount: string) => {
  const nearxPoolClient = await NearxPoolClient.new(network, accountId);

  nearxPoolClient.unstake(amount);
};

const withdrawAll = async (network: Network, accountId: string) => {
  const nearxPoolClient = await NearxPoolClient.new(network, accountId);

  nearxPoolClient.withdrawAll();
};

const withdraw = async (network: Network, accountId: string, amount: string) => {
  const nearxPoolClient = await NearxPoolClient.new(network, accountId);

  nearxPoolClient.withdraw(amount);
};