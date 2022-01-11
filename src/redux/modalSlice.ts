import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// eslint-disable-next-line no-shadow
export enum ModalName {
  provider = "showProviderModal",
  history = "showHistoryModal",
  transfer = "showTransferModal",
  rate = "showRateModal",
  menu = "showMenuModal",
  unclaimedRewards = "showUnclaimedRewardsModal",
  yourLiquidity = "showYourLiquidity",
}

interface IModalState {
  showProviderModal: boolean;
  showHistoryModal: boolean;
  showTransferModal: boolean;
  showRateModal: boolean;
  showMenuModal: boolean;
  showUnclaimedRewardsModal: boolean;
  showYourLiquidity: boolean;
}

const initialState: IModalState = {
  showProviderModal: false,
  showHistoryModal: false,
  showTransferModal: false,
  showRateModal: false,
  showMenuModal: false,
  showUnclaimedRewardsModal: false,
  showYourLiquidity: false,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, { payload }: PayloadAction<ModalName>) => {
      state[payload] = true;
    },
    closeModal: (state, { payload }: PayloadAction<ModalName>) => {
      state[payload] = false;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;

export default modalSlice.reducer;
