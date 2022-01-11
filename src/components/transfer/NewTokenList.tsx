import { Input, Modal, Spin } from "antd";
import { FC, useState, useEffect } from "react";
import { createUseStyles } from "react-jss";
import { useAsync } from "react-use";
import { useWeb3Context } from "../../providers/Web3ContextProvider";
import { useContractsContext } from "../../providers/ContractsContextProvider";
import { useAppSelector } from "../../redux/store";
import { Theme } from "../../theme";
import TokenItem from "./NewTokenItem";
// import { useMergedTokenList } from "../../hooks/useMergedTokenList";
import { ensureSigner } from "../../hooks/contractLoader";
import { usePeggedPairConfig } from "../../hooks/usePeggedPairConfig";
import { TokenInfo } from "../../constants/type";
import { NETWORKS } from "../../constants/network";
import { ERC20__factory } from "../../typechain/factories/ERC20__factory";
import { formatDecimal } from "../../helpers/format";
import { useTransferSupportedTokenList } from "../../hooks/transferSupportedInfoList";
import ringBell from "../../images/ringBell.svg";

/* eslint-disable*/
/* eslint-disable camelcase */

const useStyles = createUseStyles<string, { isMobile: boolean }, Theme>((theme: Theme) => ({
  tokenModal: {
    width: props => (props.isMobile ? "100%" : 512),
    minWidth: props => (props.isMobile ? "100%" : 448),
    background: theme.secondBackground,
    border: props => (props.isMobile ? 0 : `1px solid grey`),
    "& .ant-modal-content": {
      background: theme.secondBackground,
      boxShadow: props => (props.isMobile ? "none" : ""),
    },
    "& .ant-modal-body": {
      padding: "0 !important",
    },
    "& .ant-modal": {
      background: theme.secondBackground,
    },
    "& .ant-modal-header": {
      background: `${theme.secondBackground} !important`,
    },
    "& .ant-modal-title": {
      color: `${theme.surfacePrimary} !important`,
    },
  },
  card: {
    background: theme.secondBackground,
    width: "100%",
    paddingBottom: 15,
    "@global": {
      ".ant-list-item": {
        padding: "10px 12px",
      },
      ".ant-list-item-meta-title": {
        fontSize: 16,
        marginBottom: 0,
      },
      ".ant-list-item-meta-description": {
        fontSize: 12,
      },
    },
    "&.ant-card": {
      height: "100%",
    },
    "& .ant-card-body": {
      padding: 0,
      overflow: "hidden",
    },

    "& .ant-list-item": {
      border: "none",
    },

    "& .ant-list-item-meta": {
      alignItems: "center",
    },
    "& .ant-card-head-title": {
      padding: "24px 0",
    },
  },
  item: {
    cursor: "pointer",
    overflow: "hidden",
    "&:hover": {
      background: theme.surfacePrimary10,
      transition: "ease 0.2s",
    },
  },
  activeItem: {
    composes: ["item"],
    background: theme.secondBackground,
    border: `1px solid ${theme.primaryBrand} !important`,
    transition: "ease 0.2s",
    borderRadius: 16,
  },
  litem: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: theme.secondBrand,
  },
  itemLeft: {
    display: "flex",
    alignItems: "center",
  },
  tokenName: {
    fontSize: 16,
    color: theme.secondBrand,
    textAlign: "left",
  },
  tokenSymbol: {
    fontSize: 12,
    color: theme.secondBrand,
    textAlign: "left",
  },
  search: {
    margin: 16,
    "& .ant-input": {
      fontSize: 14,
      background: theme.secondBackground,
      color: theme.secondBrand,
    },
    "& .ant-input-affix-wrapper:not(.ant-input-affix-wrapper-disabled):hover": {
      borderColor: "#1890ff",
    },
    "& .ant-input-affix-wrapper:focus, .ant-input-affix-wrapper-focused": {
      borderColor: "#1890ff",
    },
  },
  searchinput: {
    width: "100%",
    height: 48,
    borderRadius: 100,
    border: "1px solid #4e4c4c",
    background: theme.secondBackground,
  },
  itemList: {
    maxHeight: 510,
    minHeight: 126,
    overflowY: "auto",
  },
  moreOptionNote: {
    margin: 16,
    height: 56,
    borderRadius: 16,
    padding: "8px, 12px, 8px, 12px",
    background: "#8F9BB33D",
    display: "flex",
    alignItems: "center",
  },
  moreOptionIcon: {
    margin: 17,
  },
}));

