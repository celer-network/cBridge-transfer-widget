import './App.css';
import CBridgeTransferWidget from './cBridgeTransferWidget';
import { Provider } from "react-redux";
import store from "./redux/store";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <Provider store={store}>
        <CBridgeTransferWidget />
      </Provider> 
    </div>
  );
}

export default App;
