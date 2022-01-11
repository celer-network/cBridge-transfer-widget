/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GetTransferConfigsResponse } from "../constants/type";

/* eslint-disable camelcase */
/* eslint-disable no-debugger */

interface TransferIState {
  config: GetTransferConfigsResponse;
}

const initialState: TransferIState = {
  config: {
    chains: [],
    chain_token: {},
    farming_reward_contract_addr: "",
    pegged_pair_configs: [],
  },
};

const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    setConfig: (state, { payload }: PayloadAction<GetTransferConfigsResponse>) => {
      state.config = payload;
    },
  },
});

export const { setConfig } = configSlice.actions;

export default configSlice.reducer;
