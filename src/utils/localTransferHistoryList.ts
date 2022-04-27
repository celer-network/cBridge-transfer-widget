import { storageConstants } from "../constants/const";
import { TransferHistory } from "../constants/type";

export const filteredLocalTransferHistory = (addresses: string[]) => {
  const addressesWithoutEmptyString = addresses.filter(address => {
    return address.length > 0;
  });

  try {
    const localTransferListStr = localStorage.getItem(storageConstants.KEY_TRANSFER_LIST_JSON);
    let transferHistoryList: TransferHistory[] = [];
    if (localTransferListStr) {
      transferHistoryList = JSON.parse(localTransferListStr) as TransferHistory[];
    }

    let result: TransferHistory[];
    if (addressesWithoutEmptyString.length === 0) {
      result = [];
    } else if (addressesWithoutEmptyString.length === 1) {
      result = transferHistoryList.filter(transferHistory => {
        return (
          addressesWithoutEmptyString.includes(transferHistory.dstAddress) ||
          addressesWithoutEmptyString.includes(transferHistory.srcAddress)
        );
      });
    } else {
      result = transferHistoryList.filter(transferHistory => {
        return (
          addressesWithoutEmptyString.includes(transferHistory.dstAddress) &&
          addressesWithoutEmptyString.includes(transferHistory.srcAddress)
        );
      });
    }

    return result;
  } catch (error) {
    const cleanHistory: TransferHistory[] = [];
    localStorage.setItem(storageConstants.KEY_TRANSFER_LIST_JSON, JSON.stringify(cleanHistory));
    return [];
  }
};
