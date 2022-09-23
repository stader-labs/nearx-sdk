# nearx-sdk

An sdk for for third party clients to programatically interact with nearx.

## Get Started

1. Add nearx-sdk to your package.json file. Pick the latest version(which is currently 0.2.0)
2. Run `near login` to import the private keys of your account to ~/.near-credentials directory. If you intend to interact with the mainnet contract then run `NEAR_ENV=mainnet near login`.

## Important Parameters
1. accountId: All the commands which performs a state change like stake, unstake and withdraw take in an accountId parameters.
2. network: Network can be either be mainnet or testnet. Mainnet option will perform the operations on v2-nearx.stader-labs.near contract and the testnet option will perform the operations on v2-nearx.staderlabs.testnet.

## Usage

#### To check a user's NEARX balance on mainnet contract
```javascript
export const getUserNearxBalance = async (
  network: Network,
  accountId: string
) => {
  const nearxPoolClient = await NearxPoolClient.create(network, accountId);

  return nearxPoolClient.getUserNearxBalance(accountId);
};
```

#### To check a user's account on mainnet contract
```javascript
export const getUserAccount = async (network: Network, accountId: string) => {
  const nearxPoolClient = await NearxPoolClient.create(network, accountId);

  return nearxPoolClient.getUserAccount(accountId);
};

```

### To get the NEARX price
```javascript
export const getNearxPrice = async (network: Network, accountId: string) => {
  const nearxPoolClient = await NearxPoolClient.create(network, accountId);

  return nearxPoolClient.getNearxPrice();
};

```

### To get the NEARX supply
```javascript
export const getTotalNearxSupply = async (
  network: Network,
  accountId: string
) => {
  const nearxPoolClient = await NearxPoolClient.create(network, accountId);

  return nearxPoolClient.getTotalNearxSupply();
};
```

### To get the total NEAR staked with the NEARX validator pool
```javascript
export const getTotalNearStaked = async (
  network: Network,
  accountId: string
) => {
  const nearxPoolClient = await NearxPoolClient.create(network, accountId);

  return nearxPoolClient.getTotalNearStaked();
};
```


#### To stake NEAR and get NEARX
```javascript
export const depositAndStake = async (
  network: Network,
  accountId: string,
  amount: string
) => {
  const nearxPoolClient = await NearxPoolClient.create(network, accountId);

  nearxPoolClient.depositAndStake(amount);
};
```

#### To unstake NEARX
```javascript
export const unstake = async (
  network: Network,
  accountId: string,
  amount: string
) => {
  const nearxPoolClient = await NearxPoolClient.create(network, accountId);

  nearxPoolClient.unstake(amount);
};
```
#### To unstake all NEARX
```javascript
export const unstakeAll = async (network: Network, accountId: string) => {
  const nearxPoolClient = await NearxPoolClient.create(network, accountId);

  nearxPoolClient.unstakeAll();
};
```

#### To withdraw your unstaked NEAR
```javascript
export const withdraw = async (
  network: Network,
  accountId: string,
  amount: string
) => {
  const nearxPoolClient = await NearxPoolClient.create(network, accountId);

  nearxPoolClient.withdraw(amount);
};
```
#### To withdraw all your unstaked NEAR
```javascript
export const withdrawAll = async (network: Network, accountId: string) => {
  const nearxPoolClient = await NearxPoolClient.create(network, accountId);

  nearxPoolClient.withdrawAll();
};
```
