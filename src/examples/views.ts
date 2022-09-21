import { NearxPoolClient, Network } from '..';

export const getUserAccount = async (network: Network, accountId: string) => {
  const nearxPoolClient = await NearxPoolClient.new(network, accountId);

  return nearxPoolClient.getUserAccount(accountId);
};

export const getNearxPrice = async (network: Network, accountId: string) => {
  const nearxPoolClient = await NearxPoolClient.new(network, accountId);

  return nearxPoolClient.getNearxPrice();
};

export const getTotalNearxSupply = async (
  network: Network,
  accountId: string
) => {
  const nearxPoolClient = await NearxPoolClient.new(network, accountId);

  return nearxPoolClient.getTotalNearxSupply();
};

export const getTotalNearStaked = async (
  network: Network,
  accountId: string
) => {
  const nearxPoolClient = await NearxPoolClient.new(network, accountId);

  return nearxPoolClient.getTotalNearStaked();
};

export const getUserNearxBalance = async (
  network: Network,
  accountId: string
) => {
  const nearxPoolClient = await NearxPoolClient.new(network, accountId);

  return nearxPoolClient.getUserNearxBalance(accountId);
};
