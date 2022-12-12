/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable camelcase */
/* eslint-disable */
import { FC, useEffect, useState, useContext, useCallback } from "react";
import { Menu, Tooltip, Button, Spin } from "antd";
import { createUseStyles } from "react-jss";
import _, { debounce } from "lodash";
import moment from "moment";
import {
  WarningFilled,
  InfoCircleOutlined,
  ClockCircleOutlined,
  LinkOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

import { useWeb3Context } from "../providers/Web3ContextProvider";

import { Theme } from "../theme";
import errorMessages from "../constants/errorMessage";
import { storageConstants } from "../constants/const";
import { formatDecimal } from "../helpers/format";
import { transferHistory, getNFTBridgeChainList, nftHistory } from "../redux/gateway";
import { TransferHistoryStatus, TransferHistory, NFTHistory, NFTBridgeStatus, S3NFTConfig } from "../constants/type";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { switchChain, addChainToken, setFromChain } from "../redux/transferSlice";
import { ColorThemeContext } from "../providers/ThemeProvider";
import HistoryTransferModal from "./HistoryTransferModal";
import PageFlipper from "../components/PageFlipper";
import meta from "../images/meta.svg";
import { LPType } from "../proto/gateway/gateway_pb";
import { getTokenDisplaySymbol, needToChangeTokenDisplaySymbol } from "./transfer/TransferOverview";
import { getTokenSymbol } from "../redux/assetSlice";
import { mergeTransactionHistory, isToBeConfirmRefund } from "../utils/mergeTransferHistory";
import runRightIconDark from "../images/runRightDark.svg";
import runRightIconLight from "../images/runRightLight.svg";
import { dataClone } from "../helpers/dataClone";
import { usePeggedPairConfig, GetPeggedMode, PeggedChainMode } from "../hooks/usePeggedPairConfig";
import {
  isNonEVMChain,
  useNonEVMContext,
  convertNonEVMAddressToEVMCompatible,
  NonEVMMode,
  getNonEVMMode,
} from "../providers/NonEVMContextProvider";
import { filteredLocalTransferHistory } from "../utils/localTransferHistoryList";

import { mergeNFTHistory } from "../utils/mergeNFTHistory";
import { NFTHistoryItem } from "./NFTHistoryItem";
import { FeatureSupported, getSupportedFeatures } from "../utils/featureSupported";

export type PageTokenMap = {
  [propName: number]: number;
};

const defaultPageSize = 5;

const useStyles = createUseStyles<string, { isMobile: boolean }, Theme>((theme: Theme) => ({
  flexCenter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  menu: {
    width: props => (props.isMobile ? "100%" : 416),
    height: 44,
    background: theme.primaryUnable,
    borderRadius: 8,
    border: "none",
    "& .ant-menu-item": {
      flexGrow: 1,
      flexBasis: 0,
      textAlign: "center",
      margin: "2px !important",
      fontSize: 16,
      borderRadius: 8,
      top: 0,
      lineHeight: "38px",
      padding: props => (props.isMobile ? "0 !important" : ""),
      "&:hover": {
        color: theme.surfacePrimary,
      },
    },
    "& .ant-menu-item::after": {
      borderBottom: "0 !important",
    },
    "& .ant-menu-item div": {
      color: theme.secondBrand,
      fontWeight: 700,
      fontSize: "16px",
      "&:hover": {
        color: theme.primaryBrand,
      },
    },
    "& .ant-menu-item-selected": {
      background: theme.primaryBrand,
    },
    "& .ant-menu-item-selected:hover": {
      background: theme.primaryBrand,
      color: "#fff !important",
    },
    "& .ant-menu-item-selected div": {
      color: theme.unityWhite,
      "&:hover": {
        color: `${theme.unityWhite} !important`,
      },
    },
  },
  headerTip: {
    marginTop: 16,
    padding: "8px 17px",
    fontSize: 16,
    width: "100%",
    background: theme.unityWhite,
    display: "flex",
    alignItems: "center",
    boxShadow: "0px 6px 12px -6px rgba(24, 39, 75, 0.12), 0px 8px 24px -4px rgba(24, 39, 75, 0.08)",
    borderRadius: 8,
  },
  mobileHeaderTip: {
    marginTop: 14,
    marginBottom: 20,
    padding: "8px 12px",
    fontSize: 16,
    lineHeight: "20px",
    background: theme.unityWhite,
    display: "flex",
    alignItems: "center",
    boxShadow: "0px 6px 12px -6px rgba(24, 39, 75, 0.12), 0px 8px 24px -4px rgba(24, 39, 75, 0.08)",
    borderRadius: 8,
  },
  headerTipImg: props =>
    props.isMobile
      ? {
          width: 18,
          height: 18,
        }
      : {
          width: 30,
          height: 30,
        },
  headerTipText: props =>
    props.isMobile
      ? {
          fontSize: 12,
          lineHeight: "16px",
          fontWeight: "600",
          color: theme.unityBlack,
          paddingLeft: 11,
        }
      : {
          fontSize: 16,
          lineHeight: "19px",
          fontWeight: "bold",
          color: theme.unityBlack,
          paddingLeft: 13,
        },
  tipLink: {
    color: "#3366FF",
  },
  historyBody: {
    width: 786,
    padding: "72px 8px",
    background: theme.globalBg,
    borderRadius: 16,
    border: `1px solid ${theme.primaryBorder}`,
    boxSizing: "border-box",
    boxShadow: "0px 4px 17px rgba(51, 102, 255, 0.1), 0px 8px 10px rgba(51, 102, 255, 0.1)",
  },
  mobileHistoryBody: {
    width: "100%",
    height: "100%",
    overflowY: "scroll",
    padding: "32px 16px",
  },
  historyList: {},
  ListItem: {
    width: "100%",
    background: theme.secondBackground,
    marginTop: 16,
    borderRadius: 16,
    padding: "24px 16px 10px 16px",
  },

  itemtitle: {
    display: "flex",
    alignItems: "center",
  },
  turnRight: {
    width: 20,
    height: 18,
    margin: "0 10px",
  },
  txIcon: {
    width: 27,
    height: 27,
    borderRadius: "50%",
  },
  itemTime: {
    fontSize: 12,
    color: theme.secondBrand,
    textAlign: props => (props.isMobile ? "left" : "right"),
    fontWeight: 400,
  },
  reducetxnum: {
    fontSize: props => (props.isMobile ? 12 : 14),
    color: theme.infoDanger,
    lineHeight: 1,
  },
  receivetxnum: {
    fontSize: props => (props.isMobile ? 12 : 14),
    color: theme.infoSuccess,
    lineHeight: 1,
    display: "flex",
    alignItems: "center",
  },
  waring: {
    color: theme.infoWarning,
    fontSize: 14,
  },
  failed: {
    color: theme.infoDanger,
    fontSize: 14,
  },
  completed: {
    color: theme.infoSuccess,
    fontSize: 14,
  },
  canceled: {
    color: theme.infoWarning,
    fontSize: 14,
  },
  itemcont: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  mobileItemContent: {
    display: "grid",
    alignItems: "center",
    gridTemplateColumns: "repeat(1, 1fr)",
  },
  itemLeft: {
    display: "flex",
    justifyContent: props => (props.isMobile ? "space-between" : "flex-start"),
    alignItems: "center",
  },
  itemRight: {
    marginBottom: 0,
    textAlign: "right",
    alignItems: "center",
    justifyContent: "space-between",
    maxHeight: "40px",
  },
  mobileItemRight: {
    marginTop: 20,
    marginBottom: 0,
    textAlign: "left",
    alignItems: "center",
    justifyContent: "space-between",
  },
  showSuppord: {
    transform: "translateY(-21%)",
  },
  chainName: {
    fontSize: props => (props.isMobile ? 12 : 14),
    color: theme.surfacePrimary,
    lineHeight: 1,
  },
  linktitle: {
    fontSize: props => (props.isMobile ? 12 : 14),
    color: theme.surfacePrimary,
  },
  chainName2: {
    fontSize: 14,
    color: theme.surfacePrimary,
    lineHeight: 1,
  },
  chaindes: {
    marginLeft: 6,
  },
  submitBtn: {
    background: theme.primaryBrand,
    borderColor: theme.primaryBrand,
    fontWeight: "bold",
    borderRadius: props => (props.isMobile ? 4 : 2),
    marginTop: props => (props.isMobile ? 14 : 0),
    "&:focus, &:hover": {
      background: theme.buttonHover,
    },
    "&::before": {
      backgroundColor: `${theme.primaryBrand} !important`,
    },
  },
  empty: {
    height: 480,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.surfacePrimary,
    fontSize: 15,
  },
  linkIcon: {
    fontSize: 14,
    marginLeft: 0,
  },
  numdot: {
    width: 16,
    height: 16,
    borderRadius: "50%",
    border: "1px solid #fff",
    backgroundColor: theme.infoDanger,
    color: "#fff !important",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    fontSize: "12px !important",
  },
  tabtitle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  pagination: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  rebutton: {
    position: "absolute",
    top: 7,
    right: 4,
    zIndex: 10,
    "&.ant-btn": {
      boxShadow: "none",
      border: "none",
      background: "transparent",
      color: theme.secondBrand,
      opacity: 0.7,
      "&:focus, &:hover": {
        border: "none",
        color: theme.surfacePrimary,
        opacity: 0.9,
      },
    },
  },
  mobileTooltipOverlayStyle: {
    "& .ant-tooltip-inner": {
      width: "calc(100vw - 40px)",
      borderRadius: 8,
    },
    "& .ant-tooltip-arrow-content": {
      width: 9,
      height: 9,
    },
  },
  singlText: {
    fontSize: 14,
    lineHeight: "20px",
    color: theme.surfacePrimary,
  },
  blueText: {
    clolor: theme.primaryReduce,
  },
  disableTooltip: {
    position: "absolute",
    top: 40,
    right: 0,
    zIndex: 100,
    borderRadius: 8,
  },
  disableTooltipTran: {
    width: 9,
    height: 9,
    position: "absolute",
    top: -11,
    left: 32,
    zIndex: 100,
    background: "rgb(255, 255, 255)",
    boxShadow: "-3px -3px 7px rgb(0 0 0 / 7%)",
    transform: "translateY(6.53553391px) rotate(45deg)",
  },
  disableTooltipbody: {
    width: 290,
    fontSize: 12,
    borderRadius: 8,
    textAlign: "left",
    padding: "8px 12px",
    color: "rgb(10, 30, 66)",
    background: "rgb(255, 255, 255)",
    position: "relative",
  },
  whiteSpinblur: {
    "& .ant-spin-blur": {
      opacity: 0.5,
    },
    "& .ant-spin-blur::after": {
      opacity: 0.5,
    },
    "& .ant-spin-container::after": {
      background: "#f6f7fd",
    },
  },
  spinblur: {
    "& .ant-spin-blur": {
      opacity: 0.4,
    },
    "& .ant-spin-blur::after": {
      opacity: 0.4,
    },
    "& .ant-spin-container::after": {
      background: "#2c2c2c",
    },
  },
}));
const tooltipShowTime = process.env.REACT_APP_ENV === "TEST" ? 1 : 15;

interface IProps {
  refreshChanged: boolean;
}

const History = (props: IProps): JSX.Element => {
  const { refreshChanged } = props;
  const { themeType } = useContext(ColorThemeContext);
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const { transferInfo } = useAppSelector(state => state);
  const { transferConfig, fromChain, toChain } = transferInfo;
  const classes = useStyles({ isMobile });
  const featureSupported = getSupportedFeatures()
  const [historykey, setHistorykey] = useState(featureSupported === FeatureSupported.NFT ? "nft_history" : "transfer_history");
  const { address, chainId, provider } = useWeb3Context();
  const { terraAddress, flowAddress } = useNonEVMContext();
  const now = new Date().getTime();
  const [currentPage, setCurrentPage] = useState(0);
  const [nexPageToken, setNexPageToken] = useState(0);
  const [size, setSize] = useState(defaultPageSize);
  const [pageMap, setPageMap] = useState<PageTokenMap>({ 0: now });
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TransferHistory>();
  const [hisLoading, setHisLoading] = useState(false);
  const [nftLoading, setNFTLoading] = useState(false);
  const [pageChanged, setPageChanged] = useState(false);
  const [historyActionNum, setHistoryActionNum] = useState<number>(0);
  const [historyPendingNum, setHistoryPendingNum] = useState<number>(0);
  const [mergedHistoryList, setMergedHistoryList] = useState<TransferHistory[]>([]);
  const [nftActionNum, setNftActionNum] = useState<number>(0);
  const [nftPendingNum, setNftPendingNum] = useState<number>(0);
  const [mergedNFTHistory, setMergedNFTHistory] = useState<NFTHistory[]>([]);
  const [nftList, setNftList] = useState<S3NFTConfig[]>([]);
  const dispatch = useAppDispatch();

  const getTxStatus = async (provider, link) => {
    const txid = link.split("/tx/")[1];
    if (txid) {
      const res = await provider?.getTransactionReceipt(txid);
      return res;
    }
    return "";
  };

  useEffect(() => {
    reloadHisList();
  }, [refreshChanged]);

  const setPageMapJson = (cPage, stemp) => {
    const oldPageMap = dataClone(pageMap);
    oldPageMap[cPage + 1] = stemp;
    setPageMap(oldPageMap);
  };

  const getTransactionOnchainQueryPromiseList = (provider, chainId, localStorageHistoryList: TransferHistory[]) => {
    // eslint-disable-next-line
    const promiseList: Array<Promise<any>> = [];
    if (localStorageHistoryList) {
      localStorageHistoryList?.forEach(localItem => {
        if (localItem && localItem.toString() !== "null") {
          if (
            localItem?.status === TransferHistoryStatus.TRANSFER_FAILED ||
            localItem?.txIsFailed ||
            Number(localItem.src_send_info.chain.id) !== Number(chainId)
          ) {
            // Failed transactions filter
            const nullPromise = new Promise(resolve => {
              resolve(0);
            });
            promiseList.push(nullPromise);
          } else {
            const promistx = getTxStatus(provider, localItem.src_block_tx_link); // Check local transaction status
            promiseList.push(promistx);
          }
        }
      });
    }
    return promiseList;
  };

  const getHistoryList = async next_page_token => {
    setHisLoading(true);

    const addresses = [address];
    const localAddresses = [address];

    if (flowAddress.length > 0) {
      const flowEVMCompatibleAddress = await convertNonEVMAddressToEVMCompatible(flowAddress, NonEVMMode.flowTest);
      addresses.push(flowEVMCompatibleAddress);
      localAddresses.push(flowAddress);
    }

    if (terraAddress.length > 0) {
      const terraEVMCompatibleAddress = await convertNonEVMAddressToEVMCompatible(terraAddress, NonEVMMode.terraTest);
      addresses.push(terraEVMCompatibleAddress);
      localAddresses.push(terraAddress);
    }

    const res = await transferHistory({ acct_addr: addresses, page_size: defaultPageSize, next_page_token });
    if (res) {
      if (historykey === "transfer_history") {
        setSize(res?.current_size);
      }
      const localHistoryList = filteredLocalTransferHistory(localAddresses);
      const allItemTxQueryPromise = getTransactionOnchainQueryPromiseList(provider, chainId, localHistoryList);
      Promise.all(allItemTxQueryPromise).then(onChainResult => {
        const mergedHistoryResult = mergeTransactionHistory({
          pageToken: pageMap[currentPage],
          historyList: res.history,
          localHistoryList: localHistoryList,
          pageSize: 5,
          address: address,
          onChainResult: onChainResult,
        });
        setHistoryActionNum(mergedHistoryResult.historyActionNum);
        setHistoryPendingNum(mergedHistoryResult.historyPendingNum);
        setMergedHistoryList(mergedHistoryResult.mergedHistoryList);
        setHisLoading(false);
      });
    }
  };

  useEffect(() => {
    if (mergedHistoryList && mergedHistoryList.length > 0) {
      const renewPageToken = mergedHistoryList[mergedHistoryList.length - 1].ts.toString();
      setPageMapJson(currentPage, renewPageToken);
    }
  }, [mergedHistoryList]);

  useEffect(() => {
    if (mergedNFTHistory && mergedNFTHistory.length > 0) {
      const lastCreateItem = mergedNFTHistory[mergedNFTHistory.length - 1];
      const renewPageToken = lastCreateItem.createdAt.toString();
      setPageMapJson(currentPage, renewPageToken);
    }
  }, [mergedNFTHistory]);

  const getNFTOnChainQueryPromiseList = (provider, chainId, localNFTHistoryList: NFTHistory[]) => {
    // eslint-disable-next-line
    const promiseList: Array<Promise<any>> = [];
    if (localNFTHistoryList) {
      const newLocalNFTList: NFTHistory[] = [];
      localNFTHistoryList?.forEach(localItem => {
        if (localItem && localItem.toString() !== "null") {
          newLocalNFTList.push(localItem);
          if (
            localItem?.status === NFTBridgeStatus.NFT_BRIDGE_FAILED ||
            localItem?.txIsFailed ||
            Number(localItem.srcChid) !== Number(chainId)
          ) {
            // Failed transactions filter
            const nullPromise = new Promise(resolve => {
              resolve(0);
            });
            promiseList.push(nullPromise);
          } else {
            const promistx = getTxStatus(provider, localItem.srcTx);
            promiseList.push(promistx);
          }
        }
      });
    }
    return promiseList;
  };

  const getNFTHistoryList = async (nextPage, isAutoRefresh = false) => {
    if (featureSupported !== FeatureSupported.BOTH && featureSupported !== FeatureSupported.NFT) {
      return
    }

    if (!isAutoRefresh) {
      setNFTLoading(true);
    }
    const configRes = await getNFTBridgeChainList();
    setNftList(configRes.nfts);
    const res = await nftHistory(address, { nextPageToken: nextPage, pageSize: defaultPageSize });
    if (res && res.history) {
      if (historykey === "nft_history") {
        setSize(res?.pageSize);
      }
      let localNftList;
      const localNftListStr = localStorage.getItem(storageConstants.KEY_NFT_HISTORY_LIST_JSON);
      if (localNftListStr) {
        localNftList = JSON.parse(localNftListStr)[address] as NFTHistory[];
      }
      const promiseList = getNFTOnChainQueryPromiseList(provider, chainId, localNftList);

      Promise.all(promiseList).then(onChainResult => {
        const nftMergerdResult = mergeNFTHistory({
          pageToken: pageMap[currentPage],
          historyList: res.history,
          localHistoryList: localNftList,
          pageSize: 5,
          address: address,
          onChainResult: onChainResult,
        });
        setNftActionNum(nftMergerdResult.historyActionNum);
        setNftPendingNum(nftMergerdResult.historyPendingNum);
        setMergedNFTHistory(nftMergerdResult.mergedHistoryList);
      });
    }
    setNFTLoading(false);
  };

  useEffect(() => {
    setNexPageToken(now);
    const newpMap = { 0: now };
    setPageMap(newpMap);
    setCurrentPage(0);
    if (!showModal) {
      getHistoryList(now.toString());
    }

    getNFTHistoryList(now.toString());
  }, [historykey, showModal]);

  useEffect(() => {
    if (nexPageToken !== 0) {
      if (historykey === "transfer_history") {
        getHistoryList(nexPageToken);
      } else if (historykey === "nft_history") {
        getNFTHistoryList(nexPageToken);
      }
    }
  }, [nexPageToken]);

  const reloadHisList = () => {
    if (historykey === "transfer_history") {
      getHistoryList(currentPage === 0 ? now : pageMap[currentPage]);
    } else if (historykey === "nft_history") {
      getNFTHistoryList(nexPageToken);
    }
  };

  const refreshTabMessageCallback = useCallback(
    (
      historyActionNum,
      historyPendingNum,
      mergedHistoryList,
      nftActionNum,
      nftPendingNum,
      mergeNFTHistory,
      pageChanged,
    ) => {
      if (pageChanged) {
        return;
      }

      const hasActionInTranster = historyActionNum > 0;
      const hasPendingInTransfer = historyPendingNum > 0;
      const hasHistoryInTranster = mergedHistoryList.length > 0;
      const hasActionInNFT = nftActionNum > 0;
      const hasPendngInNFT = nftPendingNum > 0;
      const hasHistoryInNft = mergeNFTHistory.length > 0;

      // Action Required > No Action Required
      // Pending > No Pending
      // History > No History
      // Transfer > Liquidity
      const transferDefaultPriority = 2;
      const liquidityDefaultPriority = 1;
      const nftDefaultPriority = 0;

      const hasHistoryPriority = 10;
      const hasPendingPriority = 100;
      const hasActionPriority = 1000;
      let transferPriority = 0;
      let nftPriority = 0;

      transferPriority += transferDefaultPriority;
      nftPriority += nftDefaultPriority;
      if (hasHistoryInTranster) {
        transferPriority += hasHistoryPriority;
      }
      if (hasHistoryInNft) {
        nftPriority += hasHistoryPriority;
      }
      if (hasPendingInTransfer) {
        transferPriority += hasPendingPriority;
      }
      if (hasPendngInNFT) {
        nftPriority += hasPendingPriority;
      }
      if (hasActionInTranster) {
        transferPriority += hasActionPriority;
      }
      if (hasActionInNFT) {
        nftPriority += hasActionPriority;
      }

      let max = 0;
      let key = "";

      max = transferPriority;
      key = "transfer_history";

      if (nftPriority > max) {
        key = "nft_history";
      }

      switch (featureSupported) {
        case FeatureSupported.NFT: {
          key = "nft_history";
          break
        }
        case FeatureSupported.TRANSFER: {
          key = "transfer_history";
          break
        }
        default: {
          break
        }
      }
      
      setHistorykey(key);
    },
    [
      historyActionNum,
      historyPendingNum,
      nftActionNum,
      nftPendingNum,
      mergedHistoryList,
      mergedNFTHistory,
      pageChanged,
    ],
  );

  const debouncedMessageNumberChangeHandler = useCallback(debounce(refreshTabMessageCallback, 300), []);

  useEffect(() => {
    debouncedMessageNumberChangeHandler(
      historyActionNum,
      historyPendingNum,
      mergedHistoryList,
      nftActionNum,
      nftPendingNum,
      mergedHistoryList,
      pageChanged,
    );
  }, [historyActionNum, historyPendingNum, mergedHistoryList, pageChanged]);

  const clearLpLocalData = item => {
    const localLpListStr = localStorage.getItem(storageConstants.KEY_LP_LIST);
    let localList;
    if (localLpListStr) {
      const localLpList = JSON.parse(localLpListStr)[address];
      localList = localLpList ? dataClone(localLpList) : [];
      localLpList?.map(async (localItem, i) => {
        if (
          (Number(item.nonce) === Number(localItem.nonce) && item.type === LPType.LP_TYPE_ADD) ||
          (Number(item.seq_num) === Number(localItem.seq_num) && item.type === LPType.LP_TYPE_REMOVE)
        ) {
          localList.splice(i, 1);
        }
        return localItem;
      });
    }
    const newJson = { [address]: localList };
    localStorage.setItem(storageConstants.KEY_LP_LIST, JSON.stringify(newJson));
    reloadHisList();
  };

  const clearHistoryLocalData = item => {
    const transferListStr = localStorage.getItem(storageConstants.KEY_TRANSFER_LIST_JSON);
    let localList;
    if (transferListStr) {
      const transferList = JSON.parse(transferListStr);
      localList = transferList ? dataClone(transferList) : [];
      transferList?.map(async (localItem, i) => {
        if (item.transfer_id === localItem.transfer_id) {
          localList.splice(i, 1);
        }
        return localItem;
      });
    }

    localStorage.setItem(storageConstants.KEY_TRANSFER_LIST_JSON, JSON.stringify(localList));
    reloadHisList();
  };

  const onPageChange = page => {
    const oldPageMap = dataClone(pageMap);
    if (page === 0) {
      oldPageMap[0] = now;
      setNexPageToken(now);
    } else {
      setNexPageToken(oldPageMap[page]);
    }
    setCurrentPage(page);
    setPageMap(oldPageMap);
    setPageChanged(true);
  };

  const tipsStatus = (item, peggedMode) => {
    let lab;
    const nowDate = new Date().getTime();
    const showResult = nowDate - Number(item.updateTime || item.ts) <= tooltipShowTime * 60 * 1000;
    switch (item.status) {
      case TransferHistoryStatus.TRANSFER_SUBMITTING:
        lab = (
          <Tooltip
            overlayClassName={isMobile ? classes.mobileTooltipOverlayStyle : undefined}
            title={
              showResult ? (
                <span>
                  Your transfer is being confirmed on {item.src_send_info.chain.name}. Please allow{" "}
                  {item.src_send_info.chain.block_delay} block confirmations (a few minutes) for your transfer request
                  to be confirmed.
                </span>
              ) : (
                <div>
                  It seems that your transaction has been stuck for more than 15 minutes.
                  <div style={{ marginLeft: 10, marginTop: 15 }}>
                    <div style={{ display: "flex", alignItems: "baseline" }}>
                      <div style={{ fontSize: 15, fontWeight: "bold", marginRight: 5 }}>·</div>
                      <div>
                        {" "}
                        If your on-chain tx has completed, please{" "}
                        <a
                          href={`https://form.typeform.com/to/Q4LMjUaK#srctx=${item.src_block_tx_link}&transferid=${item.transfer_id}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          contact support
                        </a>{" "}
                        for help.
                      </div>
                    </div>
                    <div style={{ marginTop: 10 }}>
                      <div style={{ display: "flex", alignItems: "baseline" }}>
                        <div style={{ fontSize: 15, fontWeight: "bold", marginRight: 5 }}>·</div>
                        <div>
                          {" "}
                          If your on-chain tx is still pending, you may speed up your transaction by increasing the gas
                          price.{" "}
                        </div>
                      </div>
                    </div>
                    {item.isLocal && (
                      <div style={{ marginTop: 10 }}>
                        <div style={{ display: "flex", alignItems: "baseline" }}>
                          <div style={{ fontSize: 15, fontWeight: "bold", marginRight: 5 }}>·</div>
                          <div>
                            {" "}
                            If your on-chain tx has failed, this is usually because the gas limit is set too low. You
                            can manually{" "}
                            <span
                              style={{ color: "#1890ff", cursor: "pointer" }}
                              onClick={() => {
                                clearHistoryLocalData(item);
                              }}
                            >
                              clear this history item
                            </span>{" "}
                            and try again later.
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            }
            placement={isMobile ? "bottomLeft" : "bottomRight"}
            color="#fff"
            overlayInnerStyle={{ color: "#000", width: 265 }}
          >
            <div className={classes.waring}>
              Submitting
              <InfoCircleOutlined style={{ fontSize: 13, marginLeft: 6 }} />
            </div>
          </Tooltip>
        );
        break;
      case TransferHistoryStatus.TRANSFER_DELAYED:
        lab = (
          <Tooltip
            overlayClassName={isMobile ? classes.mobileTooltipOverlayStyle : undefined}
            title={
              <span>
                Your fund is being processed on {item.dst_received_info.chain.name}, which usually takes 30-60 minutes.
              </span>
            }
            placement={isMobile ? "bottomLeft" : "right"}
            color="#fff"
            overlayInnerStyle={{ color: "#000" }}
          >
            <div className={classes.waring}>
              Waiting for fund release
              <InfoCircleOutlined style={{ fontSize: 13, marginLeft: 6 }} />
            </div>
          </Tooltip>
        );
        break;
      case TransferHistoryStatus.TRANSFER_FAILED:
        lab = (
          <Tooltip
            overlayClassName={isMobile ? classes.mobileTooltipOverlayStyle : undefined}
            title={
              <span>
                Your transaction has failed on {item.src_send_info.chain.name}. This is usually because the gas limit is
                set too low. Rest assured that your funds are safe. You may try again later.
              </span>
            }
            placement={isMobile ? "bottomLeft" : "right"}
            color="#fff"
            overlayInnerStyle={{ color: "#000" }}
          >
            <div className={classes.failed}>
              Failed
              <InfoCircleOutlined style={{ fontSize: 13, marginLeft: 6 }} />
            </div>
          </Tooltip>
        );
        break;
      case TransferHistoryStatus.TRANSFER_WAITING_FOR_FUND_RELEASE:
        lab = (
          <Tooltip
            overlayClassName={isMobile ? classes.mobileTooltipOverlayStyle : undefined}
            title={
              <span>
                Your transfer is being released to {item.dst_received_info.chain.name}, which takes a few minutes in
                most cases but could take a few hours if there is heavy traffic or your transfer amount is large.
              </span>
            }
            placement={isMobile ? "bottomLeft" : "right"}
            color="#fff"
            overlayInnerStyle={{ color: "#000" }}
          >
            <div className={classes.waring}>
              Waiting for fund release
              <InfoCircleOutlined style={{ fontSize: 13, marginLeft: 6 }} />
            </div>
          </Tooltip>
        );
        break;
      case TransferHistoryStatus.TRANSFER_COMPLETED:
        lab = <div className={classes.completed}>Completed</div>;
        break;
      case TransferHistoryStatus.TRANSFER_TO_BE_REFUNDED: // TODO
        lab = (
          <Tooltip
            overlayClassName={isMobile ? classes.mobileTooltipOverlayStyle : undefined}
            title={
              <div>
                {peggedMode === PeggedChainMode.Deposit ? (
                  <span>
                    The transfer cannot be completed because there is not enough liquidity to bridge your transfer. You
                    may request a refund.
                  </span>
                ) : (
                  <span>
                    The transfer cannot be completed because{" "}
                    {errorMessages[item?.refund_reason] ||
                      "the bridge rate has moved unfavorably by your slippage tolerance"}
                    . You may request a refund.
                  </span>
                )}
              </div>
            }
            placement={isMobile ? "bottomLeft" : "right"}
            color="#fff"
            overlayInnerStyle={{ color: "#000" }}
          >
            <div className={classes.waring}>
              To be refunded
              <InfoCircleOutlined style={{ fontSize: 13, marginLeft: 6 }} />
            </div>
          </Tooltip>
        );
        break;
      case TransferHistoryStatus.TRANSFER_REQUESTING_REFUND:
        lab = (
          <Tooltip
            overlayClassName={isMobile ? classes.mobileTooltipOverlayStyle : undefined}
            title={
              <span>
                Your refund request is being confirmed on Celer State Guardian Network (SGN), which may take a few
                minutes.
              </span>
            }
            placement={isMobile ? "bottomLeft" : "right"}
            color="#fff"
            overlayInnerStyle={{ color: "#000" }}
          >
            <div className={classes.waring}>
              Requesting refund
              <InfoCircleOutlined style={{ fontSize: 13, marginLeft: 6 }} />
            </div>
          </Tooltip>
        );
        break;
      case TransferHistoryStatus.TRANSFER_REFUND_TO_BE_CONFIRMED:
        lab = <div className={classes.waring}>Refund to be confirmed</div>;
        break;
      case TransferHistoryStatus.TRANSFER_CONFIRMING_YOUR_REFUND:
        if (isToBeConfirmRefund(item)) {
          lab = <div className={classes.waring}>Refund to be confirmed</div>;
          break;
        }
        lab = (
          <Tooltip
            overlayClassName={isMobile ? classes.mobileTooltipOverlayStyle : undefined}
            title={
              showResult ? (
                <span>
                  Your request for refunding the transfer is being confirmed on {item.src_send_info.chain.name}, which
                  might take a few minutes.
                </span>
              ) : (
                <div>
                  It seems that your transaction has been stuck for more than 15 minutes.
                  <div style={{ marginLeft: 10, marginTop: 15 }}>
                    <div style={{ display: "flex", alignItems: "baseline" }}>
                      <div style={{ fontSize: 15, fontWeight: "bold", marginRight: 5 }}>·</div>
                      <div>
                        {" "}
                        If your on-chain tx has completed, please{" "}
                        <a
                          href={`https://form.typeform.com/to/Q4LMjUaK#srctx=${item.src_block_tx_link}&transferid=${item.transfer_id}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          contact support
                        </a>{" "}
                        for help.
                      </div>
                    </div>
                    <div style={{ marginTop: 10 }}>
                      <div style={{ display: "flex", alignItems: "baseline" }}>
                        <div style={{ fontSize: 15, fontWeight: "bold", marginRight: 5 }}>·</div>
                        <div>
                          {" "}
                          If your on-chain tx is still pending, you may speed up your transaction by increasing the gas
                          price.{" "}
                        </div>
                      </div>
                    </div>
                    <div style={{ marginTop: 10 }}>
                      <div style={{ display: "flex", alignItems: "baseline" }}>
                        <div style={{ fontSize: 15, fontWeight: "bold", marginRight: 5 }}>·</div>
                        <div>
                          {" "}
                          If your on-chain tx has failed, this is usually because the gas limit is set too low.Please{" "}
                          <span
                            style={{ color: "#1890ff", cursor: "pointer" }}
                            onClick={e => {
                              e.stopPropagation();
                              const newItem = item;
                              newItem.status = TransferHistoryStatus.TRANSFER_REFUND_TO_BE_CONFIRMED;
                              setSelectedItem(newItem);
                              setShowModal(true);
                            }}
                          >
                            click here
                          </span>{" "}
                          to resubmit the tx.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
            placement={isMobile ? "bottomLeft" : "bottomRight"}
            color="#fff"
            overlayInnerStyle={{ color: "#000", width: 265 }}
          >
            <div className={classes.waring}>
              Confirming your refund
              <InfoCircleOutlined style={{ fontSize: 13, marginLeft: 6 }} />
            </div>
          </Tooltip>
        );
        break;
      case TransferHistoryStatus.TRANSFER_WAITING_FOR_SGN_CONFIRMATION:
        lab = (
          <Tooltip
            overlayClassName={isMobile ? classes.mobileTooltipOverlayStyle : undefined}
            title={
              <span>
                Your transfer is being confirmed on Celer State Guardian Network (SGN), which might take a few minutes.
              </span>
            }
            placement={isMobile ? "bottomLeft" : "right"}
            color="#fff"
            overlayInnerStyle={{ color: "#000" }}
          >
            <div className={classes.waring}>
              Waiting for SGN confirmation
              <InfoCircleOutlined style={{ fontSize: 13, marginLeft: 6 }} />
            </div>
          </Tooltip>
        );
        break;
      case TransferHistoryStatus.TRANSFER_REFUNDED:
        lab = <div className={classes.completed}>Refunded</div>;
        break;
      default:
        break;
    }
    return lab;
  };

  const btnChange = item => {
    let btntext;

    if (isToBeConfirmRefund(item)) {
      btntext = "Confirm Refund";
    } else if (item.status === TransferHistoryStatus.TRANSFER_TO_BE_REFUNDED) {
      btntext = "Request Refund";
    }
    if (btntext) {
      return (
        <div style={{ position: "relative", width: "fit-content" }}>
          <Tooltip
            overlayClassName={isMobile ? classes.mobileTooltipOverlayStyle : undefined}
            title={
              <div style={{ display: "flex", alignItems: "center" }}>
                <div>
                  <WarningFilled style={{ fontSize: 20, marginLeft: 4, marginRight: 10, color: "#ff8f00" }} />
                </div>
                <div>
                  It seems that your tx was failed or stuck on-chain. If you found the tx was failed, please increase
                  your gas limit and resubmit the transaction.
                </div>
              </div>
            }
            color="#fff"
            visible={!!item.txIsFailed}
            placement={isMobile ? "bottomLeft" : "right"}
            overlayInnerStyle={{ color: "#000", textAlign: "left", borderRadius: 10, fontSize: 12, width: 290 }}
            getPopupContainer={() => {
              return document.getElementById("modalpop") || document.body;
            }}
          >
            <Button
              type="primary"
              onClick={e => {
                e.stopPropagation();
                setSelectedItem(item);
                setShowModal(true);
              }}
              className={classes.submitBtn}
            >
              {btntext}
            </Button>
          </Tooltip>
        </div>
      );
    }
    return <div />;
  };
  const pegConfig = usePeggedPairConfig();
  const addTokenMethod = (fromChainId, toChainId, token, displaySymbol) => {
    const tokenAddress = pegConfig.getHistoryTokenBalanceAddress(
      token?.address || "",
      fromChainId,
      toChainId,
      token?.symbol,
      transferInfo.transferConfig.pegged_pair_configs,
    );

    const addtoken = {
      address: tokenAddress,
      symbol: displaySymbol ?? getTokenSymbol(token?.symbol, toChainId),
      decimals: token?.decimal,
      image: token?.icon,
    };
    if (chainId === toChainId) {
      addChainToken(addtoken);
    } else {
      switchChain(toChainId, addtoken, (chainId: number) => {
        const chain = transferConfig.chains.find(chainInfo => {
          return chainInfo.id === chainId;
        });
        if (chain !== undefined) {
          dispatch(setFromChain(chain));
        }
      });
    }
  };

  let historyContent = <></>;

  if (historykey === "transfer_history") {
    historyContent = (
      <div className={themeType === "dark" ? classes.spinblur : classes.whiteSpinblur} key="1">
        <Spin spinning={hisLoading}>
          <div>
            {mergedHistoryList.length > 0 ? (
              <div>
                {mergedHistoryList?.map(item => {
                  const sendAmountWithDecimal = formatDecimal(
                    item.src_send_info.amount,
                    item.src_send_info.token?.decimal,
                  )
                    ?.split(",")
                    .join("");
                  const receivedAmountWithDecimal = formatDecimal(
                    item?.dst_received_info.amount,
                    item?.dst_received_info?.token?.decimal,
                  )
                    ?.split(",")
                    .join("");

                  const showSupport =
                    item.status !== TransferHistoryStatus.TRANSFER_COMPLETED &&
                    item.status !== TransferHistoryStatus.TRANSFER_FAILED &&
                    item.status !== TransferHistoryStatus.TRANSFER_REFUNDED;

                  const peggedMode = GetPeggedMode(
                    item?.src_send_info?.chain?.id,
                    item?.dst_received_info?.chain?.id,
                    item?.dst_received_info?.token?.symbol,
                    transferInfo.transferConfig.pegged_pair_configs,
                  );

                  let srcChainSymbol = getTokenSymbol(item?.src_send_info.token.symbol, item?.src_send_info.chain.id);

                  const dstChainSymbol = getTokenDisplaySymbol(
                    item?.dst_received_info?.token,
                    item?.src_send_info?.chain,
                    item?.dst_received_info?.chain,
                    transferInfo.transferConfig.pegged_pair_configs,
                  );

                  const isNativeToken = needToChangeTokenDisplaySymbol(
                    item?.src_send_info.token,
                    item?.dst_received_info.chain,
                  );

                  let shouldDisplayMetaMaskIcon = !isNativeToken;

                  if (peggedMode !== PeggedChainMode.Off) {
                    shouldDisplayMetaMaskIcon = true;
                  }

                  if (item?.dst_received_info?.chain?.id === 56 && item?.src_send_info?.token.symbol === "BNB") {
                    shouldDisplayMetaMaskIcon = false;
                  }

                  if (item?.dst_received_info?.chain?.id === 43114 && item?.src_send_info?.token.symbol === "AVAX") {
                    shouldDisplayMetaMaskIcon = false;
                  }

                  if (item?.dst_received_info?.chain?.id === 250 && item?.src_send_info?.token.symbol === "FTM") {
                    shouldDisplayMetaMaskIcon = false;
                  }

                  if (item?.dst_received_info.chain.id === 336 && item?.src_send_info?.token.symbol === "SDN") {
                    shouldDisplayMetaMaskIcon = false;
                  }

                  if (item?.dst_received_info.chain.id === 137 && item?.src_send_info?.token.symbol === "MATIC") {
                    shouldDisplayMetaMaskIcon = false;
                  }

                  if (item?.dst_received_info.chain.id === 57 && item?.src_send_info?.token.symbol === "SYS") {
                    shouldDisplayMetaMaskIcon = false;
                  }

                  if (item?.dst_received_info.chain.id === 592 && item?.src_send_info?.token.symbol === "ASTR") {
                    shouldDisplayMetaMaskIcon = false;
                  }

                  if (item?.dst_received_info.chain.id === 16350 && item?.src_send_info?.token.symbol === "PEEL") {
                    shouldDisplayMetaMaskIcon = false;
                  }

                  if (item?.dst_received_info.chain.id === 13000 && item?.src_send_info?.token.symbol === "ECG") {
                    shouldDisplayMetaMaskIcon = false;
                  }

                  // if (item?.dst_received_info.chain.id === 73771 && item?.src_send_info?.token.symbol === "TUS") {
                  //   shouldDisplayMetaMaskIcon = false;
                  // }

                  try {
                    if (!window.ethereum.isMetaMask) {
                      shouldDisplayMetaMaskIcon = false;
                    }
                  } catch (e) {
                    shouldDisplayMetaMaskIcon = false;
                  }

                  if (isNonEVMChain(item?.dst_received_info.chain.id ?? 0)) {
                    shouldDisplayMetaMaskIcon = false;
                  }

                  const srcChainEVMMode = getNonEVMMode(item.src_send_info.chain.id);
                  let srcBlockTxLink = item.src_block_tx_link;
                  if (srcChainEVMMode === NonEVMMode.terraMainnet || srcChainEVMMode === NonEVMMode.terraTest) {
                    srcBlockTxLink = srcBlockTxLink.replace("0x", "");
                  }

                  const dstChainEVMMode = getNonEVMMode(item.dst_received_info.chain.id);
                  let dstBlockTxLink = item.dst_block_tx_link;
                  if (dstChainEVMMode === NonEVMMode.terraMainnet || dstChainEVMMode === NonEVMMode.terraTest) {
                    dstBlockTxLink = dstBlockTxLink.replace("0x", "");
                  }

                  return (
                    <div className={classes.ListItem} key={item.transfer_id}>
                      <div className={isMobile ? classes.mobileItemContent : classes.itemcont}>
                        <div className={classes.itemLeft}>
                          <div className={classes.itemtitle} style={isMobile ? { minWidth: 0 } : { minWidth: 160 }}>
                            <div>
                              <img src={item.src_send_info.chain.icon} alt="" className={classes.txIcon} />
                            </div>
                            <div className={classes.chaindes}>
                              <a
                                className={classes.chainName}
                                href={srcBlockTxLink}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {item.src_send_info.chain.name} <LinkOutlined className={classes.linkIcon} />
                              </a>

                              <div className={classes.reducetxnum}>
                                - {sendAmountWithDecimal} {srcChainSymbol}
                              </div>
                            </div>
                          </div>
                          <img
                            src={themeType === "dark" ? runRightIconDark : runRightIconLight}
                            alt=""
                            className={classes.turnRight}
                          />
                          <div className={classes.itemtitle}>
                            <div>
                              <img src={item?.dst_received_info.chain.icon} alt="" className={classes.txIcon} />
                            </div>
                            <div className={classes.chaindes}>
                              {dstBlockTxLink ? (
                                <a
                                  className={classes.linktitle}
                                  href={dstBlockTxLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {item?.dst_received_info.chain.name} <LinkOutlined className={classes.linkIcon} />
                                </a>
                              ) : (
                                <div className={classes.linktitle}> {item?.dst_received_info.chain.name}</div>
                              )}

                              {/* dest amount */}
                              {Number(receivedAmountWithDecimal) > 0 ? (
                                <div className={classes.receivetxnum}>
                                  +{" "}
                                  <span>
                                    {receivedAmountWithDecimal} {dstChainSymbol}
                                  </span>
                                  {!isMobile && (
                                    <Tooltip
                                      overlayClassName={isMobile ? classes.mobileTooltipOverlayStyle : undefined}
                                      title="Add to MetaMask"
                                      placement="bottom"
                                      color="#fff"
                                      overlayInnerStyle={{ color: "#000" }}
                                    >
                                      {/* eslint-disable-next-line */}
                                      <img
                                        onClick={() => {
                                          addTokenMethod(
                                            item?.src_send_info.chain.id,
                                            item?.dst_received_info.chain.id,
                                            item?.dst_received_info.token,
                                            dstChainSymbol,
                                          );
                                        }}
                                        src={meta}
                                        alt=""
                                        height={14}
                                        style={{
                                          display: shouldDisplayMetaMaskIcon ? "flex" : "none",
                                          marginLeft: 5,
                                          cursor: "pointer",
                                        }}
                                      />
                                    </Tooltip>
                                  )}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                        <div className={isMobile ? classes.mobileItemRight : classes.itemRight}>
                          <div className={showSupport ? classes.showSuppord : ""}>
                            <div>{tipsStatus(item, peggedMode)}</div>
                            <div className={classes.itemTime}>
                              {moment(Number(item.ts)).format("YYYY-MM-DD HH:mm:ss")}
                            </div>
                            {showSupport && (
                              <a
                                href={`https://form.typeform.com/to/Q4LMjUaK#srctx=${item.src_block_tx_link}&transferid=${item.transfer_id}`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Contact Support
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                      <div>{btnChange(item)}</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={classes.empty}>
                {!hisLoading && (
                  <div>
                    <div style={{ width: "100%", textAlign: "center", marginBottom: 15 }}>
                      <ClockCircleOutlined style={{ fontSize: 30 }} />
                    </div>
                    <div style={{ fontSize: 15 }}> No history yet!</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </Spin>
      </div>
    );
  } else if (historykey === "nft_history") {
    historyContent = (
      <div className={themeType === "dark" ? classes.spinblur : classes.whiteSpinblur} key="3">
        <Spin spinning={nftLoading}>
          <div>
            {mergedNFTHistory.length > 0 ? (
              <div>
                {mergedNFTHistory?.map(item => {
                  return (
                    <NFTHistoryItem
                      key={`${item.srcTx}-${item.createdAt}`}
                      item={item}
                      nftList={nftList}
                      onLocalItemRemoved={() => {
                        reloadHisList();
                      }}
                    />
                  );
                })}
              </div>
            ) : (
              <div className={classes.empty}>
                {!nftLoading && (
                  <div>
                    <div style={{ width: "100%", textAlign: "center", marginBottom: 15 }}>
                      <ClockCircleOutlined style={{ fontSize: 30 }} />
                    </div>
                    <div style={{ fontSize: 15 }}> No history yet!</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </Spin>
      </div>
    );
  }

  const prepareMenuItems = (): JSX.Element => {
    switch (featureSupported) {
      case FeatureSupported.BOTH: {
        return (
          <Menu
            className={classes.menu}
            selectedKeys={[historykey]}
            onClick={e => {
              setPageChanged(true);
              setHistorykey(e.key);
            }}
            mode="horizontal"
          >
            <Menu.Item key="transfer_history">
              <div className={classes.tabtitle}>
                Transfer
                {historyActionNum !== 0 && <div className={classes.numdot}>{historyActionNum}</div>}
              </div>
            </Menu.Item>
            <Menu.Item key="nft_history">
              <div className={classes.tabtitle}>NFT</div>
            </Menu.Item>
          </Menu>
        )
      }
     default: {
       return ( <div></div> )
     }
    }
  }

  return (
    <div className={isMobile ? classes.mobileHistoryBody : classes.historyBody}>
      <div>
        <div className={classes.flexCenter}>
          {prepareMenuItems()}
          {/* {isMobile ? null : (
            <Button
              type="primary"
              className={classes.rebutton}
              onClick={() => {
                reloadHisList();
              }}
              icon={<ReloadOutlined style={{ fontSize: 20 }} />}
            />
          )} */}
        </div>
        <div className={classes.historyList}>{historyContent}</div>
        {currentPage !== undefined ? (
          <div className={classes.pagination}>
            <PageFlipper
              page={currentPage}
              hasMore={Number(size) === defaultPageSize}
              onPageChange={(toPage: number) => onPageChange(toPage)}
            />
          </div>
        ) : null}
      </div>

      {showModal && (
        <HistoryTransferModal visible={showModal} onCancel={() => setShowModal(false)} record={selectedItem} />
      )}
    </div>
  );
};

export default History;
