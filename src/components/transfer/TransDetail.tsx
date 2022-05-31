import { InfoCircleOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { FC } from "react";
import { createUseStyles } from "react-jss";
import { formatUnits } from "@ethersproject/units";
import { BigNumber } from "@ethersproject/bignumber";
import { formatDecimalPart, safeParseUnits } from "celer-web-utils/lib/format";
import { Theme } from "../../theme";
import { useAppSelector } from "../../redux/store";
import { formatDecimal, formatPercentage } from "../../helpers/format";
import { getTokenListSymbol, getTokenSymbolWithPeggedMode } from "../../redux/assetSlice";
import { Chain, Token, PeggedPairConfig } from "../../constants/type";
import { useBigAmountDelay } from "../../hooks";
import { PeggedChainMode, usePeggedPairConfig } from "../../hooks/usePeggedPairConfig";
import { useNonEVMBigAmountDelay } from "../../hooks/useNonEVMBigAmountDelay";
import { NonEVMMode, useNonEVMContext } from "../../providers/NonEVMContextProvider";
import { useMultiBurnConfig } from "../../hooks/useMultiBurnConfig";

/* eslint-disable camelcase */

const useStyles = createUseStyles<string, { isMobile: boolean }, Theme>((theme: Theme) => ({
  historyDetail: {
    width: "100%",
  },
  detailItem: {
    borderBottom: `1px solid ${theme.primaryBorder}`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
    padding: "12px 0",
  },
  detailItemWithoutBorder: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
    padding: "12px 0",
  },
  detailItemBto: {
    borderBottom: `1px solid ${theme.primaryBorder}`,
    padding: "12px 0",
  },
  detailItemTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  itemLeft: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    textAlign: "left",
  },
  itemContImg: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    marginRight: 8,
  },
  itemRight: {
    textAlign: "right",
  },
  itemText: {},
  itemTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: theme.surfacePrimary,
  },
  itemTextDes: {
    fontSize: 12,
    fontWeight: 400,
    color: theme.surfacePrimary,
  },
  recipientDescText: {
    fontSize: 14,
    fontWeight: 500,
    color: theme.surfacePrimary,
  },
  totalValue: {
    fontSize: 15,
    fontWeight: 400,
    color: theme.infoDanger,
  },
  totalValueRN: {
    fontSize: 15,
    fontWeight: 400,
    color: theme.infoSuccess,
  },
  fromNet: {
    fontSize: 12,
    fontWeight: 400,
    color: theme.secondBrand,
  },
  expe: {
    fontSize: 12,
    color: theme.infoSuccess,
    textAlign: "left",
    paddingTop: 30,
  },
  time: {
    fontSize: 16,
    color: theme.infoSuccess,
    textAlign: "right",
  },
  descripet: {
    background: theme.primaryBackground,
    borderRadius: 16,
    padding: "10px 16px 16px 16px",
    margin: props => (props.isMobile ? "16px 0" : "40px 0"),
  },
  recipientContainer: {
    background: theme.primaryBackground,
    borderRadius: 8,
    padding: "4px 14px 4px 14px",
  },
  descripetItem: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 6,
  },
  leftTitle: {
    color: theme.secondBrand,
    fontSize: 13,
  },
  rightContent: {
    display: "flex",
    alignItems: "center",
    color: theme.surfacePrimary,
    fontSize: 13,
    fontWeight: 400,
  },
  desImg: {
    width: 14,
    marginLeft: 6,
    borderRadius: "50%",
  },
  tooltipContent: {
    fontSize: 12,
    fontWeight: 400,
    color: theme.unityBlack,
  },
  infoIcon: {
    fontSize: 12,
    fontWeight: 600,
    color: theme.secondBrand,
  },
}));

interface IProps {
  amount: string;
  receiveAmount: number;
  receiverAddress: string;
}

