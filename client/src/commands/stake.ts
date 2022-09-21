import type { Arguments, CommandBuilder } from 'yargs';
import { Network } from '..';
import { NearxPoolClient } from "./../nearx-pool-client";

export const command: string = 'stake';
export const desc: string = 'stake with NEARX';

export const builder: CommandBuilder = (yargs) =>
  yargs
    .option('accountId', {
      demandOption: true,
      type: 'string',
    })
    .option('amount', {
      demandOption: true,
      type: 'string',
    })
    .option('network', {
      demandOption: true,
      type: 'string',
      choices: ['testnet', 'mainnet'],
    });

export const handler = async (argv: Arguments) => {
  console.log('args are ');
  console.log(argv.accountId);
  console.log(argv.amount);
  console.log(argv.network);

  const nearxPoolClient = await NearxPoolClient.new(
    argv.network as Network,
    argv.accountId as string,
  );

  nearxPoolClient.depositAndStake(argv.amount as string);
};
