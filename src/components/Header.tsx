import { createUseStyles } from "react-jss";
import { useContext, useState, useEffect, useMemo, useCallback } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { useToggle } from "react-use";
import { ColorThemeContext } from "../providers/ThemeProvider";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { setRefreshGlobalTokenBalance } from "../redux/globalInfoSlice";
import { openModal, ModalName, closeModal } from "../redux/modalSlice";
import { setIsChainShow, setChainSource } from "../redux/transferSlice";
// import { getStartDate } from "../redux/gateway";
import { useWeb3Context } from "../providers/Web3ContextProvider";
import { useCustomContractLoader, useTokenBalance } from "../hooks";
import { ERC20 } from "../typechain/ERC20";
import { ERC20__factory } from "../typechain/factories/ERC20__factory";
import { Theme } from "../theme/theme";
import Account from "./Account";
// import { formatBalance } from "../helpers/format";
import cBrdige2Logo from "../images/favicon.png";
import cBrdige2Light from "../images/cBrdigeLight.png";
import cBrdige2Dark from "../images/cBrdigeDark.png";
// import cBridgeIcon from "../images/favicon.png";
import homeHistoryIcon from "../images/homehistory.svg";
import lightHomeHistory from "../images/lightHomeHistory.svg";
import unicorn from "../images/unicorn.png";
import dark from "../images/dark.svg";
import light from "../images/light.svg";
import { getNetworkById } from "../constants/network";
/* eslint-disable*/

