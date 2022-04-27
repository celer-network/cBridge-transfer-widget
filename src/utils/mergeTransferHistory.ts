import _ from "lodash";
import { TransferHistoryStatus, TransferHistory } from "../constants/type";
import { storageConstants } from "../constants/const";
import { dataClone } from "../helpers/dataClone";

/* eslint-disable no-debugger */
interface TransactionHistoryMergeRequest {
  pageToken: number;
  historyList: TransferHistory[];
  localHistoryList: TransferHistory[];
  pageSize: number;
  address: string;
  /* eslint-disable-next-line */
  onChainResult: any[];
}

interface TransactionHistroryMerge {
  mergedHistoryList: TransferHistory[];
  historyActionNum: number;
  historyPendingNum: number;
  fetchedTransferHistory: boolean;
}

export const mergeTransactionHistory = (payload: TransactionHistoryMergeRequest): TransactionHistroryMerge => {
  const { pageToken, historyList, onChainResult, pageSize, localHistoryList } = payload;
  if (pageToken === undefined) {
    return { mergedHistoryList: [], historyActionNum: 0, historyPendingNum: 0, fetchedTransferHistory: true };
  }

  let comparePageToken = new Date().getTime();
  if (pageToken !== 0) {
    comparePageToken = pageToken;
  }

  onChainResult?.map((pItem, i) => {
    const localItem = localHistoryList[i];
    if (pItem) {
      localItem.txIsFailed = Number(pItem.status) !== 1; // set the status of Local Records
      if (localItem.status === TransferHistoryStatus.TRANSFER_SUBMITTING) {
        localItem.status = Number(pItem.status) === 1 ? localItem.status : TransferHistoryStatus.TRANSFER_FAILED;
      }
    }
    return pItem;
  });

  const newList = getTransferMergeList(historyList, localHistoryList, comparePageToken);

  if (newList.length > 0) {
    const paginationList: TransferHistory[][] = _.chunk(newList, pageSize);
    const currentPageList = paginationList[0];
    const { actionNum, pendingNum } = getTransferActionNum(currentPageList);

    return {
      mergedHistoryList: currentPageList,
      historyActionNum: actionNum,
      historyPendingNum: pendingNum,
      fetchedTransferHistory: true,
    };
  }
  return { mergedHistoryList: [], historyActionNum: 0, historyPendingNum: 0, fetchedTransferHistory: true };
};

const getTransferMergeList = (historyList, localHistory, comparePageToken) => {
  const localTransferIds = localHistory.map(history => {
    return history.transfer_id;
  });
  const localTransferListStr = localStorage.getItem(storageConstants.KEY_TRANSFER_LIST_JSON);
  let otherAddressTransferHistoryList: TransferHistory[] = [];
  if (localTransferListStr) {
    otherAddressTransferHistoryList = JSON.parse(localTransferListStr) as TransferHistory[];
  }
  otherAddressTransferHistoryList = otherAddressTransferHistoryList.filter(transferHistory => {
    return !localTransferIds.includes(transferHistory.transfer_id);
  });

  const [mergedHistoryList, localKeepHistoryList] = handleLocalHistory(historyList, localHistory, comparePageToken); // Get processed local list
  localStorage.setItem(
    storageConstants.KEY_TRANSFER_LIST_JSON,
    JSON.stringify(otherAddressTransferHistoryList.concat(localKeepHistoryList)),
  );
  mergedHistoryList.sort((a, b) => Number(b.ts) - Number(a.ts));
  return mergedHistoryList;
};

const getTransferActionNum = newList => {
  let actionNum = 0;
  let pendingNum = 0;
  newList?.forEach(item => {
    if (
      item.status === TransferHistoryStatus.TRANSFER_TO_BE_REFUNDED ||
      item.status === TransferHistoryStatus.TRANSFER_REFUND_TO_BE_CONFIRMED ||
      isToBeConfirmRefund(item)
    ) {
      actionNum += 1;
    }
    if (
      item.status !== TransferHistoryStatus.TRANSFER_UNKNOWN &&
      item.status !== TransferHistoryStatus.TRANSFER_FAILED &&
      item.status !== TransferHistoryStatus.TRANSFER_REFUNDED &&
      item.status !== TransferHistoryStatus.TRANSFER_COMPLETED
    ) {
      pendingNum += 1;
    }
  });
  return { actionNum, pendingNum };
};

const handleLocalHistory = (historyList, localHistory, comparePageToken) => {
  if (!localHistory || localHistory?.length === 0) {
    return [historyList, []];
  }

  const combineHistoryList: TransferHistory[] = [];
  const remainingLocalHistoryList: TransferHistory[] = [];
  const remainingRemoteHistoryList: TransferHistory[] = [];

  const copyedLocalHistoryList: TransferHistory[] = dataClone(localHistory);
  const copyedRemoteHistoryList: TransferHistory[] = dataClone(historyList);

  const localKeepHistoryList: TransferHistory[] = [];

  copyedRemoteHistoryList?.forEach(remoteItem => {
    copyedLocalHistoryList?.forEach(localItem => {
      if (remoteItem.transfer_id === localItem.transfer_id) {
        if (
          localItem.status === TransferHistoryStatus.TRANSFER_CONFIRMING_YOUR_REFUND &&
          remoteItem.status === TransferHistoryStatus.TRANSFER_REFUND_TO_BE_CONFIRMED
        ) {
          combineHistoryList.push(localItem);

          const keepedTransferIds = localKeepHistoryList.map(it => it.transfer_id);
          if (!keepedTransferIds.includes(localItem.transfer_id)) {
            localKeepHistoryList.push(localItem);
          }
        } else {
          combineHistoryList.push(remoteItem);
        }
      }
    });
  });

  copyedLocalHistoryList.forEach(localItem => {
    const combinedTransferIds = combineHistoryList.map(it => it.transfer_id);
    if (!combinedTransferIds.includes(localItem.transfer_id)) {
      localKeepHistoryList.push(localItem);
      if (Number(localItem.ts) < Number(comparePageToken)) {
        remainingLocalHistoryList.push(localItem);
      }
    }
  });

  copyedRemoteHistoryList.forEach(remoteItem => {
    const combinedTransferIds = combineHistoryList.map(it => it.transfer_id);
    if (!combinedTransferIds.includes(remoteItem.transfer_id)) {
      remainingRemoteHistoryList.push(remoteItem);
    }
  });

  const mergedHistoryList = [...remainingLocalHistoryList, ...combineHistoryList, ...remainingRemoteHistoryList];

  return [mergedHistoryList, localKeepHistoryList];
};

export const isToBeConfirmRefund = (history: TransferHistory) => {
  if (history.status === TransferHistoryStatus.TRANSFER_REFUND_TO_BE_CONFIRMED) {
    return true;
  }
  if (history.txIsFailed && history.status === TransferHistoryStatus.TRANSFER_CONFIRMING_YOUR_REFUND) {
    return true;
  }

  return false;
};
