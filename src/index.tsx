import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";
import { QueryClient, QueryClientProvider } from "react-query";
import store, { persistor } from "./redux/store";
import App from "./app/App";
import { Web3ContextProvider } from "./providers/Web3ContextProvider";
import { ContractsContextProvider } from "./providers/ContractsContextProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <QueryClientProvider client={queryClient}>
        <HashRouter>
          <Web3ContextProvider>
            <ContractsContextProvider>
              <App />
            </ContractsContextProvider>
          </Web3ContextProvider>
        </HashRouter>
      </QueryClientProvider>
    </PersistGate>
  </Provider>,
  document.getElementById("root"),
);
