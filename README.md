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

# Tabs

specific support tab view in env configuration file.

for example, show both transfer and NFT Tabs in widget.

`REACT_APP_FEATURES_SUPPORTED="Transfer|NFT"`


## Terra Wallet Support

Since the bridge widget supports terra wallet, you have to getChainOptions and populate `WalletProvider` before render. Otherwise, you will face app crash. You can refer src/index.js for usage.
