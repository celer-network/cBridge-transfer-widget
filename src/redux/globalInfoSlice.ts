import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/* eslint-disable no-debugger */
const globalInfoSlice = createSlice({
  name: "globalInfo",
  initialState: {
    cBridgeAddresses: "",
    cBridgeDesAddresses: "",
    refreshGlobalTokenBalance: false,
    isHistoryNotEmpty: false,
    oTContractAddr: "",
    oTContractAddrV2: "",
    pTContractAddr: "",
    pTContractAddrV2: "",
    fraxContractAddr: "0x90c97f71e18723b0cf0dfa30ee176ab653e89f40",
  },
  reducers: {
    setCBridgeAddresses: (state, { payload }: PayloadAction<string>) => {
      state.cBridgeAddresses = payload;
    },
    setCBridgeDesAddresses: (state, { payload }: PayloadAction<string>) => {
      state.cBridgeDesAddresses = payload;
    },

    setRefreshGlobalTokenBalance: state => {
      state.refreshGlobalTokenBalance = !state.refreshGlobalTokenBalance;
    },
    setIsHistoryNotEmpty: state => {
      state.isHistoryNotEmpty = true;
    },
    setOTContractAddr: (state, { payload }: PayloadAction<string>) => {
      state.oTContractAddr = payload;
    },
    setOTContractAddrV2: (state, { payload }: PayloadAction<string>) => {
      state.oTContractAddrV2 = payload;
    },
    setPTContractAddr: (state, { payload }: PayloadAction<string>) => {
      state.pTContractAddr = payload;
    },
    setPTContractAddrV2: (state, { payload }: PayloadAction<string>) => {
      state.pTContractAddrV2 = payload;
    },
    setFraxContractAddr: (state, { payload }: PayloadAction<string>) => {
      state.fraxContractAddr = payload;
    },
  },
});

export const {
  setCBridgeAddresses,
  setRefreshGlobalTokenBalance,
  setCBridgeDesAddresses,
  setIsHistoryNotEmpty,
  setOTContractAddr,
  setOTContractAddrV2,
  setPTContractAddr,
  setPTContractAddrV2,
  setFraxContractAddr,
} = globalInfoSlice.actions;

export default globalInfoSlice.reducer;
