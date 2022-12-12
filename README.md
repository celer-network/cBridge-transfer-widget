# cBridge-transfer-widget

Please refer doc here: https://cbridge-docs.celer.network/developer/cbridge-transfer-web-widget

# Testnet Env

testnet: .env.test
BAS testnet: .env.bas_testnet

using local env to run the project:

`$cp .env.test .env`


# Whitelist
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

# Tabs

specific support tab view in env configuration file.

for example, show both transfer and NFT Tabs in widget.

`REACT_APP_FEATURES_SUPPORTED="Transfer|NFT"`


## Terra Wallet Support

Since the bridge widget supports terra wallet, you have to getChainOptions and populate `WalletProvider` before render. Otherwise, you will face app crash. You can refer src/index.js for usage.

# Description of parameters in .env

REACT_APP_NETWORK_ID // 1: Production, 3: Testnet

REACT_APP_SERVER_URL  // Rest API endpoint url

REACT_APP_GRPC_SERVER_URL // GRPC request endpoint

REACT_APP_SERVER_URL_CHECK // Rest API endpoint url for early version of cBridge

REACT_APP_GRPC_SERVER_URL_CHECK // Deprecated

REACT_APP_NFT_CONFIG_URL // MCNNFT config 

REACT_APP_MAINNET_ID=1 // Deprecated

REACT_APP_CLAIM_ID=1 // 1: Production 5: Testnet

REACT_APP_BSC_ID=56 // 56: BSC Production 97: BSC Testnet

REACT_APP_ARBITRUM_ID=42161 // Deprecated

REACT_APP_GOERLI_ID=5 // Deprecated

REACT_APP_ROPSTEN_ID=3 // Deprecated

REACT_APP_ENV=MAINNET  // MAINNET: Production Environment Test: Test Environment

REACT_APP_ENV_TYPE=staging // test, staging, mainnet

REACT_APP_USER_BLACKLIST=["0x098b716b8aaf21512996dc57eb0615e2383e2f96","0x7ff9cfad3877f21d41da833e2f775db0569ee3d9","0x19aa5fe80d33a56d56c78e82ea5e50e5d80b4dff","0x1da5821544e25c636c1417ba96ade4cf6d2f9b5a","0x2f389ce8bd8ff92de3402ffce4691d17fc4f6535","0x308ed4b7b49797e1a98d3818bff6fe5385410370","0x3cbded43efdaf0fc77b9c55f6fc9988fcc9b757d","0x48549a34ae37b12f6a30566245176994e17c6b4a","0x5512d943ed1f7c8a43f3435c85f7ab68b30121b0","0x67d40ee1a85bf4a4bb7ffae16de985e8427b6b45","0x6acdfba02d390b97ac2b2d42a63e85293bcc160e","0x6f1ca141a28907f78ebaa64fb83a9088b02a8352","0x72a5843cc08275c8171e582972aa4fda8c397b2a","0x7db418b5d567a4e0e8c59ad71be1fce48f3e6107","0x7f19720a857f834887fc9a7bc0a0fbe7fc7f8102","0x7f367cc41522ce07553e823bf3be79a889debe1b","0x8576acc5c05d6ce88f4e49bf65bdf0c62f91353c","0x901bb9583b24d97e995513c6778dc6888ab6870e","0x9f4cda013e354b8fc285bf4b9a60460cee7f7ea9","0xa7e5d5a720f06526557c513402f2e6b5fa20b008","0xc455f7fd3e0e12afd51fba5c106909934d8a0e4a","0xd882cfc20f52f2599d84b8e8d58c7fb62cfe344b","0xe7aa314c77f4233c18c6cc84384a9247c0cf367b","0xfec8a60023265364d066a1212fde3930f6ae8da7"]
// The above address should be blocked through cBridge functionality

REACT_APP_FEATURES_SUPPORTED // "Transfer": Transfer supported only; "NFT": NFT supported only; "Transfer|NFT": Both Transfer and NFT are supported
