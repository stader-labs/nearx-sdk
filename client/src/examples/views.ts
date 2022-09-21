import { Network } from "..";
import { NearxPoolClient } from "../nearx-pool-client";

const getUserAccount = async (network: Network, accountId: string) => {
  const nearxPoolClient = await NearxPoolClient.new(network, accountId);

  return nearxPoolClient.getUserAccount(accountId);
};

const getNearxPrice = async (network: Network, accountId: string) => {
  const nearxPoolClient = await NearxPoolClient.new(network, accountId);

  return nearxPoolClient.getNearxPrice();
};

const getTotalNearxSupply = async (network: Network, accountId: string) => {
  const nearxPoolClient = await NearxPoolClient.new(network, accountId);

  return nearxPoolClient.getTotalNearxSupply();
};

const getTotalNearStaked = async (network: Network, accountId: string) => {
  const nearxPoolClient = await NearxPoolClient.new(network, accountId);

  return nearxPoolClient.getTotalNearStaked();
};

const getUserNearxBalance = async (network: Network, accountId: string) => {
  const nearxPoolClient = await NearxPoolClient.new(network, accountId);

  return nearxPoolClient.getUserNearxBalance(accountId);
};
