import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { storageConstants } from "../constants/const";

interface IRewardSectionState {
  hasEvents: boolean;
}

const initialState: IRewardSectionState = {
  hasEvents: localStorage.getItem(storageConstants.KEY_HAS_REWARD_EVENTS) === "true",
};

const rewardSectionSlice = createSlice({
  name: "rewardSection",
  initialState,
  reducers: {
    setHasEvents: (state, { payload }: PayloadAction<boolean>) => {
      state.hasEvents = payload;
      localStorage.setItem(storageConstants.KEY_HAS_REWARD_EVENTS, `${payload}`);
    },
  },
});

export const { setHasEvents } = rewardSectionSlice.actions;

export default rewardSectionSlice.reducer;