const useStyles = createUseStyles((theme: Theme) => ({
  header: {
    position: "relative",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 0,
    marginTop: 12,
    marginBottom: 12,
    zIndex: 10,
    width: "100%",
  },
  hleft: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  line: {
    width: 2,
    height: 16,
    background: theme.surfacePrimary,
  },
  start: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "5px 12px",
    marginLeft: 12,
  },
  startTitle: {
    fontSize: 12,
    color: theme.secondBrand,
    fontWeight: "bold",
  },
  startNum: {
    fontSize: 18,
    color: theme.data,
    fontWeight: "bold",
  },

  themeIcon: {
    marginLeft: 10,
    padding: 12,
    height: "auto",
    lineHeight: "initial",
    borderRadius: 12,
    alignItems: "center",
    background: theme.secondBackground,
    cursor: "pointer",
  },
  historyBtn: {
    background: theme.secondBackground,
    backdropFilter: "blur(20px)",
    border: "none",
    height: 48,
    borderRadius: 12,
    color: theme.surfacePrimary,
    display: "flex",
    alignItems: "center",
  },
  historyIcon: {
    color: theme.surfacePrimary,
    marginRight: 7,
    width: 24,
    height: 24,
    pointerEvents: "none",
  },
  historyIconLeft: {
    color: theme.surfacePrimary,
    width: 24,
    height: 24,
    pointerEvents: "none",
  },
  historyIcon2: {
    marginRight: 7,
    position: "absolute",
    top: -11,
  },
  historyText: {
    color: theme.unityWhite,
  },
  faucetsText: {
    color: theme.surfacePrimary,
  },
  chainLocale: {
    display: "flex",
    alignItems: "center",
    background: theme.secondBackground,
    borderRadius: 12,
    padding: "0 8px",
    marginLeft: 8,
    cursor: "pointer",
    height: 44,
  },
  activeChainLocale: {
    display: "flex",
    alignItems: "center",
    background: theme.primaryBrand,
    borderRadius: 12,
    padding: "10px 8px",
    marginLeft: 8,
    cursor: "pointer",
  },
  chainLocaleimg: {
    width: 32,
    height: 32,
    borderRadius: "50%",
  },
  chainLocaleName: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 700,
    color: theme.surfacePrimary,
  },
  historyIner: {
    display: "flex",
    alignItems: "center",
    fontSize: 14,
    fontWeight: 700,
    position: "relative",
    zIndex: 300,
  },
  dot: {
    width: 15,
    height: 15,
    border: "1px solid #fff",
    borderRadius: "50%",
    background: theme.infoDanger,
    position: "absolute",
    top: -13,
    right: -13,
  },
  link: {
    color: "#ffffff",
    padding: "6.4px 12px",
  },
  menuBtn: {
    color: theme.surfacePrimary,
    background: "transparent",
    border: 0,
    marginLeft: 8,
    "&:focus, &:hover": {
      color: theme.surfacePrimary,
      background: "transparent",
    },
  },
  mobilePageHeaderWrapper: {
    display: "flex",
    flexFlow: "column",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  mobileLogoWrapper: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: "12px 20px 12px 15px",
  },
  mobileHeaderPanel: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  mobileViewTab: {
    width: "100%",
  },
  headerLeft: {
    // width: "calc(50vw - 208px)",
    display: "flex",
    justifyContent: "start",
    alignItems: "center",
    "& .ant-page-header": {
      padding: "16px 12px 16px 0",
    },
  },
  headerRight: {
    // width: "calc(50vw - 208px)",
    display: "flex",
    justifyContent: "end",
    alignItems: "center",
  },
  leaderboardBox: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    cursor: "pointer",
    gap: 4,
    height: 44,
    marginLeft: 4,
    borderRadius: 12,
    background: theme.secondBackground,
    fontWeight: 700,
    fontSize: 14,
    padding: "10px 8px",
    color: theme.surfacePrimary,
  },
  SGNModal: {
    border: `1px solid ${theme.primaryBackground}`,
    "& .ant-modal-content": {
      background: theme.secondBackground,
      "& .ant-modal-close": {
        color: theme.surfacePrimary,
      },
      "& .ant-modal-header": {
        background: theme.secondBackground,
        borderBottom: "none",
        "& .ant-modal-title": {
          color: theme.surfacePrimary,
          "& .ant-typography": {
            color: theme.surfacePrimary,
          },
        },
      },
      "& .ant-modal-body": {
        minHeight: 235,
      },
      "& .ant-modal-footer": {
        border: "none",
        "& .ant-btn-link": {
          color: theme.primaryBrand,
        },
      },
    },
    "& .ant-typography": {
      color: theme.surfacePrimary,
    },
  },
  modaldes: {
    color: theme.surfacePrimary,
    marginTop: 50,
    fontSize: 14,
    fontWeight: 600,
    textAlign: "center",
  },
  button: {
    height: 56,
    lineHeight: "42px",
    background: theme.primaryBrand,
    border: 0,
    borderRadius: 12,
    fontSize: 18,
    fontWeight: 700,
    marginTop: 24,
  },
  logoWrapper: {
    cursor: "pointer",
  },
}));

const historyButtonStyles = createUseStyles((theme: Theme) => ({
  box: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 22,
    borderRadius: 12,
    background: theme.primaryBrand,
  },
  titleBox: {
    fontWeight: 400,
    fontSize: 12,
    padding: "0 4px 0 6px",
    color: theme.surfacePrimary,
  },
  mobileHistoryBtnWrapper: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    background: theme.primaryBackground,
    borderRadius: 12,
    height: 22,
    paddingLeft: 2,
    paddingRight: 4,
  },
  mobileHistoryBtnIcon: {
    fontSize: 18,
    color: theme.surfacePrimary,
    marginRight: 2,
    width: 18,
    height: 18,
    pointerEvents: "none",
  },
  mobileHistoryText: {
    fontSize: 14,
    fontWeight: 400,
    color: theme.surfacePrimary,
  },
  dot: {
    width: 8,
    height: 8,
    border: "1px solid #fff",
    borderRadius: "50%",
    background: theme.infoDanger,
    position: "absolute",
    top: -3,
    right: 0,
  },
}));

type HistoryButtonProps = {
  totalActionNum: number;
  totalPendingNum: number;
  onClick: () => void;
};

