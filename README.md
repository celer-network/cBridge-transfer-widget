# cBridge-transfer-widget

Please refer doc here: https://cbridge-docs.celer.network/developer/cbridge-transfer-web-widget

## Testnet Env

testnet: .env.test
BAS testnet: .env.bas_testnet

using local env to run the project:

`$cp .env.test .env`


## Whitelist
whitelisted the support chains and tokens into chains_${env}.ts file

for example, add USDC to BSC Testnet chain .

```
bscTest: {
    name: "BSC Testnet",
    chainId: 97,
    rpcUrl: "https://bsc-testnet.nodereal.io/v1/bdc0906a6f534a4598cdb24425cc855a",
    iconUrl: "./bnbchain.png",
    symbol: "BNB",
    blockExplorerUrl: "https://testnet.bscscan.com",
    tokenSymbolList: ["USDC"], // USDC token to be whitelisted
    lqMintTokenSymbolBlackList: ["USDC"], // add if the token doesn't support liquidity pool
  }
```

## Add Bridge Functionality for Chain's Native Token

After you put native token symbol into token symbol whitelist, you will also have to configure it as a native token. 
To implement this, modify the following files. If you have any questions, you can refer this: 
https://github.com/celer-network/cBridge-transfer-widget/commit/b47a6e85eee480f8bb4440f13949766a2744369c

### Add below code snippets to .../src/components/transfer/TokenList.tsx
```
if (targetChainId === CHAIN_ID && tokenSymbol === CHAIN_NATIVE_TOKEN_SYMBOL) {
  return true;
}
```

### Add below code snippets to .../src/hooks/useNativeETHToken.ts
```
if (srcChain.id === CHAIN_ID && tokenInfo.token.symbol === CHAIN_NATIVE_TOKEN_SYMBOL) {
    nativeETHToken = true;
}
```

### Add below code snippets to .../src/views/History.tsx
```
if (item?.dst_received_info.chain.id === CHAIN_ID && item?.src_send_info?.token.symbol === CHAIN_NATIVE_TOKEN_SYMBOL) {
    shouldDisplayMetaMaskIcon = false;
}
```

## Tabs

specific support tab view in env configuration file.

for example, show both transfer and NFT Tabs in widget.

`REACT_APP_FEATURES_SUPPORTED="Transfer|NFT"`


## Terra Wallet Support

Since the bridge widget supports terra wallet, you have to getChainOptions and populate `WalletProvider` before render. Otherwise, you will face app crash. You can refer src/index.js for usage.

## Description of parameters in .env

`REACT_APP_NETWORK_ID` // 1: Production, 3: Testnet

`REACT_APP_SERVER_URL`  // Rest API endpoint url

`REACT_APP_NFT_CONFIG_URL` // MCNNFT config 

`REACT_APP_CLAIM_ID=1` // 1: Production 5: Testnet

`REACT_APP_ENV=MAINNET`  // MAINNET: Production Environment Test: Test Environment

`REACT_APP_ENV_TYPE=staging` // test, staging, mainnet

`REACT_APP_USER_BLACKLIST`=[]// The above address should be blocked through cBridge functionality

`REACT_APP_FEATURES_SUPPORTED` // "Transfer": Transfer supported only; "NFT": NFT supported only; "Transfer|NFT": Both Transfer and NFT are supported
