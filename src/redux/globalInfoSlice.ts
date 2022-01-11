import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/* eslint-disable no-debugger */
const globalInfoSlice = createSlice({
  name: "globalInfo",
  initialState: {
    cBridgeAddresses: "",
    lpCBridgeAddresses: "",
    cBridgeDesAddresses: "",
    faucetAddresses: {
      3: "0x584ee85a7bb588a0143ad8d25039b58b05eea5c4",
      5: "0x50B96c4374EFeEA0C183D06679A14e951E33B4Dd",
      69: "0x81ECac0D6Be0550A00FF064a4f9dd2400585FE9c",
      97: "0x265B25e22bcd7f10a5bD6E6410F10537Cc7567e8",
      4002: "0x265B25e22bcd7f10a5bD6E6410F10537Cc7567e8",
      43113: "0x9D233A907E065855D2A9c7d4B552ea27fB2E5a36",
      44787: "0x841ce48F9446C8E281D3F1444cB859b4A6D0738C",
    },
    farmingRewardAddresses: "",
    refreshGlobalTokenBalance: false,
    isHistoryNotEmpty: false,
    isLPNotEmpty: false,
    oTContractAddr: "",
    pTContractAddr: "",
    fraxContractAddr: "0x90c97f71e18723b0cf0dfa30ee176ab653e89f40",
  },
  reducers: {
    setCBridgeAddresses: (state, { payload }: PayloadAction<string>) => {
      state.cBridgeAddresses = payload;
    },
    setlpCBridgeAddresses: (state, { payload }: PayloadAction<string>) => {
      state.lpCBridgeAddresses = payload;
    },
    setCBridgeDesAddresses: (state, { payload }: PayloadAction<string>) => {
      state.cBridgeDesAddresses = payload;
    },
    setFarmingRewardAddresses: (state, { payload }: PayloadAction<string>) => {
      state.farmingRewardAddresses = payload;
    },
    setRefreshGlobalTokenBalance: state => {
      state.refreshGlobalTokenBalance = !state.refreshGlobalTokenBalance;
    },
    setIsHistoryNotEmpty: state => {
      state.isHistoryNotEmpty = true;
    },
    setIsLPNotEmpty: state => {
      state.isLPNotEmpty = true;
    },
    setOTContractAddr: (state, { payload }: PayloadAction<string>) => {
      state.oTContractAddr = payload;
    },
    setPTContractAddr: (state, { payload }: PayloadAction<string>) => {
      state.pTContractAddr = payload;
    },
    setFraxContractAddr: (state, { payload }: PayloadAction<string>) => {
      state.fraxContractAddr = payload;
    },
  },
});

export const {
  setCBridgeAddresses,
  setlpCBridgeAddresses,
  setFarmingRewardAddresses,
  setRefreshGlobalTokenBalance,
  setCBridgeDesAddresses,
  setIsHistoryNotEmpty,
  setIsLPNotEmpty,
  setOTContractAddr,
  setPTContractAddr,
  setFraxContractAddr,
} = globalInfoSlice.actions;

export default globalInfoSlice.reducer;
