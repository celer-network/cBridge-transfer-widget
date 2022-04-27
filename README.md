# cBridge-transfer-widget

Please refer doc here: https://cbridge-docs.celer.network/developer/cbridge-transfer-web-widget

## Terra Wallet Support

Since the bridge widget supports terra wallet, you have to getChainOptions and populate `WalletProvider` before render. Otherwise, you will face app crash. You can refer src/index.js for usage.
