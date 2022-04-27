import ReactDOM from 'react-dom';
import App from './App';
import { WalletProvider, getChainOptions } from "@terra-money/wallet-provider";

/// Since cBridge transfer widget supports Terra wallet, we need to get terra chain options before rendering
getChainOptions().then(chainOptions => {
  ReactDOM.render(
    /* eslint-disable-next-line */
    <WalletProvider {...chainOptions}>
      <App />
    </WalletProvider>,
    document.getElementById('root')
  )
})

