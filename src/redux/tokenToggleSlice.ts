import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IWindowWidthState {
  IsShow: boolean;
}

const initialState: IWindowWidthState = {
  IsShow: false,
};

const tokenToggleSlice = createSlice({
  name: "tokenToggle",
  initialState,
  reducers: {
    saveShow: (state, { payload }: PayloadAction<{ IsShow: boolean }>) => {
      state.IsShow = payload.IsShow;
    },
  },
});

export const { saveShow } = tokenToggleSlice.actions;

export default tokenToggleSlice.reducer;
