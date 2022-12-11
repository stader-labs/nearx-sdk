import { appendFileSync, readFileSync } from 'fs';
import { NearxPoolClient, Network } from '..';
const { NEAR } = require('near-units');

export const proposeUpgrade = async (
  wasmFile: string,
  network: Network,
  contract: string,
  accountId: string,
  dao: string,
  version: number
) => {
  const code = readFileSync(wasmFile);
  console.log(`Upgrading contract ${contract}`);

  const nearxPoolClient = await NearxPoolClient.create(network, accountId);
  const account = await nearxPoolClient.near.account('stader-labs.near');

  // store blob first
  const outcome = await account.functionCall({
    contractId: dao,
    methodName: 'store_blob',
    args: code,
    gas: 100000000000000,
    attachedDeposit: '5851280000000000000000000',
  });
  const hash = parseHashReturnValue(outcome);
  console.log('blob hash', hash);

  // save blob hash to local file
  appendFileSync(`blobhash-${network}`, hash);

  const proposalArgs = {
    proposal: {
      description: `Upgrade nearx contract to ${version}`,
      kind: {
        UpgradeRemote: {
          receiver_id: contract,
          method_name: 'upgrade',
          hash,
        },
      },
    },
  };
  console.log(JSON.stringify(proposalArgs, undefined, 4));

  await account.functionCall({
    contractId: dao,
    methodName: 'add_proposal',
    args: proposalArgs,
    attachedDeposit: NEAR.parse('0.1'),
  });

  console.log('proposed!');
};

function parseHashReturnValue(outcome: any) {
  const status = outcome.status;
  const data = status.SuccessValue;
  if (!data) {
    throw new Error('bad return value');
  }

  const buff = Buffer.from(data, 'base64');
  return buff.toString('ascii').replaceAll('"', '');
}