function HistoryButton({ totalActionNum, totalPendingNum, onClick }: HistoryButtonProps) {
  const styles = historyButtonStyles();
  const { themeType } = useContext(ColorThemeContext);
  let content;
  if (totalActionNum) {
    content = (
      <div className={styles.box} onClick={onClick}>
        <div className={styles.titleBox}>
          <img style={{ maxWidth: "100%", maxHeight: "100%", height: 16 }} src="./unicorn.png" alt="" />
          <span style={{ marginLeft: 2 }}>{`${totalActionNum} Action${
            Number(totalActionNum) !== 1 ? "s" : ""
          } Required`}</span>
        </div>
        <div className={styles.dot} />
      </div>
    );
  } else if (totalPendingNum) {
    content = (
      <div className={styles.box} onClick={onClick}>
        <div className={styles.titleBox}>
          <span>{` ${totalPendingNum} Pending`}</span>
          <LoadingOutlined style={{ fontSize: 12, marginLeft: 2, color: "#fff" }} />
        </div>
      </div>
    );
  } else {
    content = (
      <div className={styles.mobileHistoryBtnWrapper} onClick={onClick}>
        <img
          src={themeType === "dark" ? homeHistoryIcon : lightHomeHistory}
          className={styles.mobileHistoryBtnIcon}
          alt="homeHistoryIcon icon for history"
        />
        <span className={styles.mobileHistoryText}>History</span>
      </div>
    );
  }
  return content;
}

