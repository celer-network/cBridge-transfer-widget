import { useCallback, useEffect, useState } from "react";
import { Layout, message } from "antd";
import { createUseStyles } from "react-jss";
import { useAsync } from "react-use";
import { useHistory } from "react-router-dom";
import { Theme } from "../theme";
import NewTransfer from "./NewTransfer";
import HistoryModal from "./HistoryModal";
import Header from "../components/Header";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { closeModal, ModalName } from "../redux/modalSlice";
import ProviderModal from "../components/ProviderModal";
import ChainList from "../components/ChainList";
import { useWeb3Context } from "../providers/Web3ContextProvider";
import {
  setCBridgeAddresses,
  setCBridgeDesAddresses,
  setFarmingRewardAddresses,
  setIsHistoryNotEmpty,
} from "../redux/globalInfoSlice";
import {
  getTransferConfigs,
  transferHistory,
  checkTransferHistory,
} from "../redux/gateway";
import {
  setIsChainShow,
  setTransferConfig,
  setTokenList,
  setFromChain,
  setToChain,
  setSelectedToken,
  switchChain,
  setGetConfigsFinish,
  addChainToken,
  setTotalActionNum,
  setTotalPaddingNum,
  setSingleChainList,
  setRefreshTransferAndLiquidity,
} from "../redux/transferSlice";
import { setConfig } from "../redux/configSlice";
import {
  Chain,
  TransferHistoryStatus,
  TokenInfo,
  TransferHistory,
  PeggedPairConfig,
} from "../constants/type";
import { CHAIN_LIST, getNetworkById } from "../constants/network";
import { dataClone } from "../helpers/dataClone";
import { useTransferSupportedChainList, useTransferSupportedTokenList } from "../hooks/transferSupportedInfoList";

/* eslint-disable */
/* eslint-disable no-debugger */
/* eslint-disable camelcase */

const { Content, Footer } = Layout;

const cBridgeV1Url = "https://cbridge-v1-legacy.celer.network";

const useStyles = createUseStyles<string, { isMobile: boolean }, Theme>((theme: Theme) => ({
  [`@media (max-width: ${768}px)`]: {
    "@global": {
      body: {
        background: `${theme.secondBackground}`,
      },
    },
  },
  [`@media (min-width: ${769}px)`]: {
    "@global": {
      body: {
        background: `${theme.globalBg}`,
      },
    },
  },
  ".ant-select-dropdown": {
    // backgroundColor: `${theme.componentPrimary} !important`,
    "& .ant-select-item-option-selected:not(.ant-select-item-option-disabled)": {
      //   backgroundColor: `${theme.componentPrimary} !important`,
      //   color: theme.infoPrimary,
    },
    "& .ant-select-item": {
      //   color: theme.infoThird,
    },
  },
  app: {
    background: theme.globalBg,
  },
  layout: {
    background: props => (props.isMobile ? theme.secondBackground : theme.globalBg),
    padding: props => (props.isMobile ? 0 : "0 30px"),
    minHeight: props => (props.isMobile ? 0 : "100vh"),
    maxWidth: "100%",
    "@global": {
      body: {
        backgroundColor: "yellow",
      },
      ".ant-card": {
        //   background: theme.surface,
      },
      ".ant-dropdown": {
        backgroundColor: "yellow",
      },
      "ant-dropdown-menu-title-content": {
        color: "yellow",
      },
    },
  },
  "@global": {
    ".ant-modal-mask": {
      backgroundColor: theme.blurBg,
    },
  },
  headerTip: {
    width: "100%",
    height: 48,
    fontSize: 14,
    lineHeight: "48px",
    color: theme.surfacePrimary,
    fontWeight: 500,
    textAlign: "center",
    borderBottom: `0.5px solid ${theme.primaryBorder}`,
  },
  nav: {
    display: "flex",
    alignItems: "center",
    marginTop: 10,
  },
  footer: {
    margin: props => (props.isMobile ? "20px 16px 16px 16px" : "40px 10px 70px 10px"),
    padding: 0,
    display: "flex",
    flexFlow: "column",
    justifyContent: "center",
    alignItems: props => (props.isMobile ? "flex-start" : "center"),
    background: props => (props.isMobile ? theme.secondBackground : "transparent"),
    "& p, button": {
      color: theme.secondBrand,
      marginBottom: 5,
    },
    fontSize: 12,
    fontWeight: 400,
  },
  footerContent: {
    textAlign: "center",
  },
  footerLink: {
    marginRight: -8,
    "& span": {
      textDecoration: "underline",
    },
    "&:hover": {
      color: "rgb(143, 155, 179)",
    },
  },
  footerContainer: {
    display: "table-row",
    alignItems: "center",
    justifyContent: "space-between",
    color: theme.secondBrand,
    width: "100%",
  },
  footerContainerEnd: {
    marginTop: 25,
    alignItems: "center",
    textDecoration: "underline",
    color: theme.secondBrand,
    fontSize: 12,
    width: "100%",
  },
  footBy: {
    display: "inline-block",
  },
  social: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    justifyContent: "center",
    color: theme.secondBrand,
    marginTop: 18,
    fontSize: 24,
  },
  content: {
    // width: props => (props.isMobile ? "100%" : 1200),
    width: "100%",
    padding: 0,
    margin: "0px auto",
    position: "relative",
  },
  footerText: {
    fontSize: 12,
    fontWeight: 400,
    color: theme.secondBrand,
  },
  footerURLText: {
    fontSize: 12,
    fontWeight: 600,
    color: theme.secondBrand,
    marginLeft: 7,
  },
}));

