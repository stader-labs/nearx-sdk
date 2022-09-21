import type { Arguments, CommandBuilder } from 'yargs';
import { NearxPoolClient, Network } from '..';

export const command: string = 'unstake';
export const desc: string = 'Unstake from stader';

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
  console.log(`Unstaking ${argv.amount} from ${argv.accountId}`);

  const nearxPoolClient = await NearxPoolClient.create(
    argv.network as Network,
    argv.accountId as string,
  );

  nearxPoolClient.unstake(argv.amount as string);
};