const TransDetail: FC<IProps> = ({ amount, receiveAmount, receiverAddress }) => {
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const classes = useStyles({ isMobile });
  const { transferInfo } = useAppSelector(state => state);
  const { fromChain, toChain, selectedToken, estimateAmtInfoInState, transferConfig } = transferInfo;
  const pegConfig = usePeggedPairConfig();
  const { multiBurnConfig } = useMultiBurnConfig();
  const { isBigAmountDelayed, delayMinutes } = useBigAmountDelay(toChain, selectedToken?.token, receiveAmount);
  const { nonEVMBigAmountDelayed, nonEVMDelayTimeInMinute } = useNonEVMBigAmountDelay(receiveAmount);
  const getTokenByChainAndTokenSymbol = (chainId, tokenSymbol) => {
    return transferConfig?.chain_token[chainId]?.token?.find(tokenInfo => tokenInfo?.token?.symbol === tokenSymbol);
  };
  const { nonEVMMode } = useNonEVMContext();

  let estimatedReceiveAmount;
  if (receiveAmount === 0) {
    estimatedReceiveAmount = "0.0";
  } else if (receiveAmount < 0) {
    estimatedReceiveAmount = "--";
  } else {
    estimatedReceiveAmount = `${receiveAmount}`;
  }

  let baseTgas;
  let percTgas;
  let bridgeRate;
  let slippage_tolerance;
  let minimumReceived;
  let totalFee;
  if (estimateAmtInfoInState) {
    const slippageToleranceNum = (Number(estimateAmtInfoInState.slippageTolerance) / 1000000).toFixed(6);
    const millionBigNum = BigNumber.from(1000000);
    const feeBigNum = BigNumber.from(estimateAmtInfoInState?.baseFee).add(
      BigNumber.from(estimateAmtInfoInState?.percFee),
    );
    let minimumReceivedNum = BigNumber.from("0");
    if (amount) {
      const amountBn = safeParseUnits(amount, selectedToken?.token.decimal ?? 18);
      minimumReceivedNum = amountBn.sub(
        amountBn.mul(BigNumber.from(estimateAmtInfoInState.maxSlippage)).div(millionBigNum),
      );

      if (minimumReceivedNum.lt(0)) {
        minimumReceivedNum = BigNumber.from("0");
      }
    }
    baseTgas =
      formatUnits(
        estimateAmtInfoInState?.baseFee,
        getTokenByChainAndTokenSymbol(toChain?.id, selectedToken?.token.symbol)?.token?.decimal,
      ) || "--";
    percTgas =
      formatUnits(
        estimateAmtInfoInState?.percFee,
        getTokenByChainAndTokenSymbol(toChain?.id, selectedToken?.token.symbol)?.token?.decimal,
      ) || "--";
    totalFee =
      formatUnits(feeBigNum, getTokenByChainAndTokenSymbol(toChain?.id, selectedToken?.token.symbol)?.token?.decimal) ||
      "--";
    bridgeRate = estimateAmtInfoInState.bridgeRate;
    slippage_tolerance = formatPercentage(Number(slippageToleranceNum));
    minimumReceived =
      formatDecimal(minimumReceivedNum || "0", selectedToken?.token.decimal) +
      " " +
      getTokenDisplaySymbol(selectedToken?.token, fromChain, toChain, transferConfig.pegged_pair_configs);
  }

  const delayTime = () => {
    let result = "5-20 minutes";
    if (isBigAmountDelayed) {
      result = `up to ${delayMinutes} minutes`;
    } else if (nonEVMBigAmountDelayed) {
      result = `up to ${nonEVMDelayTimeInMinute} minutes`;
    }
    return result;
  };
  // const oneKeyCopy = text => {
  //   copy(text);
  //   message.success("Copy Success!");
  // };
  return (
    <div className={classes.historyDetail}>
      <div className={classes.detailItem}>
        <div className={classes.itemLeft}>
          <div>
            <img className={classes.itemContImg} src={fromChain?.icon} alt="" />
          </div>
          <div className={classes.itemText}>
            <div className={classes.itemTitle}>{fromChain?.name}</div>
            <div className={classes.itemTextDes}>Source Chain</div>
          </div>
        </div>
        <div className={classes.itemRight}>
          <div className={classes.totalValue}>
            - {Number(formatDecimalPart(amount, 6, "floor", true)).toFixed(6) || "0.0"}
          </div>
          <div className={classes.fromNet}>
            {selectedToken?.token?.display_symbol ?? getTokenListSymbol(selectedToken?.token.symbol, fromChain?.id)}
          </div>
        </div>
      </div>
      <div className={nonEVMMode !== NonEVMMode.off ? classes.detailItemWithoutBorder : classes.detailItem}>
        <div className={classes.itemLeft}>
          <div>
            <img className={classes.itemContImg} src={toChain?.icon} alt="" />
          </div>
          <div className={classes.itemText}>
            <div className={classes.itemTitle}>{toChain?.name}</div>
            <div className={classes.itemTextDes}>Destination Chain</div>
          </div>
        </div>
        <div className={classes.itemRight}>
          <div className={classes.totalValueRN}>+{estimatedReceiveAmount}</div>
          <div className={classes.fromNet}>{`(estimated) ${
            getTokenDisplaySymbol(selectedToken?.token, fromChain, toChain, transferConfig.pegged_pair_configs) ?? ""
          }`}</div>
        </div>
      </div>

      {nonEVMMode !== NonEVMMode.off && (
        <div className={classes.recipientContainer}>
          <div className={classes.recipientDescText}>Recipient: {receiverAddress}</div>
        </div>
      )}

      <div className={classes.descripet}>
        <div className={classes.descripetItem}>
          <div className={classes.leftTitle}>Bridge Rate</div>
          {isMobile ? (
            <div className={classes.rightContent}>{bridgeRate}</div>
          ) : (
            <div className={classes.rightContent}>
              1{" "}
              {selectedToken?.token?.display_symbol ?? getTokenListSymbol(selectedToken?.token?.symbol, fromChain?.id)}{" "}
              on
              <img className={classes.desImg} height={14} style={{ marginRight: 6 }} src={fromChain?.icon} alt="" />
              {pegConfig.mode === PeggedChainMode.Off && multiBurnConfig === undefined ? "≈" : "="} {bridgeRate}{" "}
              {getTokenDisplaySymbol(selectedToken?.token, fromChain, toChain, transferConfig.pegged_pair_configs)} on
              <img className={classes.desImg} height={14} src={toChain?.icon} alt="" />
            </div>
          )}
        </div>
        <div className={classes.descripetItem}>
          <div className={classes.leftTitle}>
            <div className={classes.leftTitle}>
              Fee
              <Tooltip
                title={
                  <div className={classes.tooltipContent} style={{ whiteSpace: "pre-line" }}>
                    <span style={{ fontWeight: 700 }}>Base Fee</span>
                    {`:${formatDecimalPart(baseTgas || "0", 8, "round", true)} ${getTokenDisplaySymbol(
                      selectedToken?.token,
                      fromChain,
                      toChain,
                      transferConfig.pegged_pair_configs,
                    )}\n`}
                    <span style={{ fontWeight: 700 }}>
                      {pegConfig.mode === PeggedChainMode.Off && multiBurnConfig === undefined
                        ? "Liquidity Fee"
                        : "Bridge Fee"}
                    </span>
                    {`:${formatDecimalPart(percTgas || "0", 8, "round", true)} ${getTokenDisplaySymbol(
                      selectedToken?.token,
                      fromChain,
                      toChain,
                      transferConfig.pegged_pair_configs,
                    )}\n\nBase Fee is used to cover the gas cost for sending your transfer on the destination chain.\n\n`}
                    {pegConfig.mode === PeggedChainMode.Off && multiBurnConfig === undefined
                      ? "Liquidity Fee is paid to cBridge LPs and Celer SGN stakers as economic incentives."
                      : "Bridge Fee is paid to Celer SGN as economic incentives for guarding the security of cBridge."}
                  </div>
                }
                arrowPointAtCenter
                placement="top"
                color="#fff"
                overlayInnerStyle={{ color: "#000", backgroundColor: "#fff", width: 265 }}
              >
                <InfoCircleOutlined className={classes.leftTitle} style={{ marginLeft: 6 }} />
              </Tooltip>
            </div>
          </div>
          <div className={classes.rightContent}>
            {formatDecimalPart(totalFee || "0", 8, "round", true)}{" "}
            {getTokenDisplaySymbol(selectedToken?.token, fromChain, toChain, transferConfig.pegged_pair_configs)}
          </div>
        </div>
        {pegConfig.mode === PeggedChainMode.Off && multiBurnConfig === undefined ? (
          <>
            <div className={classes.descripetItem}>
              <div className={classes.leftTitle}>
                <div className={classes.leftTitle}>
                  Minimum Received
                  <Tooltip
                    title={
                      <div className={classes.tooltipContent} style={{ textAlign: "center" }}>
                        {`You will receive at least ${minimumReceived} on ${toChain?.name} or the transfer won't go through.`}
                      </div>
                    }
                    arrowPointAtCenter
                    placement="bottom"
                    color="#fff"
                    overlayInnerStyle={{ color: "#000", backgroundColor: "#fff", width: 265 }}
                  >
                    <InfoCircleOutlined className={classes.infoIcon} style={{ marginLeft: 6 }} />
                  </Tooltip>
                </div>
              </div>
              <div className={classes.rightContent}>{minimumReceived}</div>
            </div>
            <div className={classes.descripetItem}>
              <div className={classes.leftTitle}>
                <div className={classes.leftTitle}>
                  Slippage Tolerance
                  <Tooltip
                    overlayClassName={isMobile ? classes.mobileTooltipOverlayStyle : undefined}
                    title="The transfer won’t go through if the bridge rate moves unfavorably by more than this percentage when the
                transfer is executed."
                    placement="bottomLeft"
                    arrowPointAtCenter
                    color="#fff"
                    overlayInnerStyle={{ color: "#000", width: 265 }}
                  >
                    <InfoCircleOutlined className={classes.infoIcon} style={{ marginLeft: 6 }} />
                  </Tooltip>
                </div>
              </div>
              <div className={classes.rightContent}>{slippage_tolerance || "--"}</div>
            </div>
          </>
        ) : null}
        <div className={classes.descripetItem}>
          <span className={classes.leftTitle}>Estimated Time of Arrival</span>
          <span className={classes.rightContent}>{delayTime()}</span>
        </div>
      </div>
    </div>
  );
};

export const needToChangeTokenDisplaySymbol = (selectedToken: Token | undefined, toChain: Chain | undefined) => {
  const symbol = selectedToken?.symbol ?? "";
  if (symbol !== "WETH") {
    return false;
  }
  const dstChainIds = [
    1, // ethereum
    42161, // arbitrum
    10, // Optimism
    5, // goerli
    288, // BOBA
  ];
  if (!dstChainIds.find(id => id === toChain?.id ?? "")) {
    return false;
  }
  return true;
};

export const getTokenDisplaySymbol = (
  selectedToken: Token | undefined,
  fromChain: Chain | undefined,
  toChain: Chain | undefined,
  peggedPairConfigs: Array<PeggedPairConfig>,
) => {
  return getTokenSymbolWithPeggedMode(fromChain?.id, toChain?.id, selectedToken?.symbol ?? "", peggedPairConfigs);
};

export default TransDetail;
