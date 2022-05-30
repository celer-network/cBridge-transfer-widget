import _ from "lodash";
import { NFTHistory, NFTBridgeStatus } from "../constants/type";
import { storageConstants } from "../constants/const";
import { dataClone } from "../helpers/dataClone";

/* eslint-disable no-debugger */
interface NFTHistoryMergeRequest {
  pageToken: number;
  historyList: NFTHistory[];
  localHistoryList: NFTHistory[];
  pageSize: number;
  address: string;
  /* eslint-disable-next-line */
  onChainResult: any[];
}

interface NFTHistroryMerge {
  mergedHistoryList: NFTHistory[];
  historyActionNum: number;
  historyPendingNum: number;
  fetchedNFTHistory: boolean;
}

export const mergeNFTHistory = (payload: NFTHistoryMergeRequest): NFTHistroryMerge => {
  const { pageToken, historyList, address, onChainResult, pageSize, localHistoryList } = payload;
  if (pageToken === undefined || !address) {
    return { mergedHistoryList: [], historyActionNum: 0, historyPendingNum: 0, fetchedNFTHistory: true };
  }

  let comparePageToken = new Date().getTime();
  if (pageToken !== 0) {
    comparePageToken = pageToken;
  }

  onChainResult?.map((pItem, i) => {
    const localItem = localHistoryList[i];
    if (pItem) {
      localItem.txIsFailed = Number(pItem.status) !== 1; // set the status of Local Records
      if (localItem.status === NFTBridgeStatus.NFT_BRIDEGE_SUBMITTING) {
        localItem.status = Number(pItem.status) === 1 ? localItem.status : NFTBridgeStatus.NFT_BRIDGE_FAILED;
      }
    }
    return pItem;
  });

  const newList = getTransferMergeList(historyList, localHistoryList, comparePageToken, address);

  if (newList.length > 0) {
    const paginationList: NFTHistory[][] = _.chunk(newList, pageSize);
    const currentPageList = paginationList[0];
    const { actionNum, pendingNum } = getTransferActionNum(currentPageList);

    return {
      mergedHistoryList: currentPageList,
      historyActionNum: actionNum,
      historyPendingNum: pendingNum,
      fetchedNFTHistory: true,
    };
  }
  return { mergedHistoryList: [], historyActionNum: 0, historyPendingNum: 0, fetchedNFTHistory: true };
};

const getTransferMergeList = (historyList, localHistory, comparePageToken, address) => {
  const [mergedHistoryList, localKeepHistoryList] = handleLocalHistory(historyList, localHistory, comparePageToken); // Get processed local list
  const newJson = { [address]: localKeepHistoryList };
  localStorage.setItem(storageConstants.KEY_NFT_HISTORY_LIST_JSON, JSON.stringify(newJson));
  mergedHistoryList.sort((a, b) => Number(b.ts) - Number(a.ts));
  return mergedHistoryList;
};

const getTransferActionNum = newList => {
  const actionNum = 0;
  let pendingNum = 0;
  newList?.forEach(item => {
    if (item.status !== NFTBridgeStatus.NFT_BRIDEGE_COMPLETE && item.status !== NFTBridgeStatus.NFT_BRIDGE_FAILED) {
      pendingNum += 1;
    }
  });
  return { actionNum, pendingNum };
};

const handleLocalHistory = (historyList, localHistory, comparePageToken) => {
  if (!localHistory || localHistory?.length === 0) {
    return [historyList, []];
  }

  const combineHistoryList: NFTHistory[] = [];
  const remainingLocalHistoryList: NFTHistory[] = [];
  const remainingRemoteHistoryList: NFTHistory[] = [];

  const copyedLocalHistoryList: NFTHistory[] = dataClone(localHistory);
  const copyedRemoteHistoryList: NFTHistory[] = dataClone(historyList);

  const localKeepHistoryList: NFTHistory[] = [];

  copyedRemoteHistoryList?.forEach(remoteItem => {
    copyedLocalHistoryList?.forEach(localItem => {
      if (remoteItem.srcTx === localItem.srcTx) {
        combineHistoryList.push(remoteItem);
      }
    });
  });

  copyedLocalHistoryList.forEach(localItem => {
    const combinedTransferIds = combineHistoryList.map(it => it.srcTx);
    if (!combinedTransferIds.includes(localItem.srcTx)) {
      localKeepHistoryList.push(localItem);
      if (Number(localItem.createdAt) * 1000 < Number(comparePageToken)) {
        remainingLocalHistoryList.push(localItem);
      }
    }
  });

  copyedRemoteHistoryList.forEach(remoteItem => {
    const combinedTransferIds = combineHistoryList.map(it => it.srcTx);
    if (!combinedTransferIds.includes(remoteItem.srcTx)) {
      remainingRemoteHistoryList.push(remoteItem);
    }
  });

  const mergedHistoryList = [...remainingLocalHistoryList, ...combineHistoryList, ...remainingRemoteHistoryList];

  return [mergedHistoryList, localKeepHistoryList];
};