export default function Header(): JSX.Element {
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const classes = useStyles();
  const [startDate, setStartDate] = useState<any>({});
  const [sGNModalState, setSGNModalState] = useState(false);
  const { themeType, toggleTheme } = useContext(ColorThemeContext);
  const { provider, network, signer, chainId, address } = useWeb3Context();
  const dispatch = useAppDispatch();
  const { totalActionNum, totalPaddingNum, fromChain, transferConfig, tokenList, selectedToken } = useAppSelector(
    state => state.transferInfo,
  );
  const { chains } = transferConfig;
  const tokenContract = useCustomContractLoader(provider, selectedToken?.token?.address || "", ERC20__factory) as
    | ERC20
    | undefined;
  const [tokenBalance, , , refreshBlance] = useTokenBalance(tokenContract, address);

  // const logoUrl = isMobile && signer ? cBridgeIcon : themeType === "dark" ? cBrdige2Dark : cBrdige2Light;
  const logoUrl = cBrdige2Logo;
  const biglogoUrl = themeType === "dark" ? cBrdige2Dark : cBrdige2Light;
  const toggleIconUrl = themeType === "dark" ? light : dark;
  const [showFaucet, toggleFaucet] = useToggle(false);

  const tokenInfo = useMemo(() => {
    return tokenList
      ?.filter(token => token?.token?.symbol !== "ETH" && token?.token?.symbol !== "WETH")
      ?.map(token => ({ symbol: token?.token?.symbol || "", address: token?.token?.address || "" }));
  }, [tokenList]);
  const showChain = type => {
    if (!signer) {
      return;
    }
    dispatch(setChainSource(type));
    dispatch(setIsChainShow(true));
  };
  useEffect(() => {
    // getDate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId]);

  // useEffect(() => {
  //   const tokenBalanceString = tokenBalance.toString();
  //   dispatch(setRefreshGlobalTokenBalance(tokenBalanceString));
  // }, [dispatch, tokenBalance]);

  const handleOpenHistoryModal = () => {
    dispatch(openModal(ModalName.history));
  };
  const closeFaucet = () => {
    // refreshBlance();
    dispatch(setRefreshGlobalTokenBalance());
    toggleFaucet();
  };

  const openCampagin = () => {
    window.open("https://cbridge-campaign.netlify.app/", "_blank");
  };
  const openAnalytics = () => {
    window.open("https://cbridge-analytics.celer.network/", "_blank");
  };

  const openSgnSite = () => {
    window.open("https://test-sgn.celer.network", "_blank");
  };
  const openFeedBAckSite = () => {
    window.open("https://form.typeform.com/to/UeY0braS", "_blank");
  };
  const cBridgeV1Url = "https://cbridge-v1-legacy.celer.network";
  const getstatusText = () => {
    let content;
    if (totalActionNum) {
      content = (
        <div className={classes.historyIner}>
          <img className={classes.historyIcon2} width={22} key="1" src={unicorn} alt="" />
          <span style={{ marginLeft: 30 }}>{`${totalActionNum} Action${
            Number(totalActionNum) !== 1 ? "s" : ""
          } Required`}</span>
          <div className={classes.dot} />
        </div>
      );
    } else if (totalPaddingNum) {
      content = (
        <div className={classes.historyIner}>
          <span>{` ${totalPaddingNum} Pending`}</span>
          <LoadingOutlined style={{ fontSize: 18, marginRight: 6, fontWeight: 700, marginLeft: 6, color: "#fff" }} />
        </div>
      );
    } else {
      content = (
        <div
          className={classes.historyIner}
          style={
            themeType === "dark"
              ? { background: "#232530", color: "#ffffff" }
              : { background: "#ffffff", color: "#2e3a59" }
          }
        >
          <img
            key="3"
            src={themeType === "dark" ? homeHistoryIcon : lightHomeHistory}
            className={classes.historyIcon}
            alt="homeHistoryIcon icon for fauset"
            style={{ marginRight: 0 }}
          />
          History
        </div>
      );
    }
    return content;
  };
  // const { totalTxVolume, last24HourTxVolume } = startDate;
  const { modal } = useAppSelector(state => state);
  const { showMenuModal } = modal;
  const handleShowMenuModal = useCallback(() => {
    dispatch(openModal(ModalName.menu));
  }, [dispatch]);
  const handleCloseMenuModal = () => {
    dispatch(closeModal(ModalName.menu));
  };
  if (isMobile) {
    return (
      <div className={classes.mobilePageHeaderWrapper}>
        <div className={classes.mobileLogoWrapper}>
          <div className={classes.mobileHeaderPanel} style={{ flex: "1 0 auto" }}>
            <div style={{ marginRight: 2 }}>
              {signer && (
                <HistoryButton
                  totalActionNum={totalActionNum}
                  totalPendingNum={totalPaddingNum}
                  onClick={() => handleOpenHistoryModal()}
                />
              )}
            </div>
            <Account />
            <div className={classes.themeIcon} onClick={toggleTheme}>
              <div style={{ width: 20, height: 20 }}>
                <img src={toggleIconUrl} style={{ width: "100%", height: "100%" }} alt="protocol icon" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.header}>
      <div className={classes.hleft}>
        <div className={classes.headerLeft}></div>
      </div>

      <div className={classes.headerRight}>
        <div>
        {signer && (
          <div
            className={totalActionNum || totalPaddingNum ? classes.activeChainLocale : classes.chainLocale}
            onClick={() => {
              handleOpenHistoryModal();
            }}
          >
            <div className={classes.historyText}>{getstatusText()}</div>
          </div>
        )}
        </div>
        {signer && (
          <div
            className="chainLocale"
            style={
              themeType === "dark"
                ? { background: "#232530", color: "#ffffff" }
                : { background: "#ffffff", color: "#2e3a59" }
            }
            onClick={() => {
              showChain("wallet");
            }}
          >
            <img className={classes.historyIcon} style={{ marginRight: 0 }} src={getNetworkById(chainId)?.iconUrl} />
            <span
              style={{
                color: themeType === "dark" ? "white" : "black",
                fontWeight: 700,
                fontSize: 14,
                marginLeft: 4,
                marginRight: 8,
              }}
            >
              {getNetworkById(chainId)?.name}
            </span>
          </div>
        )}
        <Account />
        <div className={classes.themeIcon} onClick={toggleTheme}>
          <div style={{ width: 20, height: 20 }}>
            <img src={toggleIconUrl} style={{ width: "100%", height: "100%" }} alt="protocol icon" />
          </div>
        </div>
      </div>
    </div>
  );
}
