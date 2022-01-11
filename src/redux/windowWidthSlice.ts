import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IWindowWidthState {
  isMobile: boolean;
}

const initialState: IWindowWidthState = {
  isMobile: false,
};

const windowWidthSlice = createSlice({
  name: "windowWidth",
  initialState,
  reducers: {
    saveWidth: (state, { payload }: PayloadAction<{ winWidth: number }>) => {
      state.isMobile = payload.winWidth <= 768;
    },
  },
});

export const { saveWidth } = windowWidthSlice.actions;

export default windowWidthSlice.reducer;
