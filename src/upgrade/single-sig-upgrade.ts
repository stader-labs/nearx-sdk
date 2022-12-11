import { NearxPoolClient } from '..';

export const upgrade = async (
  fileName: string,
  environment: 'testnet' | 'mainnet',
  accountId: string,
) => {
  const nearxPoolClient = await NearxPoolClient.create(environment, accountId);
  await nearxPoolClient.contractUpgrade(fileName);
};