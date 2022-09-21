import { NearxPoolClient, Network } from '..';

export const depositAndStake = async (
  network: Network,
  accountId: string,
  amount: string
) => {
  const nearxPoolClient = await NearxPoolClient.new(network, accountId);

  nearxPoolClient.depositAndStake(amount);
};

export const unstakeAll = async (network: Network, accountId: string) => {
  const nearxPoolClient = await NearxPoolClient.new(network, accountId);

  nearxPoolClient.unstakeAll();
};

export const unstake = async (
  network: Network,
  accountId: string,
  amount: string
) => {
  const nearxPoolClient = await NearxPoolClient.new(network, accountId);

  nearxPoolClient.unstake(amount);
};

export const withdrawAll = async (network: Network, accountId: string) => {
  const nearxPoolClient = await NearxPoolClient.new(network, accountId);

  nearxPoolClient.withdrawAll();
};

export const withdraw = async (
  network: Network,
  accountId: string,
  amount: string
) => {
  const nearxPoolClient = await NearxPoolClient.new(network, accountId);

  nearxPoolClient.withdraw(amount);
};