interface IProps {
  onSelectToken: (symbol: string) => void;
  visible: boolean;
  onCancel: () => void;
}

const TokenList: FC<IProps> = ({ onSelectToken, visible, onCancel }) => {
  const {
    contracts: { bridge },
  } = useContractsContext();
  const { provider, address, chainId } = useWeb3Context();
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const classes = useStyles({ isMobile });
  const { fromChain, toChain, transferConfig } = useAppSelector(state => state.transferInfo);

  const transferSupportedTokenList = useTransferSupportedTokenList();

  const [searchText, setSearchText] = useState("");
  const pegConfig = usePeggedPairConfig();

  const [tokenListWithBalance, setTokenListWithBalance] = useState(transferSupportedTokenList);

  const [filterTokenList, setFilterTokenList] = useState(transferSupportedTokenList);

  const [tokenList, setTokenList] = useState(transferSupportedTokenList);

  const [loading, setLoadig] = useState(false);

  const sortExclusiveTokenSymbols = ["USDT", "USDC", "ETH", "WETH"];

  // 获取token列表的balance
  useAsync(async () => {
    if (fromChain?.id !== chainId) {
      const balanceList = transferSupportedTokenList.map(item => {
        return {
          ...item,
          balance: "--",
        };
      });
      setTokenListWithBalance(balanceList);
    } else {
      if (typeof provider !== "undefined" && ERC20__factory && address) {
        const signer = await ensureSigner(provider);
        if (!signer || !bridge) {
          return;
        }
        let promiseList: Array<any> = [];

        transferSupportedTokenList.forEach(tokenInfo => {
          try {
            if (fromChain?.id !== chainId) {
              return "--";
            }
            const chainIds = [
              NETWORKS.mainnet.chainId,
              NETWORKS.arbitrum.chainId,
              NETWORKS.Optimism.chainId,
              NETWORKS.goerli.chainId,
              NETWORKS.BoBa.chainId,
            ];
            let isNativeToken = false;
            if (chainIds.includes(fromChain?.id) && tokenInfo.token.display_symbol === "ETH") {
              isNativeToken = true;
            } else if (fromChain?.id === 56 && tokenInfo.token.symbol === "BNB") {
              isNativeToken = true;
            } else if (fromChain?.id === 43114 && tokenInfo.token.symbol === "AVAX") {
              isNativeToken = true;
            } else if (fromChain.id === 250 && tokenInfo.token.symbol === "FTM") {
              isNativeToken = true;
            }

            if (isNativeToken) {
              const ethBalancePromise = provider
                .getBalance(address)
                .then(balance => {
                  return {
                    ...tokenInfo,
                    balance: formatDecimal(balance.toString(), tokenInfo?.token?.decimal),
                  };
                })
                .catch(e => {
                  return {
                    ...tokenInfo,
                    balance: "--",
                  };
                });
              promiseList.push(ethBalancePromise);
            } else {
              const tokenFinalAddress = pegConfig?.getTokenBalanceAddress(
                tokenInfo.token.address || "",
                fromChain?.id,
                tokenInfo.token.symbol,
                transferConfig.pegged_pair_configs,
              );
              /* eslint-disable-next-line new-cap */
              const tokenContract = new ERC20__factory(signer).attach(tokenFinalAddress);
              if (!tokenContract || !address) {
                return;
              }

              const balancePromise = tokenContract
                .balanceOf(address)
                .then(balance => {
                  return {
                    ...tokenInfo,
                    balance: formatDecimal(balance.toString(), tokenInfo?.token?.decimal),
                  };
                })
                .catch(e => {
                  return {
                    ...tokenInfo,
                    balance: "--",
                  };
                });

              promiseList.push(balancePromise);
            }
          } catch (e) {
            console.log("Error loading custom contract", e);
          }
        });
        const balanceList = await Promise.all(promiseList);
        setTokenListWithBalance(balanceList);
      }
    }
  }, [transferSupportedTokenList, address, provider, pegConfig]);

  // eslint-disable-next-line react-hooks/exhaustive-deps

  const onInputChange = e => {
    setSearchText(e.target.value?.toLowerCase());
  };
  const onEnter = e => {
    setSearchText(e.target.value?.toLowerCase());
  };

  useEffect(() => {
    if (!fromChain) {
      return;
    }
    const sortedTokenList = sortTokenList(tokenListWithBalance);
    sortedTokenList.sort((a, b) =>
      Number(a.balance?.split(",").join("")) > Number(b.balance?.split(",").join("")) ? -1 : 1,
    );
    setFilterTokenList(sortedTokenList);
  }, [tokenListWithBalance]);

  useEffect(() => {
    if (!fromChain) {
      return;
    }
    const list = filterTokenList?.filter(item => {
      const chainNameFeatch = item.name.toLowerCase().indexOf(searchText) > -1;
      const addressFeatch = item.token.address.toString().toLowerCase().indexOf(searchText) > -1;
      const symbolFeatch = item.token.symbol.toString().toLowerCase().indexOf(searchText) > -1;
      const isFilter = chainNameFeatch || addressFeatch || symbolFeatch;
      return isFilter;
    });
    setTokenList(list);
  }, [searchText, filterTokenList]);

  const sortTokenList = (list: TokenInfo[]) => {
    // split hardToken and normalToken
    const highPriorityTokenList: TokenInfo[] = [];
    const normalTokenList: TokenInfo[] = [];

    list.forEach(item => {
      if (sortExclusiveTokenSymbols.includes(item.token.symbol)) {
        highPriorityTokenList.push(item);
      } else {
        normalTokenList.push(item);
      }
    });
    // sort hardToken
    const sortedHighPriorityTokenList: TokenInfo[] = [];
    sortExclusiveTokenSymbols.forEach(symbol => {
      const targetToken = highPriorityTokenList.find(
        item => item.token.symbol === symbol || item.token.display_symbol === symbol,
      );
      if (targetToken) {
        sortedHighPriorityTokenList.push(targetToken);
      }
    });

    // sort normalToken
    const sortedNormalTokenList: TokenInfo[] = normalTokenList.sort((a, b) => {
      if (a.token.symbol < b.token.symbol) {
        return -1;
      }
      if (a.token.symbol > b.token.symbol) {
        return 1;
      }
      return 0;
    });
    const result = sortedHighPriorityTokenList.concat(sortedNormalTokenList) as Array<TokenInfo>;
    return result;
  };

  return (
    <Modal
      onCancel={onCancel}
      visible={visible}
      footer={null}
      maskClosable={false}
      className={classes.tokenModal}
      title="Select a token"
    >
      <Spin spinning={loading} wrapperClassName="tokenSpin">
        <div className={classes.card}>
          <div className={classes.search}>
            <Input
              className={classes.searchinput}
              placeholder="Search token by name or address"
              onChange={onInputChange}
              onPressEnter={onEnter}
              allowClear
              autoFocus={!isMobile}
            />
          </div>
          <div className={classes.moreOptionNote}>
            <img src={ringBell} className={classes.moreOptionIcon} />
            <span style={{ color: "#8F9BB3", fontSize: 14 }}>
              Below is the supported token list from {fromChain?.name} to {toChain?.name}. More tokens can be found if
              you select other chains.
            </span>
          </div>
          <div className={classes.itemList}>
            {tokenList?.map((item, index) => {
              return (
                <TokenItem
                  key={`${item?.token?.symbol}-${item?.token?.display_symbol}-${index}`}
                  onSelectToken={onSelectToken}
                  tokenInfo={item}
                />
              );
            })}
            {tokenList?.length === 0 && (
              <div style={{ width: "100%", fontSize: 16, textAlign: "center", color: "#fff" }}>No results found.</div>
            )}
          </div>
        </div>
      </Spin>
    </Modal>
  );
};

export default TokenList;