function FooterContent() {
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const classes = useStyles({ isMobile });
  if (isMobile) {
    return null;
  }
  return (
    <div className={classes.footerContainer}>
      <div className={classes.footerText}>Powered by Celer cBridge</div>
      <div className={classes.footerContainerEnd}>
        <label style={{ cursor: "pointer" }} onClick={() => window.open("https://form.typeform.com/to/Q4LMjUaK")}>
          Contact Support
        </label>
      </div>
    </div>
  );
}

const findPeggedTokens = (chainId: number, peggedPairConfigs: PeggedPairConfig[]): TokenInfo[] => {
  if (peggedPairConfigs === undefined) {
    return [];
  }
  const peggedTokens = peggedPairConfigs.map(config => {
    if (config.org_chain_id === chainId) {
      return config.org_token;
    }
    if (config.pegged_chain_id === chainId) {
      return config.pegged_token;
    }
  });
  return peggedTokens.filter(e => e !== undefined).map(e => e as TokenInfo);
};

let inter;
function CBridgeHome(): JSX.Element {
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const classes = useStyles({ isMobile });
  const history = useHistory();
  const { chainId, address, provider } = useWeb3Context();
  const { modal, transferInfo } = useAppSelector(state => state);
  const { showProviderModal, showHistoryModal, showTransferModal } = modal;
  const {
    transferConfig,
    isChainShow,
    chainSource,
    fromChain,
    toChain,
    refreshHistory,
    singleChainList,
    singleChainSelectIndex,
    refreshTransferAndLiquidity,
  } = transferInfo;
  const { chains, chain_token, pegged_pair_configs } = transferConfig;
  const [historyTitleNum, setHistoryTitleNum] = useState(0);
  const [lpTitleNum, setLpTitleNum] = useState(0);
  const [historyPaddingNum, setHistoryPaddingNum] = useState(0);
  const [lpPaddingNum, setLpPaddingNum] = useState(0);
  const transferSupportedChainList = useTransferSupportedChainList(true);
  const transferSupportedTokenList = useTransferSupportedTokenList();
  const dispatch = useAppDispatch();

  const handleCloseProviderModal = () => {
    dispatch(closeModal(ModalName.provider));
  };
  const handleCloseHistoryModal = () => {
    dispatch(setRefreshTransferAndLiquidity(!refreshTransferAndLiquidity));
    refreshHistoryList();
    dispatch(closeModal(ModalName.history));
  };
  useEffect(() => {
    const clearTag = localStorage.getItem("clearTag");
    if (clearTag !== "clear") {
      localStorage.clear();
    }
    localStorage.setItem("clearTag", "clear");
    const localeToAddTokenStr = localStorage.getItem("ToAddToken");
    if (localeToAddTokenStr) {
      const localeToAddToken = JSON.parse(localeToAddTokenStr).atoken;
      addChainToken(localeToAddToken);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useAsync(async () => {
    const txHistoryList = await checkTransferHistory({ addr: address, page_size: 5, next_page_token: "" });
    if (txHistoryList?.history?.length > 0) {
      dispatch(setIsHistoryNotEmpty());
    }
  }, [address, dispatch]);

  useEffect(() => {
    document.addEventListener("visibilitychange", function () {
      // console.log(document.visibilityState);
      if (document.visibilityState == "hidden") {
        clearInterval(inter);
      } else if (document.visibilityState == "visible") {
        if (address) {
          refreshHistoryList();
          clearInterval(inter);
          inter = setInterval(() => {
            refreshHistoryList();
          }, 60000);
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, refreshHistory]);
  const refreshHistoryList = () => {
    gethistoryList();
  };
  useEffect(() => {
    if (address) {
      refreshHistoryList();
      clearInterval(inter);
      inter = setInterval(() => {
        refreshHistoryList();
      }, 60000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, refreshHistory]);

  useEffect(() => {
    if (toChain && toChain !== undefined && transferSupportedChainList.length > 0) {
      // if (transferSupportedChainList.)
      const toChainNotSuitableForSourceChain =
        transferSupportedChainList.filter(chainInfo => {
          return chainInfo.id === toChain.id;
        }).length === 0;

      if (toChainNotSuitableForSourceChain) {
        setToChainMethod(transferSupportedChainList[0].id);
      }
    }
  }, [transferSupportedChainList]);

  useEffect(() => {
    const cacheTokenSymbol = localStorage.getItem("selectedTokenSymbol");

    if (fromChain && fromChain !== undefined && toChain && toChain !== undefined) {
      if (transferSupportedTokenList.length > 0) {
        const potentialTokenList = transferSupportedTokenList.filter(tokenInfo => {
          return (tokenInfo.token.display_symbol ?? tokenInfo.token.symbol) === cacheTokenSymbol;
        });

        if (potentialTokenList.length === 0) {
          dispatch(setSelectedToken(transferSupportedTokenList[0]));
        } else {
          dispatch(setSelectedToken(potentialTokenList[0]));
        }
      }
    }
  }, [transferSupportedTokenList]);

  const getTxStatus = async link => {
    const txid = link.split("/tx/")[1];
    if (txid) {
      const res = await provider?.getTransactionReceipt(txid);
      return res;
    } else {
      return "";
    }
  };
  const gethistoryList = async () => {
    let paddigNum = 0;
    let num = 0;
    const res = await transferHistory({ addr: address, page_size: 50, next_page_token: "" });
    if (res) {
      const hisList = res.history;
      let newList = hisList;
      let localTransferList;
      let noExitList;
      const promiseList: Array<Promise<any>> = [];
      const localTransferListStr = localStorage.getItem("transferListJson");
      if (localTransferListStr) {
        localTransferList = JSON.parse(localTransferListStr)[address];
        const newLocalTransferList: TransferHistory[] = [];
        localTransferList?.map((localItem, i) => {
          if (localItem && localItem !== "null") {
            newLocalTransferList.push(localItem);
            if (
              localItem?.status === TransferHistoryStatus.TRANSFER_FAILED ||
              localItem?.txIsFailed ||
              Number(localItem.src_send_info.chain.id) !== Number(chainId)
            ) {
              //过滤已经失败的tx
              const nullPromise = new Promise(resolve => {
                resolve(0);
              });
              promiseList.push(nullPromise);
            } else {
              const promistx = getTxStatus(localItem.src_block_tx_link); //查询本地记录的tx状态
              promiseList.push(promistx);
            }
          }
        });
        localTransferList = newLocalTransferList;
      }
      Promise.all(promiseList).then(resList => {
        resList?.map((pItem, i) => {
          const localItem = localTransferList[i];
          if (pItem) {
            localItem.txIsFailed = Number(pItem.status) !== 1;
            if (localItem.status === TransferHistoryStatus.TRANSFER_SUBMITTING) {
              localItem.status = Number(pItem.status) === 1 ? localItem.status : TransferHistoryStatus.TRANSFER_FAILED;
            } else if (localItem.status === TransferHistoryStatus.TRANSFER_CONFIRMING_YOUR_REFUND) {
              localItem.status =
                Number(pItem.status) === 1 ? localItem.status : TransferHistoryStatus.TRANSFER_REFUND_TO_BE_CONFIRMED;
            }
          }
          return pItem;
        });
        noExitList = localTransferList ? dataClone(localTransferList) : [];
        hisList?.map(item => {
          localTransferList?.map((localItem, i) => {
            if (Number(localItem.ts) < Number(hisList[hisList.length - 1].ts)) {
              noExitList[i].hide = true;
            } else if (item.transfer_id === localItem.transfer_id) {
              noExitList[i].hide = true;
              if (localItem.status === TransferHistoryStatus.TRANSFER_CONFIRMING_YOUR_REFUND) {
                //如果本地是CONFIRMING，接口返回的是TO BE CONFIRMED
                if (item.status === TransferHistoryStatus.TRANSFER_REFUND_TO_BE_CONFIRMED) {
                  if (!localItem.txIsFailed) {
                    //没失败过就置成CONFIRMING，失败过就正常展示
                    item.status = TransferHistoryStatus.TRANSFER_CONFIRMING_YOUR_REFUND;
                  }
                  item.updateTime = localItem.updateTime;
                  item.txIsFailed = localItem.txIsFailed;
                }
              }
            }
            return localItem;
          });
          return item;
        });
        const newNoExitList = noExitList?.filter(item => !item.hide);
        newList = newNoExitList ? [...newNoExitList, ...hisList] : hisList;

        newList?.map(item => {
          if (
            item.status === TransferHistoryStatus.TRANSFER_TO_BE_REFUNDED ||
            item.status === TransferHistoryStatus.TRANSFER_REFUND_TO_BE_CONFIRMED
          ) {
            num += 1;
          }
          if (
            item.status !== TransferHistoryStatus.TRANSFER_UNKNOWN &&
            item.status !== TransferHistoryStatus.TRANSFER_FAILED &&
            item.status !== TransferHistoryStatus.TRANSFER_REFUNDED &&
            item.status !== TransferHistoryStatus.TRANSFER_COMPLETED
          ) {
            paddigNum += 1;
          }
          return item;
        });
        setHistoryTitleNum(num);
        setHistoryPaddingNum(paddigNum);
      });
    }
  };
  
  useEffect(() => {
    const totalnum = lpTitleNum + historyTitleNum;
    const totalpaddingnum = lpPaddingNum + historyPaddingNum;
    dispatch(setTotalActionNum(totalnum));
    dispatch(setTotalPaddingNum(totalpaddingnum));
  }, [lpTitleNum, historyTitleNum, historyPaddingNum, lpPaddingNum]);
  useEffect(() => {
    if (chainId) {
      const chainName = getNetworkById(chainId).name;
      localStorage.setItem("chainName", chainName);
    }
  }, [chainId]);

  const getQueryString = name => {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = history.location.search.substr(1).match(reg);
    if (r != null) {
      return unescape(r[2]);
    }
    return null;
  };

  const getDefaultData = (chains, chain_token, sourceChainId, destinationChainId, tokenSymbol) => {
    let sourceChain;
    let destinChain;
    let token;
    const defaultFromChains = chains.filter(item => Number(item.id) === Number(sourceChainId));
    if (defaultFromChains.length > 0) {
      sourceChain = defaultFromChains[0];
    }
    const defaultToChains = chains.filter(item => Number(item.id) === Number(destinationChainId));
    if (defaultToChains.length > 0) {
      destinChain = defaultToChains[0];
    }
    return { sourceChain, destinChain };
  };

  const setDefaultInfo = useCallback(
    (chains, chain_token, peggedPairConfigs: PeggedPairConfig[], chainId) => {
      if (chains.length > 1) {
        const cacheFromChainId = localStorage.getItem("fromChainId");
        const cacheToChainId = localStorage.getItem("toChainId");
        const cacheTokenSymbol = localStorage.getItem("selectedTokenSymbol");
        const dataInfo = getDefaultData(chains, chain_token, cacheFromChainId, cacheToChainId, cacheTokenSymbol); //get info by id
        const { sourceChain, destinChain } = dataInfo;
        const cacheFromChain = sourceChain;
        const cacheToChain = destinChain;
        let defaultFromChain;
        let defaultToChain;
        let defaultToken;

        if (history.location.search) {
          const sourceChainId = Number(getQueryString("sourceChainId"));
          const destinationChainId = Number(getQueryString("destinationChainId"));
          const tokenSymbol = getQueryString("tokenSymbol");
          localStorage.setItem("fromChainId", sourceChainId.toString() || "");
          localStorage.setItem("toChainId", destinationChainId.toString() || "");
          localStorage.setItem("selectedTokenSymbol", tokenSymbol || "");
          localStorage.setItem("sourceFromUrl", "1");
          history.push("/transfer");
        } else if (!history.location.search && chainId) {
          const isSourceFromUrl = localStorage.getItem("sourceFromUrl");
          const chainInfo = chains.filter(item => Number(item.id) === chainId);
          //处理fromChain
          if (isSourceFromUrl === "1") {
            //处理url有参数
            if (cacheFromChain && cacheFromChain !== "undefined") {
              const localFromChain = cacheFromChain;
              const newLocalFromCahinInfo = chains.filter(item => Number(item.id) === localFromChain.id);
              if (newLocalFromCahinInfo.length > 0) {
                //本地记录的chainId，项目里支持
                defaultFromChain = localFromChain;
              } else {
                defaultFromChain = chains[0];
              }
            }
          } else {
            if (chainInfo.length > 0) {
              defaultFromChain = chainInfo[0];
            } else {
              defaultFromChain = chains[0];
            }
            if (cacheFromChain && cacheFromChain !== "undefined") {
              const localFromChain = cacheFromChain;
              const newLocalFromCahinInfo = chains.filter(item => Number(item.id) === localFromChain.id);
              if (localFromChain.id !== chainId) {
                if (chainInfo.length > 0) {
                  defaultFromChain = chainInfo[0];
                } else {
                  if (newLocalFromCahinInfo.length > 0) {
                    //本地记录的chainId，项目里支持
                    defaultFromChain = localFromChain;
                  } else {
                    defaultFromChain = chains[0];
                  }
                }
              }
            }
          }

          //处理toChain
          defaultToChain = chains[1];
          if (cacheToChain && cacheToChain !== "undefined") {
            defaultToChain = cacheToChain;
            const newLocalToCahinInfo = chains.filter(item => Number(item.id) === defaultToChain.id);
            if (newLocalToCahinInfo.length > 0 && isSourceFromUrl !== "1") {
              if (Number(defaultToChain.id) === Number(chainId) && cacheFromChain) {
                defaultToChain = cacheFromChain;
              }
            }
          }
          localStorage.setItem("sourceFromUrl", "0");
        } else {
          //这里是为了 在没有链接钱包情况下显示 fromchain 和tochain
          if (cacheFromChain) {
            defaultFromChain = cacheFromChain;
          } else {
            defaultFromChain = chains[0];
          }
          if (cacheToChain) {
            defaultToChain = cacheToChain;
          } else {
            defaultToChain = chains[1];
          }
        }
        //有了fromChain以后统一处理token
        if (defaultFromChain) {
          const defalutTokenList = chain_token[defaultFromChain.id]?.token;
          let defaultToken;

          const defaultTokens = defalutTokenList?.filter(
            item => item.token.display_symbol ?? item.token.symbol === cacheTokenSymbol,
          );
          if (defaultTokens.length > 0) {
            defaultToken = defaultTokens[0];
          } else {
            defaultToken = defalutTokenList[0];
          }

          //设置值
          dispatch(setFromChain(defaultFromChain));
          dispatch(setToChain(defaultToChain));
          dispatch(setCBridgeDesAddresses(defaultToChain?.contract_addr));
          dispatch(setCBridgeAddresses(defaultFromChain?.contract_addr));
          dispatch(setTokenList(defalutTokenList));
          // dispatch(setSelectedToken(defaultToken));
        }
      }
    },
    [dispatch, chainId],
  );

  const handleSelectChain = (id: number) => {
    if (chainSource === "from") {
      if (id !== chainId) {
        switchMethod(id, "");
      }
    } else if (chainSource === "to") {
      setToChainMethod(id);
    } else if (chainSource === "wallet") {
      if (id !== chainId) {
        switchMethod(id, "");
      }
    } else if (chainSource === "SingleChain") {
      const newList = dataClone(singleChainList);
      newList[singleChainSelectIndex]["from_chain_id"] = id;
      dispatch(setSingleChainList(newList));
    }
    dispatch(setIsChainShow(false));
  };

  const switchMethod = (paramChainId, paramToken) => {
    switchChain(paramChainId, paramToken);
    const newTokenList: TokenInfo[] = chain_token[chainId]?.token;
    dispatch(setTokenList(newTokenList));
    if (newTokenList) {
      const cacheTokensymbol = localStorage.getItem("selectedTokenSymbol");
      const cacheTokenList = newTokenList.filter(item => item.token.symbol === cacheTokensymbol);
      if (cacheTokenList.length > 0) {
        dispatch(setSelectedToken(cacheTokenList[0]));
      } else {
        dispatch(setSelectedToken(newTokenList[0]));
      }
    }
  };

  const setToChainMethod = (id?: number) => {
    if (!chains || !chain_token || !chains.length) {
      return;
    }
    const targetToChain: Chain =
      chains.find(chain => chain.id === id) || chains.find(chain => chain.id !== fromChain?.id) || chains[0];
    if (targetToChain) {
      const cacheTochainInfo = JSON.stringify(targetToChain);
      dispatch(setToChain(targetToChain));
      dispatch(setCBridgeDesAddresses(targetToChain?.contract_addr));
    }
  };

  useEffect(() => {
    getTransferConfigs().then(res => {
      if (res) {
        const { chains, chain_token, farming_reward_contract_addr, pegged_pair_configs } = res;
        const localChains = CHAIN_LIST;
        const filteredChains = chains.filter(item => {
          const filterLocalChains = localChains.filter(localChainItem => localChainItem.chainId === item.id);
          return filterLocalChains.length > 0;
        });

        dispatch(
          setTransferConfig({
            chains: filteredChains,
            chain_token,
            farming_reward_contract_addr,
            pegged_pair_configs,
          }),
        );
        dispatch(
          setConfig({
            chains: filteredChains,
            chain_token,
            farming_reward_contract_addr,
            pegged_pair_configs,
          }),
        );
        dispatch(setFarmingRewardAddresses(farming_reward_contract_addr));
        dispatch(setGetConfigsFinish(true));

        const displayChains = filteredChains.filter(item => {
          const enableTokens = chain_token[item.id].token.filter(tokenItem => !tokenItem.token.xfer_disabled);
          const hasPegToken =
            pegged_pair_configs.filter(pgItem => {
              return item.id === pgItem.org_chain_id || item.id === pgItem.pegged_chain_id;
            }).length > 0;
          return enableTokens.length > 0 || hasPegToken;
        });
        setDefaultInfo(displayChains, chain_token, pegged_pair_configs, chainId);
      } else {
        message.error("Interface error !");
      }
    });
  }, [dispatch, setDefaultInfo]);
  return (
    <div className={classes.app}>
      <Layout className={classes.layout}>
        <Header />
        <NewTransfer />
        <Footer className={classes.footer}>
          <div className={classes.footerContent}>
            <FooterContent />
          </div>
        </Footer>
      </Layout>
      {isChainShow && (
        <ChainList
          visible={isChainShow}
          onSelectChain={handleSelectChain}
          onCancel={() => dispatch(setIsChainShow(false))}
        />
      )}
      <HistoryModal visible={showHistoryModal} onCancel={handleCloseHistoryModal} />
      <ProviderModal visible={showProviderModal} onCancel={handleCloseProviderModal} />
    </div>
  );
}

export default CBridgeHome;
