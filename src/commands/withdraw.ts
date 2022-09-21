import type { Arguments, CommandBuilder } from 'yargs';
import { NearxPoolClient, Network } from '..';

export const command: string = 'withdraw';
export const desc: string = 'Withdraw unstaked funds from stader';

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
  console.log(`Withdrawing ${argv.amount} from ${argv.accountId}`);

  const nearxPoolClient = await NearxPoolClient.create(
    argv.network as Network,
    argv.accountId as string,
  );

  nearxPoolClient.withdraw(argv.amount as string);
};
