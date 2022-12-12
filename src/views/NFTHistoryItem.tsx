import { useContext, useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { InfoCircleOutlined, LinkOutlined } from "@ant-design/icons";
import moment from "moment";
import { getAddress } from "ethers/lib/utils";
import { Tooltip } from "antd";
import { ColorThemeContext } from "../providers/ThemeProvider";
import { NFTBridgeStatus, NFTHistory, S3NFTConfig } from "../constants/type";
import { useAppSelector } from "../redux/store";
import { Theme } from "../theme";
import { getNetworkById } from "../constants/network";
import runRightIconDark from "../images/runRightDark.svg";
import runRightIconLight from "../images/runRightLight.svg";
import { formatBlockExplorerUrlWithTxHash } from "../utils/formatUrl";
import { storageConstants } from "../constants/const";
import { useWeb3Context } from "../providers/Web3ContextProvider";
import { dataClone } from "../helpers/dataClone";

interface NFTHistoryItemProps {
  item: NFTHistory;
  nftList: S3NFTConfig[];
  onLocalItemRemoved: () => void;
}

const useStyles = createUseStyles<string, { isMobile: boolean }, Theme>((theme: Theme) => ({
  ListItem: {
    width: "100%",
    background: theme.primaryBackground,
    marginTop: 16,
    borderRadius: 16,
    padding: props => (props.isMobile ? "18px 16px 18px 16px" : "24px 16px 10px 16px"),
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
    marginLeft: props => (props.isMobile ? 0 : 38),
    marginTop: props => (props.isMobile ? 10 : 0),
  },
  itemTokenInfo: {
    marginLeft: 16,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexDirection: "column",
  },
  mobileItemTokenInfo: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  itemTokenName: {
    fontSize: 14,
    color: theme.surfacePrimary,
    fontWeight: 600,
    width: props => (props.isMobile ? 160 : 114),
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
  itemTokenId: {
    fontSize: 14,
    color: "#8F9BB3",
  },
  itemRight: {
    marginBottom: 0,
    marginRight: 6,
    marginLeft: "auto",
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
  chaindes: {
    marginLeft: 6,
  },
  linkIcon: {
    fontSize: 14,
    marginLeft: 0,
  },
}));

/* eslint-disable no-debugger */
export const NFTHistoryItem = (props: NFTHistoryItemProps): JSX.Element => {
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const { themeType } = useContext(ColorThemeContext);
  const { address } = useWeb3Context();

  const classes = useStyles({ isMobile });
  const { item, nftList, onLocalItemRemoved } = props;
  const [nftConfig, setNftConfig] = useState<S3NFTConfig>();

  const srcChain = getNetworkById(item.srcChid);
  const dstChain = getNetworkById(item.dstChid);

  const nowDate = parseInt(`${Date.now() / 1000}`, 10);
  const tooltipShowTime = process.env.REACT_APP_ENV === "TEST" ? 1 : 15;
  const showResult = nowDate - Number(item.createdAt) <= tooltipShowTime * 60;

  useEffect(() => {
    const getPegNFT = (nftConfigs: S3NFTConfig[], nftAddress: string, sourceChainId: number, dstChainId: number) => {
      const pegPairs = nftConfigs.filter(
        nftItem => nftItem?.orig?.chainid === sourceChainId && nftItem.pegs.find(it => it.chainid === dstChainId),
      );
      if (pegPairs && pegPairs.length > 0) {
        const pegNFT = pegPairs.find(pegPair => getAddress(pegPair.orig.addr) === getAddress(nftAddress));
        return pegNFT;
      }
      return undefined;
    };

    const getBurnNFT = (nftConfigs: S3NFTConfig[], nftAddress: string, sourceChainId: number, dstChainId: number) => {
      const burnPairs = nftConfigs.filter(
        nftItem => nftItem.pegs.find(it => it.chainid === sourceChainId) && nftItem?.orig?.chainid === dstChainId,
      );
      if (burnPairs && burnPairs.length > 0) {
        const burnNFT = burnPairs.find(burnPair =>
          burnPair.pegs.find(it => getAddress(it.addr) === getAddress(nftAddress)),
        );
        if (burnNFT) {
          return burnNFT;
        }
      }
      return undefined;
    };

    const getNativeNFTPairs = (nftConfigs: S3NFTConfig[], _selectedNFTAddr: string) => {
      // get config which selected nft exists
      const getNativeConfig = nftConfigs.find(config =>
        config.pegs.find(it => getAddress(_selectedNFTAddr) === getAddress(it.addr)),
      );
      return getNativeConfig;
    };

    if (item && nftList && nftList.length > 0) {
      const pegNFT = getPegNFT(nftList, item.srcNft, item.srcChid, item.dstChid);
      if (pegNFT) {
        setNftConfig(pegNFT);
        return;
      }
      const burnNFT = getBurnNFT(nftList, item.srcNft, item.srcChid, item.dstChid);
      if (burnNFT) {
        setNftConfig(burnNFT);
        return;
      }

      const nativeConfig = getNativeNFTPairs(nftList, item.srcNft);
      if (nativeConfig) {
        setNftConfig(nativeConfig);
      }
    }
  }, [nftList, item]);

  const clearNFTLocalData = historyItem => {
    const localNFTListJsonStr = localStorage.getItem(storageConstants.KEY_NFT_HISTORY_LIST_JSON);
    let localList;
    if (localNFTListJsonStr) {
      const localNFTList = JSON.parse(localNFTListJsonStr)[address];
      localList = localNFTList ? dataClone(localNFTList) : [];
      localNFTList?.map(async (localItem, i) => {
        if (localItem.srcTx === historyItem.srcTx) {
          localList.splice(i, 1);
        }
        return localItem;
      });
    }
    const newJson = { [address]: localList };
    localStorage.setItem(storageConstants.KEY_NFT_HISTORY_LIST_JSON, JSON.stringify(newJson));
    onLocalItemRemoved();
  };

  let statusTips;
  if (item.status === NFTBridgeStatus.NFT_BRIDEGE_SUBMITTING) {
    statusTips = (
      <Tooltip
        overlayClassName={isMobile ? classes.mobileTooltipOverlayStyle : undefined}
        title={
          <span>
            {showResult ? (
              <span>
                Your NFT bridge request is being confirmed on {srcChain.name}. Please allow 8 block confirmations (a few
                minutes) for your bridge request to be confirmed.
              </span>
            ) : (
              <div>
                It seems that your transaction has been stuck for more than 15 minutes.
                <div style={{ marginLeft: 10, marginTop: 15 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "baseline" }}>
                      <div style={{ fontSize: 15, fontWeight: "bold", marginRight: 5 }}>·</div>
                      <div>
                        {" "}
                        If your on-chain tx has completed, please{" "}
                        <a
                          href={`https://form.typeform.com/to/Q4LMjUaK#srctx=${formatBlockExplorerUrlWithTxHash({
                            chainId: srcChain.chainId,
                            txHash: item.srcTx,
                          })}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          contact support
                        </a>{" "}
                        for help.
                      </div>{" "}
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
                        If your on-chain tx has failed, this is usually because the gas limit is set too low. You can
                        manually{" "}
                        <span style={{ color: "#1890ff", cursor: "pointer" }} onClick={() => clearNFTLocalData(item)}>
                          clear this history item
                        </span>{" "}
                        and try again later.
                      </div>{" "}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </span>
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
  } else if (item.status === NFTBridgeStatus.NFT_BRIDEGE_WAITING_FOR_SGN) {
    statusTips = (
      <Tooltip
        overlayClassName={isMobile ? classes.mobileTooltipOverlayStyle : undefined}
        title={
          <span>
            Your NFT bridge request is being confirmed on Celer State Guardian Network (SGN), which might take a few
            minutes.
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
  } else if (item.status === NFTBridgeStatus.NFT_BRIDEGE_WAITING_DST_MINT) {
    statusTips = (
      <Tooltip
        overlayClassName={isMobile ? classes.mobileTooltipOverlayStyle : undefined}
        title={<span>Your NFT is being minted on {dstChain.name}, which takes 5-20 minutes.</span>}
        placement={isMobile ? "bottomLeft" : "right"}
        color="#fff"
        overlayInnerStyle={{ color: "#000" }}
      >
        <div className={classes.waring}>
          Waiting for NFT minting
          <InfoCircleOutlined style={{ fontSize: 13, marginLeft: 6 }} />
        </div>
      </Tooltip>
    );
  } else if (item.status === NFTBridgeStatus.NFT_BRIDEGE_COMPLETE) {
    statusTips = <div className={classes.completed}>Completed</div>;
  }

  const showSupport = item.status !== 3;

  let explorerUrl = srcChain.blockExplorerUrl;
  const index = explorerUrl.lastIndexOf("\\/");
  if (index > 0) {
    explorerUrl = explorerUrl.substring(0, index);
  }

  return (
    <div className={classes.ListItem} key={item.srcTx}>
      <div className={isMobile ? classes.mobileItemContent : classes.itemcont}>
        <div className={isMobile ? classes.mobileItemTokenInfo : classes.itemTokenInfo}>
          <span className={classes.itemTokenName}>{nftConfig?.name}</span>
          <span className={classes.itemTokenId}>
            <a
              className={classes.itemTokenId}
              href={`${explorerUrl}/token/${getAddress(item.srcNft)}?a=${item.tokID}`}
              target="_blank"
              rel="noreferrer"
            >
              #{item.tokID}
            </a>
          </span>
        </div>
        <div className={classes.itemLeft}>
          <div className={classes.itemtitle} style={isMobile ? { minWidth: 0 } : { minWidth: 160 }}>
            <div>
              <img src={srcChain.iconUrl} alt="" className={classes.txIcon} />
            </div>
            <div className={classes.chaindes}>
              <a
                className={classes.chainName}
                href={formatBlockExplorerUrlWithTxHash({ chainId: srcChain.chainId, txHash: item.srcTx })}
                target="_blank"
                rel="noopener noreferrer"
              >
                {srcChain.name} <LinkOutlined className={classes.linkIcon} />
              </a>
            </div>
          </div>
          <img src={themeType === "dark" ? runRightIconDark : runRightIconLight} alt="" className={classes.turnRight} />
          <div className={classes.itemtitle}>
            <div>
              <img src={dstChain.iconUrl} alt="" className={classes.txIcon} />
            </div>
            <div className={classes.chaindes}>
              {item.dstTx ? (
                <a
                  className={classes.linktitle}
                  href={formatBlockExplorerUrlWithTxHash({ chainId: dstChain.chainId, txHash: item.dstTx })}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {dstChain.name} <LinkOutlined className={classes.linkIcon} />
                </a>
              ) : (
                <div className={classes.linktitle}> {dstChain.name}</div>
              )}
            </div>
          </div>
        </div>
        <div className={isMobile ? classes.mobileItemRight : classes.itemRight}>
          <div className={showSupport ? classes.showSuppord : ""}>
            {statusTips}
            <div className={classes.itemTime}>
              {moment(Number(item.createdAt) * 1000).format("YYYY-MM-DD HH:mm:ss")}
            </div>
            {showSupport && (
              <a
                href={`https://form.typeform.com/to/Q4LMjUaK#srctx=${item.srcTx}&transferid=${item.srcNft}`}
                target="_blank"
                rel="noreferrer"
              >
                Contact Support
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
