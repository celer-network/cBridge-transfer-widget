import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Card, Button, Avatar, Tooltip, Modal } from "antd";
import { createUseStyles } from "react-jss";
import { useLocation } from "react-router-dom";
import { useToggle, useNetworkState } from "react-use";
import { formatUnits } from "@ethersproject/units";
import { BigNumber } from "@ethersproject/bignumber";
import { MaxUint256 } from "@ethersproject/constants";
import { debounce } from "lodash";
import { WarningFilled, InfoCircleOutlined, DownOutlined, CloseCircleFilled } from "@ant-design/icons";
import { deleteDecimalPart, safeParseUnits, formatDecimalPart, sub } from "celer-web-utils/lib/format";
import { AccAddress } from "@terra-money/terra.js";
import { JsonRpcProvider } from "@ethersproject/providers";

import { ERC20 } from "../typechain/typechain/ERC20";
import { ERC20__factory } from "../typechain/typechain/factories/ERC20__factory";

import { useContractsContext } from "../providers/ContractsContextProvider";
import { useWeb3Context } from "../providers/Web3ContextProvider";

import { useAppDispatch, useAppSelector } from "../redux/store";
import { closeModal, ModalName, openModal } from "../redux/modalSlice";

import {
  setIsChainShow,
  setChainSource,
  setTokenList,
  setFromChain,
  setToChain,
  setSelectedToken,
  setSelectedTokenSymbol,
  switchChain,
  setEstimateAmtInfoInState,
  setRefreshHistory,
} from "../redux/transferSlice";

import {
  useCustomContractLoader,
  useTokenBalance,
  useBigAmountDelay,
  useNativeETHToken,
  useNonEVMTokenBalance,
} from "../hooks";
import { formatDecimal } from "../helpers/format";
import { TokenInfo } from "../constants/type";
import { getNetworkById } from "../constants/network";
import { validFloatRegex } from "../constants/regex";
import { Theme } from "../theme";

import ProviderModal from "../components/ProviderModal";
import TransferModal from "../components/transfer/TransferModal";
import TokenInput, { ITokenInputChangeEvent } from "../components/TokenInput";
import TokenList from "../components/transfer/TokenList";
import FlowProviderModal from "../components/nonEVM/FlowProviderModal";

import settingIcon from "../images/setting.svg";
import arrowUpDowm from "../images/arrowupdown.svg";
import arrowDowm from "../images/arrow-D.svg";
import RateModal from "../components/RateModal";
import TransferOverview, { getTokenDisplaySymbol } from "./transfer/TransferOverview";
import { WebClient } from "../proto/gateway/GatewayServiceClientPb";
import { EstimateAmtRequest, ErrCode } from "../proto/gateway/gateway_pb";
import { minimum, maximum } from "../helpers/calculation";
import { getTokenSymbol, getTokenListSymbol } from "../redux/assetSlice";
import { PeggedChainMode, usePeggedPairConfig, GetPeggedMode } from "../hooks/usePeggedPairConfig";
import { useMaxPeggedTokenAmount } from "../hooks/useMaxPeggedTokenAmount";
import { useTransferSupportedTokenList } from "../hooks/transferSupportedInfoList";
import { useWalletConnectionContext } from "../providers/WalletConnectionContextProvider";
import { NonEVMMode, useNonEVMContext, isNonEVMChain, getNonEVMMode } from "../providers/NonEVMContextProvider";
import {
  checkTokenReceivabilityForFlowAccount,
  setupTokenVaultForFlowAccount,
  burnConfigFromFlow,
  depositConfigFromFlow,
} from "../redux/NonEVMAPIs/flowAPIs";
import { useNonEVMBigAmountDelay } from "../hooks/useNonEVMBigAmountDelay";
import TerraProviderModal from "../components/nonEVM/TerraProviderModal";
import {
  queryTerraEpochVolumeCaps,
  queryTerraMaxBurn,
  queryTerraMinBurn,
  queryTerraMinDeposit,
  queryTerraMaxDeposit,
  terraNativeBalances,
} from "../redux/NonEVMAPIs/terraAPIs";
import { readOnlyContract } from "../hooks/customReadyOnlyContractLoader";
import { PeggedTokenBridge__factory } from "../typechain/typechain/factories/PeggedTokenBridge__factory";
import { PeggedTokenBridgeV2__factory } from "../typechain/typechain/factories/PeggedTokenBridgeV2__factory";
import { OriginalTokenVault__factory } from "../typechain/typechain/factories/OriginalTokenVault__factory";
import { OriginalTokenVaultV2__factory } from "../typechain/typechain/factories/OriginalTokenVaultV2__factory";
import { Bridge__factory } from "../typechain/typechain";
import { useConfigContext } from "../providers/ConfigContextProvider";
import { useCoMinterCaps } from "../hooks/useCoMinterCaps";
import { coMinterChains } from "../constants/const";
import { useMultiBurnConfig } from "../hooks/useMultiBurnConfig";

/* eslint-disable */
/* eslint-disable camelcase */
const useStyles = createUseStyles<string, { isMobile: boolean }, Theme>((theme: Theme) => ({
  flexCenter: {
    display: "flex",
    flexFlow: "column",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  transferCard: {
    position: "relative",
    width: "100%",
    maxWidth: 560,
    marginTop: props => (props.isMobile ? 0 : 45),
    borderRadius: props => (props.isMobile ? 0 : 16),
    background: props => (props.isMobile ? "transparent" : theme.secondBackground),
    border: props => (props.isMobile ? "none" : `1px solid ${theme.primaryBorder}`),
    "& .ant-card-head": {
      color: theme.primaryBrand,
      fontSize: 22,
      borderBottom: `1px solid ${theme.primaryBorder}`,
      padding: "30px 32px 10px 32px",
      fontWeight: 700,
    },
    "& .ant-card-body": {
      padding: props => (props.isMobile ? "18px 16px 24px 16px" : 32),
    },
    "& .ant-card-head-title": {
      padding: "0",
      lineHeight: 1,
      marginBottom: 7,
      height: "25px",
    },
    "& .ant-card-extra": {
      padding: "0",
      lineHeight: 1,
    },
  },
  settingIcon: {
    width: 24,
    filter: `brightness(${theme.isLight ? 0 : 100})`,
  },
  contCover: {
    width: "100%",
    height: "100%",
    borderRadius: "12px",
    background: theme.transferCover,
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 10,
  },
  cardContent: {
    position: "relative",
    width: props => (props.isMobile ? "100%" : 496),
  },
  trans: {},
  err: {
    width: "100%",
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    minHeight: props => (props.isMobile ? 0 : 24),
  },
  btnare: {
    position: "absolute",
    width: "100%",
    top: 0,
    left: 0,
    zIndex: 15,
  },
  btnarein: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
  transBtn: {
    width: 560,
    margin: "0",
    height: 56,
    fontSize: 16,
    fontWeight: 700,
    borderRadius: 16,
    background: theme.primaryBrand,
    border: 0,
    "&:focus, &:hover": {
      background: theme.buttonHover,
    },
    "&::before": {
      backgroundColor: `${theme.primaryBrand} !important`,
    },
  },
  cont: {
    width: "100%",
    //  fontSize: theme.transferFontS,
  },
  transMobileBtn: {
    marginTop: 20,
    width: "calc(100vw - 32px)",
    height: 55,
    fontSize: 16,
    borderRadius: 16,
    background: theme.primaryBrand,
    border: 0,
    fontWeight: 700,
    "&:focus, &:hover": {
      background: theme.buttonHover,
    },
    "&::before": {
      backgroundColor: `${theme.primaryBrand} !important`,
    },
  },
  transitem: {},
  transitemTitle: {
    //   background: theme.dark.contentBackground,
    color: theme.surfacePrimary,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    // padding: "0 12px",
  },
  transcontent: {
    borderRadius: "16px",
    background: theme.primaryBackground,
    padding: "15px 0",
    marginTop: 8,
  },
  transInfoItem: {
    display: "flex",
    justifyContent: "space-between",
  },
  transInfoTitle: {
    color: theme.secondBrand,
    fontSize: 12,
    fontWeight: 600,
  },
  transInfoContent: {
    color: theme.unityBlack,
    fontSize: 12,
    fontWeight: 600,
    "& img": {
      width: 16,
      height: 16,
    },
  },
  icon: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: props => (props.isMobile ? "17px 0" : "13px 0"),
  },
  source: {
    display: "inline-block",
    marginRight: 8,
    fontSize: 14,
    width: props => (props.isMobile ? "" : 35),
  },
  transselect: {
    background: theme.primaryBackground,
    display: "inline-block",
    minWidth: 100,
    borderRadius: 100,
  },
  transChainame: {
    fontSize: props => (props.isMobile ? 12 : 14),
    fontWeight: props => (props.isMobile ? 400 : 500),
    textAlign: props => (props.isMobile ? "right" : ""),
  },
  transnum: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 12px",
    marginTop: 3,
    color: theme.secondBrand,
  },
  transnumtext: {
    fontSize: 12,
    fontWeight: 600,
    float: "left",
    color: theme.secondBrand,
  },
  transnumlimt: {
    borderBottom: "1px solid #8F9BB3",
    cursor: "pointer",
    fontSize: 12,
  },

  nonEvmRecipientText: {
    fontSize: 12,
    fontWeight: 600,
    display: "flex",
    color: theme.secondBrand,
    padding: "0 12px",
  },

  transndes: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 12px",
    marginTop: 18,
    fontSize: 20,
  },
  transdestext: {
    //   fontSize: theme.transferFontXl,
    color: theme.surfacePrimary,
    float: "left",
    flex: 2,
    "& .ant-input::-webkit-input-placeholder": {
      color: `${theme.surfacePrimary} !important`,
    },
  },
  nonEvmAddressText: {
    color: theme.surfacePrimary,
    float: "left",
    flex: 2,
    "& .ant-input": {
      width: "100%",
      fontSize: 14,
      fontWeight: 600,
    },
    "& .ant-input::-webkit-input-placeholder": {
      color: `${theme.selectChainBorder} !important`,
    },

    "& .ant-input[disabled]": {
      color: `${theme.surfacePrimary} !important`,
    },
  },
  transdeslimt: {
    position: "relative",
    flex: 1,
  },
  investSelct: {
    display: "flex",
    position: "absolute",
    top: -13,
    right: 0,
    alignItems: "baseline",
  },
  selectpic: {
    width: 24,
    height: 24,
    borderRadius: "50%",
    "& img": {
      width: "100%",
      borderRadius: "50%",
    },
  },
  selectdes: {
    marginLeft: 5,
    marginRight: 5,
    fontSize: 16,
    fontWeight: 600,
    color: theme.surfacePrimary,
  },
  selecttoog: {
    height: 14,
    color: theme.surfacePrimary,
  },

  chainSelcet: {
    borderRadius: 16,
    background: theme.primaryBackground,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 8,
    paddingRight: 10,
    height: 40,
    fontSize: 16,
    fontWeight: 600,
  },
  msgBoldInnerbody: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
    color: "#17171A",
    fontWeight: "bold",
    textAlign: "left",
    margin: "8px 12px",
  },

  warningMessage: {
    color: theme.textWarning,
  },
  errInner: {
    color: theme.infoDanger,
    textAlign: "left",
    margin: props => (props.isMobile ? "24px 0 0 0" : "24px 0"),
    background: "#fff",
    boxShadow: "0px 6px 12px -6px rgba(24, 39, 75, 0.12), 0px 8px 24px -4px rgba(24, 39, 75, 0.08)",
    borderRadius: 8,
    fontSize: 14,
  },
  errMessage: {
    width: "100vw",
    position: "fixed",
    top: 122,
    left: 0,
    textAlign: "center",
  },
  errMessageMobile: {
    width: "calc(100vw - 32px)",
    position: "relative",
    top: -45,
    left: 0,
    textAlign: "center",
  },
  messageBody: {
    fontSize: 16,
    padding: "8px 15px",
    background: "#fff",
    //   width: theme.tipsWidth,
    borderRadius: 12,
    margin: "0 auto",
    // textAlign: "left",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  setting: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 432,
    height: 156,
    background: theme.secondBackground,
    borderRadius: 16,
    border: `1px solid ${theme.primaryBorder}`,
  },
  settingTitle: {
    color: theme.surfacePrimary,
    fontSize: 13,
  },
  settingContent: {},
  transcontenttip: {
    fontSize: 12,
    fontWeight: 400,
    color: theme.unityBlack,
  },
  tipTitle: {
    fontSize: 13,
    width: "100%",
    textAlign: "center",
    fontWeight: 400,
    marginBottom: 10,
  },
  mobileTooltipOverlayStyle: {
    "& .ant-tooltip-inner": {
      width: "calc(100vw - 40px) !important",
      borderRadius: 8,
    },
    "& .ant-tooltip-arrow-content": {
      width: 9,
      height: 9,
    },
  },
  mobileRateModal: {
    width: "calc(100% - 32px)",
    minWidth: "calc(100% - 32px)",
    border: `1px solid ${theme.primaryBorder}`,
    borderRadius: 16,
    height: "auto",
    margin: 8,
    "& .ant-modal-content": {
      background: theme.primaryBackground,
      borderRadius: 16,
      "& .ant-modal-header": {
        background: "transparent",
        borderRadius: 16,
      },
      "& .ant-modal-body": {
        padding: "16px 16px",
        background: "transparent",
      },
    },
  },
  safeguardToastBox: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 11,
    width: "100%",
    borderRadius: 4,
    padding: "8px 12px 8px 12px",
    background: theme.primaryBackground,
  },
  errorMsg: {
    fontSize: 14,
    color: theme.infoDanger,
    textAlign: "left",
  },
  warningMsg: {
    fontSize: 14,
    color: theme.infoWarning,
    textAlign: "left",
  },
}));

