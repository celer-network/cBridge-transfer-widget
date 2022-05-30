import { combineReducers, configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { PERSIST, persistReducer, persistStore } from "redux-persist";
import createMigrate from "redux-persist/es/createMigrate";
import storage from "redux-persist/lib/storage";
import modalSlice from "./modalSlice";
import assetSlice from "./assetSlice";
import globalInfoSlice from "./globalInfoSlice";
import tokenToggleSlice from "./tokenToggleSlice";
import transferSlice from "./transferSlice";
import windowWidthSlice from "./windowWidthSlice";
import configSlice from "./configSlice";
import rewardSectionSlice from "./rewardSectionSlice";

const rootReducer = combineReducers({
  modal: modalSlice,
  asset: assetSlice,
  transferInfo: transferSlice,
  globalInfo: globalInfoSlice,
  tokenToggle: tokenToggleSlice,
  windowWidth: windowWidthSlice,
  config: configSlice,
  rewardSection: rewardSectionSlice,
});

const migrations = {
  // rename layer1Transactions to persistedTx
  0: state => {
    const { layer1Transactions, ...otherState } = state;
    return {
      ...otherState,
      persistedTx: {
        depositTxs: layer1Transactions.transactions,
      },
    };
  },
  // change withdrawConfirmationTimes type
  1: state => {
    return {
      ...state,
      persistedTx: {
        ...state.persistedTx,
        withdrawConfirmationTimes: {},
      },
    };
  },
};

const persistConfig = {
  key: "root",
  storage,
  version: 2,
  whitelist: ["persistedTx"],
  migrate: createMigrate(migrations, { debug: process.env.REACT_APP_NETWORK_ID !== "1" }),
};

const store = configureStore({
  reducer: persistReducer(persistConfig, rootReducer),
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [PERSIST],
    },
  }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