const Transfer: FC = () => {
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const classes = useStyles({ isMobile });
  const {
    contracts: { bridge, originalTokenVault, originalTokenVaultV2, peggedTokenBridge, peggedTokenBridgeV2 },
    transactor,
  } = useContractsContext();

  const { provider, signer, chainId, address } = useWeb3Context();
  const { connected, walletAddress, walletConnectionButtonTitle } = useWalletConnectionContext();
  const dispatch = useAppDispatch();
  const networkState = useNetworkState();
  const { transferInfo, modal, globalInfo } = useAppSelector(state => state);
  const { refreshGlobalTokenBalance } = globalInfo;

  // const globalTokenBalance = BigNumber.from(globalTokenBalanceString);
  const { showProviderModal, showRateModal, showTransferModal, showFlowProviderModal, showTerraProviderModal } = modal;
  const {
    transferConfig,
    fromChain,
    toChain,
    tokenList,
    selectedToken,
    estimateAmtInfoInState,
    rate,
    refreshHistory,
    refreshTransferAndLiquidity,
    flowTokenPathConfigs,
  } = transferInfo;
  const location = useLocation();
  const pegConfig = usePeggedPairConfig();
  const { multiBurnConfig, multiBurnSpenderAddress } = useMultiBurnConfig();

  const tokenAddress = pegConfig.getTokenBalanceAddress(
    selectedToken?.token?.address || "",
    fromChain?.id,
    selectedToken?.token.symbol,
    transferConfig.pegged_pair_configs,
  );
  const tokenContract = useCustomContractLoader(provider, tokenAddress, ERC20__factory) as ERC20 | undefined;

  const [tokenBalance, , , refreshBalance] = useTokenBalance(tokenContract, address);
  const { getRpcUrlByChainId } = useConfigContext();
  const [amount, setAmount] = useState("");
  const [maxValue, setMaxValue] = useState("");
  const [receiveAmount, setReceiveAmount] = useState(0);
  const [safeguardMaxAmount, setSafeguardMaxAmount] = useState<BigNumber>();
  const [exceedsSafeguard, setExceedsSafeguard] = useState(true);
  const [errorMsg, setErrorMsg] = useState<JSX.Element>(<div />);
  const [hasError, setHasError] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [isTokenShow, toggleIsTokenShow] = useToggle(false);
  const [fee, setFee] = useState(0);
  const [minSendValue, setMinSendValue] = useState<BigNumber>();
  const [tokenEnabled, setTokenEnabled] = useState(true);
  const { isNativeToken, ETHBalance } = useNativeETHToken(fromChain, selectedToken);
  const { isBigAmountDelayed, delayMinutes, delayThresholds } = useBigAmountDelay(
    toChain,
    selectedToken?.token,
    receiveAmount,
  );
  const { nonEVMBigAmountDelayed, nonEVMDelayTimeInMinute, nonEVMDelayThreshold } =
    useNonEVMBigAmountDelay(receiveAmount);
  const { maxPeggedTokenAmount, setMaxPeggedTokenAmount } = useMaxPeggedTokenAmount(receiveAmount);
  const [noTokenOnDst, setNoTokenOnDst] = useState(false);
  const [userBalance, setUserBalance] = useState<string>("0");
  const [denyPeg, setDenyPeg] = useState(false);
  const [spenderAddr, setSpenderAddr] = useState<string>();
  const [allowance, setAllowance] = useState<BigNumber>();
  const [hasGotAllowance, setHasGotAllowance] = useState(false);
  const transferSupportedTokenList = useTransferSupportedTokenList();
  const { nonEVMMode, flowConnected, terraConnected, nonEVMConnected, nonEVMAddress, setFlowInToChain } =
    useNonEVMContext();
  const [terraUSTNotEnough, setTerraUSTNotEnough] = useState(false);

  // when bridge from nonevm chain to evm chain, if the evm wallet not connected,
  // user must to input the evm wallet address.
  const [nonEVMRecipientAddress, setNonEVMRecipientAddress] = useState<string>("");
  const [flowAccountInitialized, setFlowAccountInitialized] = useState(false);
  const [nonEVMTokenBalance] = useNonEVMTokenBalance(nonEVMMode, nonEVMAddress, nonEVMConnected, selectedToken);
  const [coMinterBurnContractAddress, setCoMinterBurnContractAddress] = useState<string>();
  const [coMinterPegTokenAddress, setCoMinterPegTokenAddress] = useState<string>();
  const [coMinterExceedBurnCap, setCoMinterExceedBurnCap] = useState<BigNumber>();

  const getTokenByChainAndTokenSymbol = (chainId, tokenSymbol) => {
    return transferConfig?.chain_token[chainId]?.token.find(tokenInfo => tokenInfo?.token?.symbol === tokenSymbol);
  };

  const { coMinterCapCallback } = useCoMinterCaps(coMinterPegTokenAddress, coMinterBurnContractAddress, fromChain?.id);

  useMemo(() => {
    if (!coMinterCapCallback || !amount || !coMinterPegTokenAddress) {
      return;
    }

    const pegToken = pegConfig.config.pegged_token;
    if (!pegToken) {
      return;
    }
    const getCoMinterCaps = async () => {
      const caps = await coMinterCapCallback();
      if (caps) {
        const { minterSupply } = caps;
        const amountBig = safeParseUnits(amount, pegToken.token.decimal);
        const isCoMinterExceedBurnCap = amountBig.gt(minterSupply);
        console.log(`amountBig:${amountBig.toString()}, supply:${minterSupply.toString()}`);
        if (isCoMinterExceedBurnCap) {
          setCoMinterExceedBurnCap(minterSupply);
          return;
        }
      }
      setCoMinterExceedBurnCap(undefined);
    };
    getCoMinterCaps();
  }, [coMinterCapCallback, amount, pegConfig]);

  const getAllowance = useCallback(() => {
    let multiBurnConfigConditionFailure = false;
    if (multiBurnConfig) {
      if (multiBurnConfig.burn_config_as_org.canonical_token_contract_addr.length === 0) {
        multiBurnConfigConditionFailure = multiBurnConfig.burn_config_as_org.burn_contract_addr !== spenderAddr;
      } else {
        multiBurnConfigConditionFailure =
          multiBurnConfig.burn_config_as_org.canonical_token_contract_addr !== spenderAddr;
      }
    }

    if (
      !tokenContract ||
      !address ||
      !spenderAddr ||
      fromChain?.id !== chainId ||
      multiBurnConfigConditionFailure ||
      (pegConfig.mode === PeggedChainMode.Off &&
        multiBurnConfig === undefined &&
        fromChain.contract_addr !== spenderAddr) ||
      (pegConfig.mode === PeggedChainMode.Deposit && pegConfig.config.pegged_deposit_contract_addr !== spenderAddr) ||
      (pegConfig.mode === PeggedChainMode.Burn && pegConfig.config.pegged_burn_contract_addr !== spenderAddr) ||
      (pegConfig.mode === PeggedChainMode.BurnThenSwap &&
        pegConfig.config.pegged_token.token.address !== spenderAddr) ||
      tokenContract.address !== tokenAddress
    ) {
      return;
    }
    tokenContract
      ?.allowance(address, spenderAddr)
      .then(result => {
        setAllowance(result);
        setHasGotAllowance(true);
      })
      .catch(e => {
        console.log(e);
        setHasGotAllowance(true);
      });
  }, [address, tokenContract, spenderAddr, fromChain, chainId, pegConfig, tokenAddress]);

  const setTokenMethod = (symbol?: string) => {
    if (!transferSupportedTokenList) {
      return;
    }

    const targetToken: TokenInfo =
      transferSupportedTokenList.find(token => {
        return (token.token.display_symbol ?? getTokenListSymbol(token.token.symbol, fromChain?.id ?? 0)) === symbol;
      }) || transferSupportedTokenList[0];

    dispatch(setSelectedToken(targetToken));
    dispatch(
      setSelectedTokenSymbol(
        targetToken?.token.display_symbol ?? getTokenListSymbol(targetToken?.token.symbol, chainId),
      ),
    );
    toggleIsTokenShow();
    setAmount("");
    setMaxValue("");
    setReceiveAmount(0);
    setFee(0);
    setSafeguardMaxAmount(undefined);
  };

  // reset data
  const resetData = () => {
    setAmount("");
    setMaxValue("");
    setReceiveAmount(0);
    setFee(0);
    dispatch(setEstimateAmtInfoInState(null));
    setNoTokenOnDst(false);
    setMaxPeggedTokenAmount(undefined);
    setDenyPeg(false);
  };

  useEffect(() => {
    setTokenEnabled(true);
    setNoTokenOnDst(false);
    setMaxPeggedTokenAmount(undefined);
    dispatch(setEstimateAmtInfoInState(null));
  }, [selectedToken]);

  const generateErrMsg = (msg: string, iconType = "WarningFilled") => {
    return (
      <div className="errInnerbody">
        {iconType === "WarningFilled" ? (
          <WarningFilled style={{ fontSize: 20, marginRight: 5 }} />
        ) : (
          <CloseCircleFilled style={{ fontSize: 20, marginRight: 5 }} />
        )}
        <span style={{ fontSize: 14, marginLeft: 10 }}>{msg}</span>
      </div>
    );
  };
  const generateWaringMsg = (msg: string) => {
    return (
      <div className="warningInnerbody">
        <WarningFilled style={{ fontSize: 20, marginRight: 5 }} />
        <span style={{ color: "#17171A" }}>{msg}</span>
      </div>
    );
  };

  const bigAmountDelayedMsg = (tokenSymbol: string, minutes: string, threshold) => {
    return (
      <div style={{ display: "inline-flex" }}>
        <div className="warningInnerbody" style={{ display: "inline-flex", margin: "8px 0px 8px 12px" }}>
          <WarningFilled style={{ fontSize: 20, marginRight: 10 }} />
        </div>
        <div style={{ display: "inline", margin: "8px 0px" }}>
          <span className="msgInnerbody" style={{ display: "inline", margin: "0px" }}>
            {`Transfer of more than ${threshold} ${tokenSymbol} takes`}
          </span>
          <span
            className="msgInnerbody"
            style={{ display: "inline", margin: "0px 4px", color: "#17171A", fontWeight: "bold" }}
          >
            {`up to ${minutes} minutes`}
          </span>
          <span className="msgInnerbody" style={{ display: "inline", margin: "0px 12px 0px 0px" }}>
            to complete.
          </span>
        </div>
      </div>
    );
  };

  // get Allowance
  useEffect(() => {
    getAllowance();
  }, [getAllowance]);

  // setSpenderAddr
  useEffect(() => {
    if (multiBurnConfig) {
      setSpenderAddr(multiBurnSpenderAddress);
    } else if (pegConfig.mode === PeggedChainMode.Off) {
      setSpenderAddr(bridge?.address ?? "");
    } else {
      setSpenderAddr(pegConfig.getSpenderAddress());
    }
  }, [pegConfig, bridge, multiBurnConfig]);

  // Highlight current token when first loaded.
  useEffect(() => {
    const tokenSymbol =
      (selectedToken?.token?.display_symbol ?? getTokenListSymbol(selectedToken?.token.symbol, chainId)) || "";
    dispatch(setSelectedTokenSymbol(tokenSymbol));
  }, [isTokenShow]);

  // refreshBalance
  useEffect(() => {
    refreshBalance();
  }, [refreshGlobalTokenBalance]);

  // fromChain observer
  useEffect(() => {
    resetData();
  }, [fromChain]);

  // get minSend value
  useEffect(() => {
    if (!selectedToken || !bridge) {
      return;
    }

    bridge
      ?.minSend(selectedToken.token.address)
      .then(res => {
        setMinSendValue(res);
      })
      .catch(e => {
        console.log(e);
      });
  }, [selectedToken, bridge]);

  useEffect(() => {
    setTokenEnabled(true);
    setNoTokenOnDst(false);
    setMaxPeggedTokenAmount(undefined);
    setExceedsSafeguard(false);
    if (isNonEVMChain(fromChain?.id ?? 0)) {
      setNonEVMRecipientAddress(address);
    } else if (isNonEVMChain(toChain?.id ?? 0)) {
      setNonEVMRecipientAddress(nonEVMAddress);
    }
  }, [pegConfig]);

  // After close history modal, need to estimateAmt
  // useEffect(() => {
  //   if (segments[0] === "transfer" && Number(amount) > 0) {
  //   }
  // }, [refreshTransferAndLiquidity]);

  // set user balance
  useEffect(() => {
    let balance = "0";
    if (isNonEVMChain(fromChain?.id ?? 0)) {
      balance = formatDecimalPart(`${nonEVMTokenBalance}`, 6, "floor", true);
    } else {
      balance =
        fromChain?.id === chainId
          ? formatDecimal(isNativeToken ? ETHBalance : tokenBalance, selectedToken?.token?.decimal)
          : "0";
    }
    setUserBalance(balance);
  }, [tokenBalance, ETHBalance, isNativeToken, nonEVMTokenBalance, fromChain, selectedToken]);

  // clear error info
  const clearError = () => {
    setHasError(false);
    setErrorMsg(<div />);
    setExceedsSafeguard(false); // reset safeguard check
  };

  const handleError = errorMsgParam => {
    setHasError(true);
    setErrorMsg(errorMsgParam);
  };

  const handleWarning = warningMsgParam => {
    setErrorMsg(warningMsgParam);
  };

  const wideFromChainNonEVMMode = getNonEVMMode(fromChain?.id ?? 0);
  const fromChainWalletConnected =
    (signer && wideFromChainNonEVMMode === NonEVMMode.off) ||
    (nonEVMConnected && wideFromChainNonEVMMode !== NonEVMMode.off);

  const errorProcessor = {
    isOffline(networkState) {
      if (!networkState.online) {
        return generateErrMsg(`Network error. Please check your Internet connection.`, "CloseCircleFilled");
      }
      return undefined;
    },
    isTokenNotEnable(tokenEnabled, selectedToken, fromChain, toChain) {
      if (!tokenEnabled) {
        return generateErrMsg(
          `${
            selectedToken?.token?.display_symbol ?? getTokenListSymbol(selectedToken?.token?.symbol, fromChain?.id)
          } transfer from ${fromChain?.name} to ${toChain?.name} is not yet supported.`,
        );
      }
      return undefined;
    },
    isDenyPeg(denyPeg, selectedToken, fromChain, toChain) {
      if (denyPeg) {
        return generateErrMsg(
          `${
            selectedToken?.token?.display_symbol ?? getTokenListSymbol(selectedToken?.token?.symbol, fromChain?.id)
          } transfer from ${fromChain?.name} to ${toChain?.name} is not yet supported.`,
        );
      }
      return undefined;
    },
    isNoTokenOnDstChain(noTokenOnDst, toChain) {
      if (noTokenOnDst) {
        return generateErrMsg(
          `Insufficient liquidity on ${toChain?.name}. You may reduce your transfer amount.`,
          "CloseCircleFilled",
        );
      }
      return undefined;
    },
    isFromChainSameAsDstChain(fromChain, toChain) {
      if (fromChain && toChain && fromChain?.id === toChain?.id) {
        return generateErrMsg(`Cannot transfer on the same chain.`);
      }
      return undefined;
    },
    isFromChainDiffFromWalletChain(fromChain, chainId) {
      if (isNonEVMChain(fromChain?.id ?? 0)) {
        return undefined;
      }

      if (fromChain && fromChain?.id !== chainId && chainId > 0) {
        return (
          <div
            className="errInnerbody"
            style={{ margin: "8px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}
          >
            <WarningFilled style={{ fontSize: 20, marginRight: 5, color: "#ff8f00" }} />
            <span style={{ color: "#17171A", marginTop: 3 }}>
              You must switch to <span style={{ fontWeight: "bold" }}> {fromChain?.name} </span>
              to begin the transfer.
            </span>
          </div>
        );
      }
      return undefined;
    },
    isAmountInvalid(amount) {
      if ((!validFloatRegex.test(amount) && amount) || Number(amount) < 0) {
        return generateErrMsg("Please enter a valid number");
      }
      return undefined;
    },
    isAmountParseError(amount, selectedToken) {
      try {
        safeParseUnits(Number(amount).toString(), selectedToken?.token?.decimal);
      } catch {
        return generateErrMsg(`The input amount is too small or exceeds the maximum.`);
      }
      return undefined;
    },
    isValueGtMaxAmount(maxPeggedTokenAmount, amount, selectedToken, fromChain, toChain) {
      const maxAmount = maxPeggedTokenAmount ?? BigNumber.from("0");
      const value = safeParseUnits(Number(amount).toString(), selectedToken?.token?.decimal) || BigNumber.from(0);
      if (maxAmount.gt("0") && value.gt(maxAmount)) {
        return generateErrMsg(
          `At this moment, you can transfer up to ${formatDecimal(maxAmount, selectedToken?.token?.decimal, 2)} 
        ${getTokenSymbol(selectedToken?.token?.symbol, toChain?.id)} from
        ${fromChain?.name} to ${toChain?.name}. 
        You may reduce your transfer amount or try again later.`,
          "CloseCircleFilled",
        );
      }
      return undefined;
    },
    isFeeGtAmount(fee, amount) {
      if (fee > Number(amount) && Number(amount) > 0) {
        return generateErrMsg(`The received amount cannot cover fee.`);
      }
      return undefined;
    },
    isValueGtBalance(amount, selectedToken, isNativeToken, ETHBalance, tokenBalance) {
      const value = safeParseUnits(Number(amount).toString(), selectedToken?.token?.decimal ?? 18) || BigNumber.from(0);
      if (isNonEVMChain(fromChain?.id ?? 0)) {
        return Number(amount) > nonEVMTokenBalance ? generateErrMsg(`Insufficient balance.`) : undefined;
      }
      if (value.gt(isNativeToken ? ETHBalance : tokenBalance)) {
        return generateErrMsg(`Insufficient balance.`);
      }
      return undefined;
    },
    isValueLteMinSendValue(amount, selectedToken, minSendValue, estimateAmtInfoInState, fromChain) {
      const value = safeParseUnits(Number(amount).toString(), selectedToken?.token?.decimal ?? 18) || BigNumber.from(0);
      const minsendNum = Number(formatDecimal(minSendValue, selectedToken?.token?.decimal).split(",").join(""));
      if (minSendValue && value.lte(minSendValue) && Number(amount) > 0 && estimateAmtInfoInState) {
        return generateErrMsg(
          `The transfer amount must be greater than ${minsendNum} ${getTokenSymbol(
            selectedToken?.token?.symbol,
            fromChain?.id,
          )}.`,
        );
      }
      return undefined;
    },
    isValueGtSafeguardMaxAmount(amount, selectedToken, estimateAmtInfoInState, safeguardMaxAmount, fromChain) {
      const value = safeParseUnits(Number(amount).toString(), selectedToken?.token?.decimal ?? 18) || BigNumber.from(0);
      const fromChainNonEVMMode = getNonEVMMode(fromChain?.id ?? 0);

      if (estimateAmtInfoInState && safeguardMaxAmount) {
        const formatedAmount = formatUnits(safeguardMaxAmount!.toString(), selectedToken?.token.decimal);
        let valueExceeds = false;
        let errorDescription = ``;
        if (fromChainNonEVMMode === NonEVMMode.flowMainnet || fromChainNonEVMMode === NonEVMMode.flowTest) {
          valueExceeds = value.gte(safeguardMaxAmount);
          errorDescription = `The transfer amount should be less than
            ${deleteDecimalPart(formatedAmount.toString())}
            ${getTokenSymbol(selectedToken?.token.symbol, fromChain?.id)}. Please reduce your transfer amount.`;
        } else {
          valueExceeds = value.gt(safeguardMaxAmount);
          errorDescription = `The maximum transfer amount is
          ${deleteDecimalPart(formatedAmount.toString())}
          ${getTokenSymbol(selectedToken?.token.symbol, fromChain?.id)}. Please reduce your transfer amount.`;
        }

        if (valueExceeds) {
          setExceedsSafeguard(true);
          return generateErrMsg(errorDescription, "CloseCircleFilled");
        }
      }
      return undefined;
    },
    isRecipientAddressInputInValid(amount, nonEVMRecipientAddress, nonEVMMode, toChain) {
      if (nonEVMMode === NonEVMMode.off) {
        return undefined;
      }
      if (Number(amount) == 0 && nonEVMRecipientAddress.length === 0) {
        return undefined;
      }
      const toChainEVMMode = getNonEVMMode(toChain?.id ?? 0);
      if (toChainEVMMode === NonEVMMode.flowTest || toChainEVMMode === NonEVMMode.flowMainnet) {
        return undefined;
      } else if (toChainEVMMode === NonEVMMode.terraMainnet || toChainEVMMode === NonEVMMode.terraTest) {
        if (AccAddress.validate(nonEVMRecipientAddress)) {
          setNonEVMRecipientAddress(nonEVMRecipientAddress);
          return undefined;
        }
        return generateErrMsg(
          `Please enter a valid recipient address on
              ${toChain?.name}`,
        );
      }

      const addressInputWithout0x = nonEVMRecipientAddress.replace("0x", "");

      if (addressInputWithout0x.match(/^[0-9a-f]+$/i) && addressInputWithout0x.length === 40) {
        setNonEVMRecipientAddress("0x" + addressInputWithout0x);
        return undefined;
      }
      return generateErrMsg(
        `Please enter a valid recipient address on
            ${toChain?.name}`,
      );
    },
    isTerraUSTNotEnough(terraUSTNotEnough) {
      if (terraUSTNotEnough) {
        return generateErrMsg(`Not enough UST for transaction fees`);
      }
      return undefined;
    },
    isExcceedCoMinterCap(coMinterExceedBurnCap) {
      if (estimateAmtInfoInState && coMinterExceedBurnCap) {
        return generateErrMsg(
          `At this moment, you can transfer up to ${formatDecimal(
            coMinterExceedBurnCap,
            pegConfig.config.pegged_token?.token?.decimal,
            2,
          )} 
        ${getTokenSymbol(pegConfig.config.pegged_token?.token?.symbol, toChain?.id)} from
        ${fromChain?.name} to ${toChain?.name}. 
        You may reduce your transfer amount or try again later.`,
          "CloseCircleFilled",
        );
      }
      return undefined;
    },
  };

  const warningProcessor = {
    isBigAmountDelayed(
      isBigAmountDelayed,
      estimateAmtInfoInState,
      exceedsSafeguard,
      loading,
      selectedToken,
      toChain,
      delayMinutes,
      delayThresholds,
    ) {
      if (isBigAmountDelayed && estimateAmtInfoInState && !exceedsSafeguard && !loading) {
        const tokenSymbol = getTokenSymbol(selectedToken?.token?.symbol, toChain?.id);
        return bigAmountDelayedMsg(tokenSymbol, delayMinutes, delayThresholds);
      }
      return undefined;
    },
    isBridgeRateTooSmall(bridgeRate) {
      if (bridgeRate < 0.9) {
        return generateWaringMsg("The current bridge rate for your transfer is low. Please proceed with caution.");
      }
      return undefined;
    },
    isNonEVMBigAmountDelayed(
      nonEVMBigAmountDelayed,
      estimateAmtInfoInState,
      exceedsSafeguard,
      loading,
      selectedToken,
      toChain,
      nonEVMDelayTimeInMinute,
      nonEVMDelayThreshold,
    ) {
      if (nonEVMBigAmountDelayed && estimateAmtInfoInState && !exceedsSafeguard && !loading) {
        const tokenSymbol = getTokenSymbol(selectedToken?.token?.symbol, toChain?.id);
        return bigAmountDelayedMsg(tokenSymbol, nonEVMDelayTimeInMinute, nonEVMDelayThreshold);
      }
      return undefined;
    },
    isFlowRateLimited(fromChain) {
      const fromChainNonEVMMode = getNonEVMMode(fromChain?.id ?? 0);
      if (fromChainNonEVMMode === NonEVMMode.flowMainnet || fromChainNonEVMMode === NonEVMMode.flowTest) {
        return generateWaringMsg(
          "cBridge’s Flow integration is in alpha release, asset bridging from Flow to other chains is rate limited until May 1st.",
        );
      }
      return undefined;
    },
  };

  useEffect(() => {
    clearError();
    const offlineInfo = errorProcessor.isOffline(networkState);
    if (offlineInfo) {
      handleError(offlineInfo);
    } else {
      if (!fromChainWalletConnected) {
        return;
      }
      const errorInfo =
        errorProcessor.isTokenNotEnable(tokenEnabled, selectedToken, fromChain, toChain) ||
        errorProcessor.isDenyPeg(denyPeg, selectedToken, fromChain, toChain) ||
        errorProcessor.isNoTokenOnDstChain(noTokenOnDst, toChain) ||
        errorProcessor.isFromChainSameAsDstChain(fromChain, toChain) ||
        errorProcessor.isFromChainDiffFromWalletChain(fromChain, chainId) ||
        errorProcessor.isAmountInvalid(amount) ||
        errorProcessor.isAmountParseError(amount, selectedToken) ||
        errorProcessor.isValueGtMaxAmount(maxPeggedTokenAmount, amount, selectedToken, fromChain, toChain) ||
        errorProcessor.isFeeGtAmount(fee, amount) ||
        errorProcessor.isValueGtBalance(amount, selectedToken, isNativeToken, ETHBalance, tokenBalance) ||
        errorProcessor.isValueLteMinSendValue(amount, selectedToken, minSendValue, estimateAmtInfoInState, fromChain) ||
        errorProcessor.isValueGtSafeguardMaxAmount(
          amount,
          selectedToken,
          estimateAmtInfoInState,
          safeguardMaxAmount,
          fromChain,
        ) ||
        errorProcessor.isExcceedCoMinterCap(coMinterExceedBurnCap) ||
        errorProcessor.isRecipientAddressInputInValid(amount, nonEVMRecipientAddress, nonEVMMode, toChain) ||
        errorProcessor.isTerraUSTNotEnough(terraUSTNotEnough);
      if (errorInfo) {
        handleError(errorInfo);
      } else {
        const warningInfo =
          warningProcessor.isBigAmountDelayed(
            isBigAmountDelayed,
            estimateAmtInfoInState,
            exceedsSafeguard,
            loading,
            selectedToken,
            toChain,
            delayMinutes,
            delayThresholds,
          ) ||
          warningProcessor.isBridgeRateTooSmall(estimateAmtInfoInState?.bridgeRate) ||
          warningProcessor.isNonEVMBigAmountDelayed(
            nonEVMBigAmountDelayed,
            estimateAmtInfoInState,
            exceedsSafeguard,
            loading,
            selectedToken,
            toChain,
            nonEVMDelayTimeInMinute,
            nonEVMDelayThreshold,
          ) ||
          warningProcessor.isFlowRateLimited(fromChain);
        if (warningInfo) {
          handleWarning(warningInfo);
        }
      }
    }
  }, [
    networkState,
    signer,
    amount,
    chainId,
    fromChain,
    toChain,
    tokenBalance,
    fee,
    estimateAmtInfoInState,
    tokenEnabled,
    safeguardMaxAmount,
    exceedsSafeguard,
    selectedToken,
    isNativeToken,
    ETHBalance,
    isBigAmountDelayed,
    pegConfig,
    noTokenOnDst,
    receiveAmount,
    maxPeggedTokenAmount,
    denyPeg,
    nonEVMConnected,
    nonEVMRecipientAddress,
    nonEVMMode,
    nonEVMBigAmountDelayed,
    terraUSTNotEnough,
    coMinterExceedBurnCap,
  ]);

  const renderCardSetting = () => {
    return (
      <div
        onClick={e => {
          e.stopPropagation();
          handleOpenRateModal();
        }}
        style={{ cursor: "pointer", position: "relative" }}
      >
        <img src={settingIcon} className={classes.settingIcon} alt="setting icon" />
        {showRateModal && (
          <RateModal
            onCancle={() => {
              handleCloseRateModal();
            }}
          />
        )}
      </div>
    );
  };

  const showChain = type => {
    dispatch(setChainSource(type));
    dispatch(setIsChainShow(true));
  };

  // Estimate error processor
  const estimateErrorProcessor = {
    isOffLine(network) {
      if (!network.online) {
        return true;
      }
    },
    isAmountInvalid(amount) {
      if ((!validFloatRegex.test(amount) && amount) || Number(amount) < 0) {
        return true;
      }
    },
    isTokenNotEnable(amount) {
      if (Number(amount) < 0 || Number.isNaN(Number(amount))) {
        return true;
      }
    },
    isDenyPeg(toChain) {
      setDenyPeg(false);
      if (PeggedChainMode.Off !== pegConfig.mode && toChain && selectedToken) {
        const toChainPeggedTokenList = getNetworkById(toChain.id).tokenSymbolList;
        if (!toChainPeggedTokenList.includes(selectedToken.token.symbol)) {
          setDenyPeg(true);
          return true;
        }
      }
    },
    isAmountParseError(amount, selectedToken) {
      try {
        safeParseUnits(Number(amount).toString(), selectedToken?.token?.decimal);
      } catch {
        return true;
      }
    },
    isNoTokenSupported(selectedToken) {
      const canToken = transferSupportedTokenList.find(item => {
        return item.token.symbol === selectedToken?.token.symbol;
      });
      return canToken === undefined;
    },
  };

  const safeguardTask = async (
    pegConfig,
    originalTokenVault,
    originalTokenVaultV2,
    peggedTokenBridge,
    peggedTokenBridgeV2,
    bridge,
  ) => {
    let maxT = BigNumber.from(0);
    let minAmt = BigNumber.from(0);
    let maxAmt = BigNumber.from(0);

    const fromChainNonEVMMode = getNonEVMMode(fromChain?.id ?? 0);
    const toChainNonEVMMode = getNonEVMMode(toChain?.id ?? 0);
    const isDstChainIsFlow = toChainNonEVMMode === NonEVMMode.flowTest || toChainNonEVMMode === NonEVMMode.flowMainnet;
    const isDstChainIsTerra =
      toChainNonEVMMode === NonEVMMode.terraTest || toChainNonEVMMode === NonEVMMode.terraMainnet;

    if (multiBurnConfig) {
      if (fromChainNonEVMMode === NonEVMMode.flowTest || fromChainNonEVMMode === NonEVMMode.flowMainnet) {
        const tokenConfig = await burnConfigFromFlow(
          multiBurnConfig.burn_config_as_org.burn_contract_addr,
          selectedToken?.token.address ?? "",
        );
        minAmt = safeParseUnits(tokenConfig.minBurn.toString(), selectedToken?.token.decimal ?? 8);
        maxAmt = safeParseUnits(tokenConfig.maxBurn.toString(), selectedToken?.token.decimal ?? 8);
      } else if (fromChainNonEVMMode === NonEVMMode.terraTest || fromChainNonEVMMode === NonEVMMode.terraMainnet) {
        const minAmtObject = await queryTerraMinBurn(
          multiBurnConfig.burn_config_as_org.burn_contract_addr,
          multiBurnConfig.burn_config_as_org.token.token.address,
        );
        minAmt = BigNumber.from(minAmtObject);
        const maxAmtObject = await queryTerraMaxBurn(
          multiBurnConfig.burn_config_as_org.burn_contract_addr,
          multiBurnConfig.burn_config_as_org.token.token.address,
        );
        maxAmt = BigNumber.from(maxAmtObject);
      } else if (peggedTokenBridgeV2) {
        let evmTokenAddress = multiBurnConfig.burn_config_as_org.token.token.address;
        minAmt = await peggedTokenBridgeV2.minBurn(evmTokenAddress);
        maxAmt = await peggedTokenBridgeV2.maxBurn(evmTokenAddress);

        if (fromChain && coMinterChains.includes(fromChain.id)) {
          setCoMinterBurnContractAddress(multiBurnConfig.burn_config_as_org.burn_contract_addr);
          setCoMinterPegTokenAddress(multiBurnConfig.burn_config_as_org.token.token.address);
        }
      }

      //rate limite
      if (isDstChainIsFlow) {
        const tokenConfigForDst = await burnConfigFromFlow(
          multiBurnConfig.burn_config_as_dst.burn_contract_addr,
          multiBurnConfig.burn_config_as_dst.token.token.address,
        );
        maxT = safeParseUnits(tokenConfigForDst.cap.toString(), selectedToken?.token.decimal ?? 8);
      } else if (isDstChainIsTerra) {
        const maxTObject = await queryTerraEpochVolumeCaps(
          multiBurnConfig.burn_config_as_dst.burn_contract_addr,
          multiBurnConfig.burn_config_as_dst.token.token.address,
        );
        maxT = BigNumber.from(maxTObject).mul(98).div(100);
      } else {
        const toChainProvider = new JsonRpcProvider(getRpcUrlByChainId(toChain?.id ?? 0));
        const dstPeggedTokenBridge = await readOnlyContract(
          toChainProvider,
          multiBurnConfig.burn_config_as_dst.burn_contract_addr,
          multiBurnConfig.burn_config_as_dst.burn_contract_version > 0
            ? PeggedTokenBridgeV2__factory
            : PeggedTokenBridge__factory,
        );

        if (dstPeggedTokenBridge) {
          maxT = await dstPeggedTokenBridge.epochVolumeCaps(multiBurnConfig.burn_config_as_dst.token.token.address);
          maxT = safeParseUnits(
            formatUnits(maxT, multiBurnConfig.burn_config_as_dst.token.token.decimal),
            multiBurnConfig.burn_config_as_dst.token.token.decimal,
          );
          maxT = maxT.mul(98).div(100);
        }
      }

      if (minAmt.gt(0)) {
        setMinSendValue(minAmt);
      }

      const needsSafeguard = maxT.gt(0) || maxAmt.gt(0);
      if (needsSafeguard) {
        const minValue = minimum(maxAmt, maxT);
        const maxValue = maximum(maxAmt, maxT);
        setSafeguardMaxAmount(minValue.gt(0) ? minValue : maxValue);
      } else {
        setExceedsSafeguard(false);
        setSafeguardMaxAmount(undefined);
      }
      return;
    }

    switch (pegConfig.mode) {
      case PeggedChainMode.Deposit:
        if (fromChainNonEVMMode === NonEVMMode.flowTest || fromChainNonEVMMode === NonEVMMode.flowMainnet) {
          const tokenConfig = await depositConfigFromFlow(
            pegConfig.config.pegged_deposit_contract_addr,
            selectedToken?.token.address ?? "",
          );
          minAmt = safeParseUnits(tokenConfig.minDepo.toString(), selectedToken?.token.decimal ?? 8);
          maxAmt = safeParseUnits(tokenConfig.maxDepo.toString(), selectedToken?.token.decimal ?? 8);
        } else if (fromChainNonEVMMode === NonEVMMode.terraTest || fromChainNonEVMMode === NonEVMMode.terraMainnet) {
          const minAmtObject = await queryTerraMinDeposit(
            pegConfig.config.pegged_deposit_contract_addr,
            pegConfig.config.org_token.token.address,
          );
          minAmt = BigNumber.from(minAmtObject);
          const maxAmtObject = await queryTerraMaxDeposit(
            pegConfig.config.pegged_deposit_contract_addr,
            pegConfig.config.org_token.token.address,
          );
          maxAmt = BigNumber.from(maxAmtObject);
        } else if (originalTokenVault) {
          let evmTokenAddress = pegConfig.config.org_token.token.address;

          if (isNonEVMChain(pegConfig.config.org_chain_id)) {
            evmTokenAddress = pegConfig.config.pegged_token.token.address;
          }
          minAmt = await originalTokenVault.minDeposit(evmTokenAddress);
          maxAmt = await originalTokenVault.maxDeposit(evmTokenAddress);
        }

        //rate limite
        if (isDstChainIsFlow) {
          const tokenConfigForDst = await burnConfigFromFlow(
            pegConfig.config.pegged_burn_contract_addr,
            pegConfig.config.pegged_token.token.address,
          );
          maxT = safeParseUnits(tokenConfigForDst.cap.toString(), selectedToken?.token.decimal ?? 8);
        } else if (isDstChainIsTerra) {
          const maxTObject = await queryTerraEpochVolumeCaps(
            pegConfig.config.pegged_burn_contract_addr,
            pegConfig.config.pegged_token.token.address,
          );
          maxT = BigNumber.from(maxTObject).mul(98).div(100);
        } else {
          const toChainProvider = new JsonRpcProvider(getRpcUrlByChainId(toChain?.id ?? 0));
          const dstPeggedTokenBridge = await readOnlyContract(
            toChainProvider,
            pegConfig.config.pegged_burn_contract_addr,
            pegConfig.config.bridge_version > 0 ? PeggedTokenBridgeV2__factory : PeggedTokenBridge__factory,
          );

          if (dstPeggedTokenBridge) {
            maxT = await dstPeggedTokenBridge.epochVolumeCaps(pegConfig.config.pegged_token.token.address);
            maxT = safeParseUnits(
              formatUnits(maxT, pegConfig.config.pegged_token.token.decimal),
              pegConfig.config.org_token.token.decimal,
            );
            maxT = maxT.mul(98).div(100);
          }
        }

        break;
      case PeggedChainMode.Burn:
        if (fromChainNonEVMMode === NonEVMMode.flowTest || fromChainNonEVMMode === NonEVMMode.flowMainnet) {
          const tokenConfig = await burnConfigFromFlow(
            pegConfig.config.pegged_burn_contract_addr,
            selectedToken?.token.address ?? "",
          );
          minAmt = safeParseUnits(tokenConfig.minBurn.toString(), selectedToken?.token.decimal ?? 8);
          maxAmt = safeParseUnits(tokenConfig.maxBurn.toString(), selectedToken?.token.decimal ?? 8);
        } else if (fromChainNonEVMMode === NonEVMMode.terraTest || fromChainNonEVMMode === NonEVMMode.terraMainnet) {
          const minAmtObject = await queryTerraMinBurn(
            pegConfig.config.pegged_burn_contract_addr,
            pegConfig.config.pegged_token.token.address,
          );
          minAmt = BigNumber.from(minAmtObject);
          const maxAmtObject = await queryTerraMaxBurn(
            pegConfig.config.pegged_burn_contract_addr,
            pegConfig.config.pegged_token.token.address,
          );
          maxAmt = BigNumber.from(maxAmtObject);
        } else if (peggedTokenBridge) {
          let evmTokenAddress = pegConfig.config.pegged_token.token.address;

          if (isNonEVMChain(pegConfig.config.pegged_chain_id)) {
            evmTokenAddress = pegConfig.config.org_token.token.address;
          }
          minAmt = await peggedTokenBridge.minBurn(evmTokenAddress);
          maxAmt = await peggedTokenBridge.maxBurn(evmTokenAddress);

          if (fromChain && coMinterChains.includes(fromChain.id)) {
            setCoMinterBurnContractAddress(pegConfig.config.pegged_burn_contract_addr);
            setCoMinterPegTokenAddress(pegConfig.config.pegged_token.token.address);
          }
        }

        if (isDstChainIsFlow) {
          const tokenConfigForDst = await depositConfigFromFlow(
            pegConfig.config.pegged_deposit_contract_addr,
            pegConfig.config.org_token.token.address,
          );
          maxT = safeParseUnits(tokenConfigForDst.cap.toString(), selectedToken?.token.decimal ?? 8);
        } else if (isDstChainIsTerra) {
          const maxTObject = await queryTerraEpochVolumeCaps(
            pegConfig.config.pegged_deposit_contract_addr,
            pegConfig.config.org_token.token.address,
          );
          maxT = BigNumber.from(maxTObject).mul(98).div(100);
        } else {
          const toChainProvider = new JsonRpcProvider(getRpcUrlByChainId(toChain?.id ?? 0));
          const dstOriginalTokenVault = await readOnlyContract(
            toChainProvider,
            pegConfig.config.pegged_deposit_contract_addr,
            pegConfig.config.vault_version > 0 ? OriginalTokenVaultV2__factory : OriginalTokenVault__factory,
          );

          if (dstOriginalTokenVault) {
            maxT = await dstOriginalTokenVault.epochVolumeCaps(pegConfig.config.org_token.token.address);
            maxT = safeParseUnits(
              formatUnits(maxT, pegConfig.config.org_token.token.decimal),
              pegConfig.config.pegged_token.token.decimal,
            );
            maxT = maxT.mul(98).div(100);
          }
        }

        break;
      default:
        if (bridge) {
          const toChainProvider = new JsonRpcProvider(getRpcUrlByChainId(toChain?.id ?? 0));
          maxAmt = await bridge.maxSend(selectedToken?.token?.address ?? "");
          const dstBridge = await readOnlyContract(toChainProvider, toChain?.contract_addr ?? "", Bridge__factory);
          const dstToken = transferConfig.chain_token[toChain?.id ?? 0].token.find(tokenInfo => {
            return tokenInfo.token.symbol === selectedToken?.token?.symbol;
          })?.token;
          const dstTokenAddress = dstToken?.address;

          if (dstBridge) {
            maxT = await dstBridge.epochVolumeCaps(dstTokenAddress ?? "");
            maxT = safeParseUnits(formatUnits(maxT, dstToken?.decimal), selectedToken?.token.decimal ?? 18);
            maxT = maxT.mul(98).div(100);
          }
        }
        break;
    }

    if (minAmt.gt(0)) {
      setMinSendValue(minAmt);
    }

    const needsSafeguard = maxT.gt(0) || maxAmt.gt(0);
    if (needsSafeguard) {
      const minValue = minimum(maxAmt, maxT);
      const maxValue = maximum(maxAmt, maxT);
      setSafeguardMaxAmount(minValue.gt(0) ? minValue : maxValue);
    } else {
      setExceedsSafeguard(false);
      setSafeguardMaxAmount(undefined);
    }
  };

  const estimateAmt = async (selectedFromChain, selectedToChain, targetToken, value, addr, rate) => {
    const mode = GetPeggedMode(
      fromChain?.id,
      toChain?.id,
      targetToken.token.symbol,
      transferConfig.pegged_pair_configs,
    );
    const estimateRequest = new EstimateAmtRequest();
    estimateRequest.setSrcChainId(selectedFromChain.id);
    estimateRequest.setDstChainId(selectedToChain.id);
    estimateRequest.setTokenSymbol(targetToken?.token.symbol);
    estimateRequest.setAmt(value.toString());
    estimateRequest.setUsrAddr(addr);
    estimateRequest.setSlippageTolerance(Number(rate) * 10000);
    estimateRequest.setIsPegged(mode !== PeggedChainMode.Off || multiBurnConfig !== undefined);

    const client = new WebClient(`${process.env.REACT_APP_GRPC_SERVER_URL}`, null, null);

    const res = await client.estimateAmt(estimateRequest, null);
    return res;
  };

  const estimateAmtResProcessor = (res, targetToken) => {
    if (!res?.getErr()) {
      dispatch(setEstimateAmtInfoInState(res.toObject()));
      const feeBigNum = BigNumber.from(res?.getBaseFee()).add(BigNumber.from(res?.getPercFee()));
      const totalFee = feeBigNum.toString() || "0";
      const tgas = Number(
        formatDecimal(totalFee, getTokenByChainAndTokenSymbol(toChain?.id, targetToken?.token?.symbol)?.token.decimal)
          ?.split(",")
          .join(""),
      );
      const targetReceiveAmounts = res.getEstimatedReceiveAmt();
      const receiveAmounts = formatDecimal(
        targetReceiveAmounts,
        getTokenByChainAndTokenSymbol(toChain?.id, targetToken?.token?.symbol)?.token.decimal,
      )
        ?.split(",")
        .join("");
      setFee(tgas);
      setReceiveAmount(Number(receiveAmounts));
      setNoTokenOnDst(false);
    } else {
      const response = res.toObject();
      if (
        response.err?.code === ErrCode.ERROR_NO_TOKEN_ON_DST_CHAIN ||
        response.err?.code === ErrCode.ERROR_NO_TOKEN_ON_SRC_CHAIN
      ) {
        setTokenEnabled(false);
      }
      if (response.err?.code === ErrCode.ERROR_CODE_NO_ENOUGH_TOKEN_ON_DST_CHAIN) {
        setNoTokenOnDst(true);
      } else {
        setNoTokenOnDst(false);
      }
      setReceiveAmount(0);
      setFee(0);
      dispatch(setEstimateAmtInfoInState(null));
    }
  };

  const debounceFn = useCallback(
    debounce(callback => {
      callback();
    }, 1000),
    [],
  );

  useEffect(() => {
    debounceFn(() =>
      newGetRelayNodeInfo({
        fromChain,
        toChain,
        amount,
        selectedToken,
        address,
        rate,
        networkState,
        pegConfig,
        originalTokenVault,
        originalTokenVaultV2,
        peggedTokenBridge,
        peggedTokenBridgeV2,
        bridge,
      }),
    );
  }, [
    fromChain,
    toChain,
    amount,
    selectedToken,
    address,
    rate,
    networkState,
    pegConfig,
    originalTokenVault,
    originalTokenVaultV2,
    peggedTokenBridge,
    peggedTokenBridgeV2,
    bridge,
  ]);

  const newGetRelayNodeInfo = async ({
    fromChain,
    toChain,
    amount,
    selectedToken,
    address,
    rate,
    networkState,
    pegConfig,
    originalTokenVault,
    originalTokenVaultV2,
    peggedTokenBridge,
    peggedTokenBridgeV2,
    bridge,
  }) => {
    const cannotEstimat =
      estimateErrorProcessor.isOffLine(networkState) ||
      estimateErrorProcessor.isTokenNotEnable(amount) ||
      estimateErrorProcessor.isDenyPeg(toChain) ||
      estimateErrorProcessor.isNoTokenSupported(selectedToken) ||
      estimateErrorProcessor.isAmountInvalid(amount);
    if (cannotEstimat) {
      setLoading(false);
      return;
    }
    if (Number(amount) > 0) {
      setLoading(true);
      try {
        await safeguardTask(
          pegConfig,
          originalTokenVault,
          originalTokenVaultV2,
          peggedTokenBridge,
          peggedTokenBridgeV2,
          bridge,
        );
        const value = safeParseUnits(amount || "0", selectedToken?.token?.decimal);
        const res = await estimateAmt(fromChain, toChain, selectedToken, value, address, rate);
        const fromChainNonEVMMode = getNonEVMMode(fromChain?.id ?? 0);
        if (
          terraConnected &&
          (fromChainNonEVMMode === NonEVMMode.terraMainnet || fromChainNonEVMMode === NonEVMMode.terraTest)
        ) {
          const terraCoins = await terraNativeBalances(nonEVMAddress);
          const ustCoin = terraCoins.get("uusd");
          if (ustCoin) {
            if (Number(ustCoin.amount) > 0) {
              setTerraUSTNotEnough(false);
            } else {
              setTerraUSTNotEnough(true);
            }
          } else {
            setTerraUSTNotEnough(true);
          }
        }
        setLoading(false);
        estimateAmtResProcessor(res, selectedToken);
      } catch (e) {
        console.log("getRelayNodeInfo error:", e);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  const setMaxAmount = () => {
    if (!fromChainWalletConnected) {
      return;
    }

    if (denyPeg) {
      return;
    }

    if (isNonEVMChain(fromChain?.id ?? 0)) {
      const maxSend = formatDecimalPart(`${nonEVMTokenBalance}`, selectedToken?.token.decimal);

      if (!maxSend) {
        return;
      }

      if (maxSend === maxValue) {
        return;
      }
      setLoading(true);
      /// Display amount should be 6-digit
      setAmount(formatDecimalPart(`${nonEVMTokenBalance}`, 6, "floor", true));
      setMaxValue(maxSend);
      dispatch(setEstimateAmtInfoInState(null));
      setNoTokenOnDst(false);
      setReceiveAmount(0);
      return;
    }

    const balance = isNativeToken ? ETHBalance : tokenBalance;
    let maxShow = formatDecimal(balance.toString(), selectedToken?.token?.decimal).split(",").join("");
    let maxSen = formatDecimal(balance.toString(), selectedToken?.token?.decimal, selectedToken?.token?.decimal)
      ?.split(",")
      .join("");

    // native token need to subtract 0.01, but metis is 0.03
    const subGasAmount = isMetisChainGasToken() ? 0.03 : 0.01;
    if (isNativeToken || isMetisChainGasToken()) {
      if (Number(maxSen) <= subGasAmount) {
        maxSen = "0";
        maxShow = "0";
      } else {
        maxSen = sub(Number(maxSen), subGasAmount).toString();
        maxShow = sub(Number(maxShow), subGasAmount).toString();
      }
    }
    if (!maxSen) {
      return;
    }
    if (maxSen === maxValue) {
      return;
    }
    setLoading(true);
    setAmount(maxShow.toString());
    setMaxValue(maxSen.toString());

    dispatch(setEstimateAmtInfoInState(null));
    setNoTokenOnDst(false);
    setReceiveAmount(0);
  };

  const isMetisChainGasToken = () => {
    return fromChain?.id === 1088 && selectedToken?.token.symbol === "Metis";
  };

  const handleTokenInputChange = (e: ITokenInputChangeEvent) => {
    setLoading(true);
    setMaxValue("");
    dispatch(setEstimateAmtInfoInState(null));
    if (!e.value) {
      setReceiveAmount(0);
    }
    setTokenEnabled(true);
    setAmount(e.value);
    setNoTokenOnDst(false);
    if (e.error) {
      setHasError(true);
      setErrorMsg(generateErrMsg(e.error));
    } else {
      setHasError(false);
    }
  };

  const switchMethod = (paramChain, paramToken) => {
    const paramChainId = paramChain.id;
    const nonEVMMode = getNonEVMMode(paramChainId);

    if (nonEVMMode === NonEVMMode.flowMainnet || nonEVMMode === NonEVMMode.flowTest) {
      if (flowConnected) {
        const chain = transferConfig.chains.find(chainInfo => {
          return chainInfo.id === paramChainId;
        });
        if (chain !== undefined) {
          dispatch(setFromChain(chain));
        }
      } else {
        dispatch(openModal(ModalName.flowProvider));
      }
      return;
    } else if (nonEVMMode === NonEVMMode.terraMainnet || nonEVMMode === NonEVMMode.terraTest) {
      if (terraConnected) {
        const chain = transferConfig.chains.find(chainInfo => {
          return chainInfo.id === paramChainId;
        });
        if (chain !== undefined) {
          dispatch(setFromChain(chain));
        }
      } else {
        dispatch(openModal(ModalName.terraProvider));
      }
      return;
    }

    switchChain(paramChain.id, paramToken, (chainId: number) => {
      const chain = transferConfig.chains.find(chainInfo => {
        return chainInfo.id === chainId;
      });
      if (chain !== undefined) {
        dispatch(setFromChain(chain));
      }
    });

    dispatch(setTokenList(transferSupportedTokenList));
    refreshBalance();
  };

  const exchangeFromAndToChain = () => {
    if (!fromChain || !toChain) {
      return;
    }
    const tmpfromChain = fromChain;
    const tmpChain = toChain;
    dispatch(setToChain(tmpfromChain));
    dispatch(setFromChain(tmpChain));
    if (tmpfromChain.id !== tmpChain.id) {
      switchMethod(tmpChain, "");
    }
  };

  const handleCloseProviderModal = () => {
    dispatch(closeModal(ModalName.provider));
  };
  const handleCloseFlowProviderModal = () => {
    dispatch(closeModal(ModalName.flowProvider));
  };
  const handleCloseTerraProviderModal = () => {
    dispatch(closeModal(ModalName.terraProvider));
  };
  const handleCloseTransferModal = () => {
    refreshBalance();
    dispatch(setRefreshHistory(!refreshHistory));
    dispatch(closeModal(ModalName.transfer));
  };

  const handleSuccess = () => {
    setAmount("");
    setMaxValue("");
    setReceiveAmount(0);
    setFee(0);
    dispatch(setEstimateAmtInfoInState(null));
  };

  const handleSelectToken = (symbol: string) => {
    if (!tokenList) {
      return;
    }
    setTokenMethod(symbol);
  };

  const showWalletConnectionProviderModal = useCallback(() => {
    const fromChainNonEVMMode = getNonEVMMode(fromChain?.id ?? 0);
    if (fromChainNonEVMMode === NonEVMMode.flowMainnet || fromChainNonEVMMode === NonEVMMode.flowTest) {
      dispatch(openModal(ModalName.flowProvider));
    } else if (fromChainNonEVMMode === NonEVMMode.terraMainnet || fromChainNonEVMMode === NonEVMMode.terraTest) {
      dispatch(openModal(ModalName.terraProvider));
    } else {
      dispatch(openModal(ModalName.provider));
    }
  }, [dispatch, fromChain, terraConnected]);

  const showNonEVMProviderModalForToChain = useCallback(() => {
    const toChainNonEVMMode = getNonEVMMode(toChain?.id ?? 0);

    if (toChainNonEVMMode === NonEVMMode.flowMainnet || toChainNonEVMMode === NonEVMMode.flowTest) {
      setFlowInToChain();
      dispatch(openModal(ModalName.flowProvider));
    } else if (toChainNonEVMMode === NonEVMMode.terraMainnet || toChainNonEVMMode === NonEVMMode.terraTest) {
      dispatch(openModal(ModalName.terraProvider));
    }
  }, [dispatch, toChain]);

  const onShowTransferModal = useCallback(() => {
    dispatch(openModal(ModalName.transfer));
  }, [dispatch]);
  const handleOpenRateModal = () => {
    dispatch(openModal(ModalName.rate));
  };
  const handleCloseRateModal = () => {
    dispatch(closeModal(ModalName.rate));
  };

  const approveMethod = async () => {
    if (!transactor || !tokenContract || !spenderAddr) {
      return;
    }
    if (!isNativeToken) {
      setLoading(true);
      try {
        const approveTx = await transactor(tokenContract.approve(spenderAddr, MaxUint256));
        await approveTx.wait();
        getAllowance();
        setLoading(false);
      } catch (e) {
        setLoading(false);
      }
    }
  };

  const setupFlowAccountWithLoadingSign = () => {
    if (!flowConnected || flowAccountInitialized) {
      return;
    }

    setLoading(true);

    const flowTokenPath = flowTokenPathConfigs.find(config => {
      return config.Symbol === selectedToken?.token.symbol;
    });

    if (flowTokenPath) {
      setupTokenVaultForFlowAccount(flowTokenPath, nonEVMAddress).then(initialized => {
        setFlowAccountInitialized(initialized);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  };

  const amountInputDisabled = () => {
    const nonEVMMode = getNonEVMMode(fromChain?.id ?? 0);
    if (nonEVMMode !== NonEVMMode.off) {
      return false;
    }

    return denyPeg;
  };

  const nonEVMReceiverAddress = () => {
    if (isNonEVMChain(fromChain?.id ?? 0) || isNonEVMChain(toChain?.id ?? 0)) {
      return nonEVMRecipientAddress;
    }
    return "";
  };

  useEffect(() => {
    const check = async () => {
      const toChainMode = getNonEVMMode(toChain?.id ?? 0);
      const toChainNotFlow = toChainMode != NonEVMMode.flowTest && toChainMode != NonEVMMode.flowMainnet;
      if (toChainNotFlow || nonEVMRecipientAddress.length === 0) {
        return;
      }

      const flowTokenPath = flowTokenPathConfigs.find(config => {
        return config.Symbol === selectedToken?.token.symbol;
      });

      const initialized = await checkTokenReceivabilityForFlowAccount(
        nonEVMRecipientAddress,
        flowTokenPath?.ReceiverPath ?? "",
      );
      setFlowAccountInitialized(initialized);
    };

    check();
  }, [nonEVMRecipientAddress, selectedToken]);

  useEffect(() => {
    const check = async () => {
      const fromChainMode = getNonEVMMode(fromChain?.id ?? 0);
      const fromChainNotFlow = fromChainMode != NonEVMMode.flowTest && fromChainMode != NonEVMMode.flowMainnet;
      if (fromChainNotFlow || nonEVMAddress.length === 0) {
        return;
      }

      const flowTokenPath = flowTokenPathConfigs.find(config => {
        return config.Symbol === selectedToken?.token.symbol;
      });

      const initialized = await checkTokenReceivabilityForFlowAccount(nonEVMAddress, flowTokenPath?.ReceiverPath ?? "");
      setFlowAccountInitialized(initialized);
    };

    check();
  }, [nonEVMAddress, fromChain, selectedToken]);

  useEffect(() => {
    if ((flowConnected || terraConnected) && isNonEVMChain(toChain?.id ?? 0) && nonEVMAddress.length > 0) {
      setNonEVMRecipientAddress(nonEVMAddress);
    }
  }, [flowConnected, terraConnected, toChain, nonEVMAddress]);

  const renderBtn = () => {
    if (!connected) {
      return (
        <Button
          type="primary"
          onClick={showWalletConnectionProviderModal}
          className={isMobile ? classes.transMobileBtn : classes.transBtn}
        >
          {walletConnectionButtonTitle}
        </Button>
      );
    }

    const toChainNonEVMMode = getNonEVMMode(toChain?.id ?? 0);

    if ((toChainNonEVMMode === NonEVMMode.flowMainnet || toChainNonEVMMode === NonEVMMode.flowTest) && !flowConnected) {
      return (
        <Button
          type="primary"
          onClick={showNonEVMProviderModalForToChain}
          className={isMobile ? classes.transMobileBtn : classes.transBtn}
        >
          Connect your Flow wallet to receive the funds
        </Button>
      );
    }

    if ((!validFloatRegex.test(amount) && amount) || Number(amount) < 0) {
      return (
        <Button
          type="primary"
          onClick={onShowTransferModal}
          loading={loading}
          className={isMobile ? classes.transMobileBtn : classes.transBtn}
          disabled={true}
        >
          Transfer
        </Button>
      );
    }
    const isTransferReady = Number(amount) > 0 && !hasError && receiveAmount && !exceedsSafeguard;

    if (
      flowConnected &&
      !flowAccountInitialized &&
      isTransferReady &&
      (nonEVMMode === NonEVMMode.flowMainnet || nonEVMMode === NonEVMMode.flowTest)
    ) {
      return (
        <Button
          type="primary"
          onClick={setupFlowAccountWithLoadingSign}
          loading={loading}
          className={isMobile ? classes.transMobileBtn : classes.transBtn}
        >
          <Tooltip
            overlayClassName={isMobile ? classes.mobileTooltipOverlayStyle : undefined}
            title={`In order to receive ${
              selectedToken?.token?.display_symbol ?? getTokenListSymbol(selectedToken?.token.symbol, fromChain?.id)
            } on Flow, you will need to create a ${
              selectedToken?.token?.display_symbol ?? getTokenListSymbol(selectedToken?.token.symbol, fromChain?.id)
            }
            vault in your Flow wallet. This does not consume any gas and only needs to be done once per token.`}
            placement="bottomLeft"
            arrowPointAtCenter
            color="#fff"
            overlayInnerStyle={{ color: "#000", width: 265 }}
          >
            <InfoCircleOutlined style={{ fontSize: 13, marginLeft: 6 }} />
          </Tooltip>
          Create{" "}
          {selectedToken?.token?.display_symbol ?? getTokenListSymbol(selectedToken?.token.symbol, fromChain?.id)} vault
          in your Flow wallet
        </Button>
      );
    }

    const needApprove = ((_allowance: BigNumber | undefined) => {
      if (isNativeToken) {
        return false;
      }
      if (!_allowance || _allowance.isZero()) {
        return true;
      }
      const inputAmount = amount || "0";
      try {
        const isGreatThanAllowance = safeParseUnits(inputAmount, selectedToken?.token?.decimal ?? 18).gt(_allowance);
        return isGreatThanAllowance;
      } catch {
        return true;
      }
    })(allowance);

    const findPotentialPeggedConfig = transferConfig.pegged_pair_configs.find(pairConfig => {
      return (
        pairConfig.org_chain_id === fromChain?.id &&
        pairConfig.pegged_chain_id === toChain?.id &&
        pairConfig.org_token.token.symbol === selectedToken?.token.symbol
      );
    });

    let shouldNotSkipAllowanceCheckForNonEVM = nonEVMMode === NonEVMMode.off;

    if (findPotentialPeggedConfig) {
      /// Check allowance when deposit from EVM chain to NonEVM chain
      shouldNotSkipAllowanceCheckForNonEVM = !isNonEVMChain(findPotentialPeggedConfig.org_chain_id);
    }

    if (needApprove && isTransferReady && shouldNotSkipAllowanceCheckForNonEVM) {
      if (!hasGotAllowance) {
        return (
          <Button
            type="primary"
            loading={true}
            className={isMobile ? classes.transMobileBtn : classes.transBtn}
            disabled
          ></Button>
        );
      } else {
        return (
          <Button
            type="primary"
            onClick={approveMethod}
            loading={loading}
            className={isMobile ? classes.transMobileBtn : classes.transBtn}
          >
            <Tooltip
              overlayClassName={isMobile ? classes.mobileTooltipOverlayStyle : undefined}
              title={`You must give cBridge smart contracts permission to use your ${
                selectedToken?.token?.display_symbol ?? getTokenListSymbol(selectedToken?.token.symbol, fromChain?.id)
              }, which is an on-chain tx that consumes gas. You only have to do this once per token.`}
              placement="bottomLeft"
              arrowPointAtCenter
              color="#fff"
              overlayInnerStyle={{ color: "#000", width: 265 }}
            >
              <InfoCircleOutlined style={{ fontSize: 13, marginLeft: 6 }} />
            </Tooltip>
            Approve cBridge to use your{" "}
            {selectedToken?.token?.display_symbol ?? getTokenListSymbol(selectedToken?.token.symbol, fromChain?.id)}
          </Button>
        );
      }
    } else {
      return (
        <Button
          type="primary"
          onClick={onShowTransferModal}
          loading={loading}
          className={isMobile ? classes.transMobileBtn : classes.transBtn}
          disabled={!isTransferReady && !loading}
        >
          Transfer
        </Button>
      );
    }
  };

  let bridgeRate;
  let minimumReceived;
  if (estimateAmtInfoInState) {
    const millionBigNum = BigNumber.from(1000000);

    let minimumReceivedNum = BigNumber.from("0");
    if (amount) {
      const amountBn = safeParseUnits(
        amount,
        getTokenByChainAndTokenSymbol(toChain?.id, selectedToken?.token?.symbol)?.token.decimal ?? 18,
      );
      minimumReceivedNum = amountBn.sub(
        amountBn.mul(BigNumber.from(estimateAmtInfoInState.maxSlippage)).div(millionBigNum),
      );

      if (minimumReceivedNum.lt(0)) {
        minimumReceivedNum = BigNumber.from("0");
      }
    }
    bridgeRate = estimateAmtInfoInState.bridgeRate;

    minimumReceived =
      formatDecimal(
        minimumReceivedNum || "0",
        getTokenByChainAndTokenSymbol(toChain?.id, selectedToken?.token?.symbol)?.token.decimal,
      ) + " ";
  }

  const balanceAvailable = (): Boolean => {
    if (
      getNonEVMMode(fromChain?.id ?? 0) === NonEVMMode.flowTest ||
      getNonEVMMode(fromChain?.id ?? 0) === NonEVMMode.flowMainnet
    ) {
      if (flowConnected) {
        return flowAccountInitialized;
      }
      return false;
    }
    return true;
  };

  const toChainEVMMode = getNonEVMMode(toChain?.id ?? 0);
  const disableForFlowReceiver = toChainEVMMode === NonEVMMode.flowMainnet || toChainEVMMode === NonEVMMode.flowTest;

  return (
    <div className={classes.flexCenter}>
      <Card className={classes.transferCard} bordered={false}>
        <div className={classes.cardContent}>
          <div className={classes.trans}>
            <div className={classes.transitem}>
              <div className={classes.transitemTitle}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div className={classes.source}>From</div>
                  <div className={classes.transselect}>
                    <div
                      className={classes.chainSelcet}
                      onClick={() => {
                        showChain("from");
                      }}
                    >
                      <Avatar size="small" src={fromChain?.icon} style={{ marginRight: 5 }} />
                      <span style={{ marginRight: 13 }}>{fromChain?.name}</span>
                      <img src={arrowDowm} alt="more from chain" />
                    </div>
                  </div>
                </div>
                {(() => {
                  if (pegConfig.mode !== PeggedChainMode.Off) {
                    return null;
                  }
                  if (isMobile) {
                    return (
                      <div>
                        <div
                          onClick={e => {
                            e.stopPropagation();
                            handleOpenRateModal();
                          }}
                          style={{ cursor: "pointer", position: "relative" }}
                        >
                          <img src={settingIcon} className={classes.settingIcon} alt="setting icon" />
                        </div>
                        <Modal
                          className={classes.mobileRateModal}
                          title=""
                          closable
                          visible={showRateModal}
                          onCancel={handleCloseRateModal}
                          footer={null}
                          centered
                        >
                          <RateModal
                            onCancle={() => {
                              handleCloseRateModal();
                            }}
                          />
                        </Modal>
                      </div>
                    );
                  }
                  return renderCardSetting();
                })()}
              </div>
              <div className={classes.transcontent}>
                <div className={classes.transnum}>
                  <div className={classes.transnumtext}>Send:</div>

                  {balanceAvailable() ? (
                    <div
                      className={classes.transnumlimt}
                      onClick={() => {
                        setMaxAmount();
                      }}
                    >
                      Max: <span>{userBalance}</span>
                    </div>
                  ) : isNonEVMChain(fromChain?.id ?? 0) && (!flowConnected || !flowAccountInitialized) ? (
                    <div className={classes.transnumlimt}>Max: --</div>
                  ) : (
                    ""
                  )}
                </div>
                <div className={classes.transndes}>
                  <div className={classes.transdestext}>
                    <TokenInput value={amount} onChange={handleTokenInputChange} disabled={amountInputDisabled()} />
                  </div>
                  <div className={classes.transdeslimt}>
                    <div className={classes.investSelct} onClick={() => toggleIsTokenShow()}>
                      <div className={classes.selectpic}>
                        <img src={selectedToken?.icon} alt="" />
                      </div>
                      <div className={classes.selectdes}>
                        {selectedToken?.token?.display_symbol ??
                          getTokenListSymbol(selectedToken?.token.symbol, fromChain?.id)}
                      </div>
                      <div className={classes.selecttoog}>
                        <DownOutlined style={{ fontSize: "14px" }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={classes.icon}>
              <img
                src={arrowUpDowm}
                alt="arrow up down"
                onClick={() => exchangeFromAndToChain()}
                style={{
                  cursor: "pointer",
                }}
                width={32}
              />
            </div>
            <div className={classes.transitem}>
              <div className={classes.transitemTitle}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div className={classes.source}>To</div>
                  <div className={classes.transselect}>
                    <div
                      className={classes.chainSelcet}
                      onClick={() => {
                        showChain("to");
                      }}
                    >
                      <Avatar size="small" src={toChain?.icon} style={{ marginRight: 5 }} />
                      <span style={{ marginRight: 13 }}>{toChain?.name}</span>
                      <img src={arrowDowm} alt="more to chain" />
                    </div>
                  </div>
                </div>
              </div>
              <div className={classes.transcontent}>
                {fromChain && toChain && selectedToken ? (
                  <div className={classes.transnum}>
                    <div className={classes.transnumtext}>
                      <Tooltip
                        title={
                          <div className={classes.transcontenttip}>
                            This amount is estimated based on the current bridge rate and fees.
                          </div>
                        }
                        placement="top"
                        color="#fff"
                        overlayInnerStyle={{ color: "#000", backgroundColor: "#fff", width: 265 }}
                      >
                        <InfoCircleOutlined style={{ fontSize: 12, marginRight: 6 }} />
                      </Tooltip>
                      Receive (estimated):
                    </div>
                  </div>
                ) : null}
                <div className={classes.transndes}>
                  <div className={classes.transdestext}>
                    {receiveAmount === 0 ? (
                      <span style={{ float: "left" }}>0.0</span>
                    ) : (
                      <span style={{ float: "left" }}>
                        {receiveAmount < 0
                          ? "--"
                          : `${receiveAmount} ${getTokenDisplaySymbol(
                              selectedToken?.token,
                              fromChain,
                              toChain,
                              transferConfig.pegged_pair_configs,
                            )}`}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {nonEVMMode !== NonEVMMode.off && fromChainWalletConnected ? (
              <div className={classes.transitem}>
                <div style={{ height: 24 }} />
                <div className={classes.transcontent}>
                  <div className={classes.nonEvmRecipientText}>
                    Recipient address on {toChain?.name} (do NOT send funds to exchanges)
                  </div>
                  <div className={classes.transndes}>
                    <div className={classes.nonEvmAddressText}>
                      <TokenInput
                        value={nonEVMRecipientAddress}
                        placeholderText="Please enter recipient address"
                        onChange={e => {
                          setNonEVMRecipientAddress(e.value);
                        }}
                        disabled={disableForFlowReceiver}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>

        <div className={classes.err}>
          <div className={classes.errInner}>{errorMsg}</div>
        </div>
        <div style={{ width: "100%", textAlign: "center", position: "relative", height: 56 }}>
          <div className={classes.btnare}>
            <div className={classes.btnarein}>{renderBtn()}</div>
          </div>
        </div>
      </Card>
      {!denyPeg && bridgeRate && !exceedsSafeguard ? (
        <TransferOverview
          selectedToken={selectedToken}
          fromChain={fromChain}
          toChain={toChain}
          bridgeRate={bridgeRate}
          minimumReceived={minimumReceived}
          baseFee={estimateAmtInfoInState?.baseFee}
          percFee={estimateAmtInfoInState?.percFee}
          transferConfig={transferConfig}
          isBigAmountDelayed={isBigAmountDelayed || nonEVMBigAmountDelayed}
          delayMinutes={isBigAmountDelayed ? delayMinutes : nonEVMBigAmountDelayed ? nonEVMDelayTimeInMinute : ""}
          estimateAmtInfoInState={estimateAmtInfoInState}
        />
      ) : null}
      <ProviderModal visible={showProviderModal} onCancel={handleCloseProviderModal} />
      <FlowProviderModal visible={showFlowProviderModal} onCancel={handleCloseFlowProviderModal} />
      <TerraProviderModal visible={showTerraProviderModal} onCancel={handleCloseTerraProviderModal} />
      {showTransferModal && (
        <TransferModal
          amount={maxValue || amount}
          receiveAmount={receiveAmount}
          nonEVMReceiverAddress={nonEVMReceiverAddress()}
          onCancel={handleCloseTransferModal}
          onSuccess={handleSuccess}
        />
      )}
      <TokenList visible={isTokenShow} onSelectToken={handleSelectToken} onCancel={() => toggleIsTokenShow()} />
    </div>
  );
};

export default Transfer;
