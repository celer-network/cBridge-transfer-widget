import { Avatar, Modal, Button } from "antd";
import { ethers } from "ethers";
import { FC, useCallback, useEffect, useState, useContext } from "react";
import { createUseStyles } from "react-jss";
import { WarningFilled } from "@ant-design/icons";
import { BigNumber } from "@ethersproject/bignumber";
import { AddressZero, MaxUint256 } from "@ethersproject/constants";
import { formatUnits, parseUnits } from "@ethersproject/units";
import { formatDecimalPart } from "celer-web-utils/lib/format";

import { useContractsContext } from "../../providers/ContractsContextProvider";
import { useWeb3Context } from "../../providers/Web3ContextProvider";

import { useAppDispatch, useAppSelector } from "../../redux/store";
import { setEstimateAmtInfoInState } from "../../redux/transferSlice";

import { Theme } from "../../theme";
import { ERC20 } from "../../typechain/ERC20";
import { ERC20__factory } from "../../typechain/factories/ERC20__factory";
import { ColorThemeContext } from "../../providers/ThemeProvider";
import { useCustomContractLoader, useBigAmountDelay, useNativeETHToken } from "../../hooks";
import { formatDecimal } from "../../helpers/format";
import arrTop from "../../images/arrTop.svg";
import TransDetail from "./TransDetail";
import { TransferHistoryStatus, LPHistoryStatus, TransferHistory } from "../../constants/type";
import arrTopLightIcon from "../../images/arrTopLight.svg";

import { getTokenListSymbol, getTokenSymbol } from "../../redux/assetSlice";

/* eslint-disable*/
/* eslint-disable no-debugger */
/* eslint-disable camelcase */

import { WebClient } from "../../proto/sgn/gateway/v1/GatewayServiceClientPb";
import { EstimateAmtRequest, EstimateAmtResponse } from "../../proto/sgn/gateway/v1/gateway_pb";
import { getNetworkById, NETWORKS } from "../../constants/network";
import { PeggedChainMode, usePeggedPairConfig } from "../../hooks/usePeggedPairConfig";

const useStyles = createUseStyles<string, { isMobile: boolean }, Theme>((theme: Theme) => ({
  balanceText: {
    textDecoration: "underline",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  countdown: {
    fontSize: 14,
    fontWeight: 600,
  },
  explanation: {
    color: theme.infoSuccess,
    marginBottom: 24,
  },
  historyDetail: {
    width: "100%",
  },
  detailItem: {
    borderBottom: `1px solid ${theme.infoSuccess}`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
    padding: "12px 0",
  },
  detailItemBto: {
    borderBottom: `1px solid ${theme.infoSuccess}`,
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
    fontSize: 16,
    color: theme.infoSuccess,
  },
  itemTextDes: {
    fontSize: 12,
    color: theme.infoSuccess,
  },
  totalValue: {
    fontSize: 16,
    color: "#FC5656",
  },
  totalValueRN: {
    fontSize: 16,
    color: "#00d395",
  },
  fromNet: {
    fontSize: 12,
    color: theme.infoSuccess,
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
  modalTop: {},
  modalTopDes: {
    fontSize: 14,
  },
  modalTopTitle: {
    fontSize: 12,
    width: "100%",
    textAlign: "center",
    marginBottom: 20,
    fontWeight: 600,
    color: theme.surfacePrimary,
  },
  transferdes: {
    fontSize: 12,
    width: "100%",
    textAlign: "center",
    marginBottom: props => (props.isMobile ? 0 : 20),
    fontWeight: 400,
    color: theme.surfacePrimary,
  },
  transferde2: {
    color: theme.infoWarning,
    textAlign: "center",
    background: "#fff",
    borderRadius: 12,
    padding: "8px 12px",
    fontWeight: 500,
  },
  modalToptext: {
    fontSize: 15,
    width: "100%",
    textAlign: "center",
    fontWeight: 600,
    color: theme.surfacePrimary,
  },
  modalToptext2: {
    fontSize: 16,
    width: "100%",
    textAlign: "center",
    fontWeight: 600,
    color: theme.surfacePrimary,
  },
  modalTopTitleNotice: {
    fontSize: 14,
    fontWeight: 400,
    width: "100%",
    textAlign: "center",
    marginBottom: 20,
  },
  modalTopIcon: {
    fontSize: 16,
    fontWeight: 600,
    width: "100%",
    textAlign: "center",
    marginTop: props => (props.isMobile ? 18 : 40),
    marginBottom: props => (props.isMobile ? 18 : 40),
    "&img": {
      width: 90,
    },
  },
  modalSuccessIcon: {
    fontSize: 70,
    fontWeight: "bold",
    color: theme.transferSuccess,
  },
  addToken: {
    color: "#00E096",
    fontSize: 12,
    padding: "10px 10px",
    borderRadius: "100px",
    background: theme.primaryBackground,
    display: "flex",
    width: "auto",
    alignItems: "center",
    cursor: "pointer",
    justifyContent: "center",
    marginTop: 40,
  },
  button: {
    marginTop: props => (props.isMobile ? 16 : 40),
    height: 56,
    lineHeight: "42px",
    background: theme.primaryBrand,
    borderRadius: 16,
    fontSize: 18,
    fontWeight: 500,
    borderWidth: 0,
  },
  resultText: {
    color: theme.surfacePrimary,
  },
  modaldes: {
    color: theme.surfacePrimary,
    marginTop: props => (props.isMobile ? 16 : 40),
    fontSize: 15,
    textAlign: "center",
  },
  modaldes2: {
    color: theme.surfacePrimary,
    marginTop: props => (props.isMobile ? 16 : 70),
    fontSize: 15,
    textAlign: "center",
  },
  transferModal: {
    minWidth: props => (props.isMobile ? "100%" : 448),
    background: theme.secondBackground,
    border: `1px solid ${theme.primaryBackground}`,
    "& .ant-modal-content": {
      background: theme.secondBackground,
      boxShadow: props => (props.isMobile ? "none" : ""),
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
        minHeight: 260,
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
  warningInnerbody: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  viewInExplorerWrapper: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    fontWeight: 700,
    fontSize: 12,
    marginTop: 18,
  },
}));

const TRANSFER = "transfer";
const BRIDGE_RATE_UPDATED = "bridgeRateUpdated";

interface IProps {
  amount: string;
  receiveAmount: number;
  onCancel: () => void;
  onSuccess: () => void;
}

const TransferModal: FC<IProps> = ({ amount, receiveAmount, onCancel, onSuccess }) => {
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const classes = useStyles({ isMobile });
  const {
    contracts: { bridge, originalTokenVault, peggedTokenBridge },
    transactor,
  } = useContractsContext();
  const { provider, address, chainId, signer } = useWeb3Context();
  const dispatch = useAppDispatch();
  const { transferInfo, modal } = useAppSelector(state => state);
  const { showTransferModal } = modal;
  const { transferConfig, fromChain, toChain, selectedToken, estimateAmtInfoInState, rate } = transferInfo;

  const getTokenByChainAndTokenSymbol = (chainId, tokenSymbol) => {
    return transferConfig?.chain_token[chainId]?.token?.find(tokenInfo => tokenInfo?.token?.symbol === tokenSymbol);
  };

  const selectedToChain = transferConfig?.chains.find(chain => chain.id === toChain?.id);
  const value = parseUnits(amount || "0", selectedToken?.token?.decimal);
  const feeBigNum = BigNumber.from(estimateAmtInfoInState?.baseFee).add(
    BigNumber.from(estimateAmtInfoInState?.percFee),
  );
  // const totleFee = estimateAmtInfoInState === null ? "0" : feeBigNum.toString();

  const eqValueTokenAmtBigNum = BigNumber.from(estimateAmtInfoInState?.eqValueTokenAmt || "0");
  const millionBigNum = BigNumber.from(1000000);
  const receiveNum = eqValueTokenAmtBigNum.sub(feeBigNum);

  let minimumReceived;
  if (estimateAmtInfoInState) {
    let minimumReceivedNum = BigNumber.from("0");
    if (amount) {
      const amountBn = parseUnits(amount, selectedToken?.token?.decimal);
      minimumReceivedNum = amountBn.sub(
        amountBn.mul(BigNumber.from(estimateAmtInfoInState.maxSlippage)).div(millionBigNum),
      );

      if (minimumReceivedNum.lt(0)) {
        minimumReceivedNum = BigNumber.from("0");
      }
    }

    minimumReceived = formatDecimal(minimumReceivedNum || "0", selectedToken?.token?.decimal);
  }

  const toChainInConfig = transferConfig.chains.find(it => it.id === toChain?.id);
  const arrivalGasTokenAmount = BigNumber.from(toChainInConfig?.drop_gas_amt ?? "0");
  const arrivalGasTokenDecimal =
    getTokenByChainAndTokenSymbol(toChainInConfig?.id ?? 0, toChainInConfig?.gas_token_symbol)?.token.decimal ?? 18;
  const arrivalGasTokenAmountValue = formatUnits(arrivalGasTokenAmount, arrivalGasTokenDecimal);
  const arrivalGasTokenAmountDisplay = formatDecimalPart(arrivalGasTokenAmountValue, 6, "round", true);
  const arrivalGasTokenSymbol = toChainInConfig?.gas_token_symbol;

  // token contract: param address is selected token's address
  const pegConfig = usePeggedPairConfig();
  const spenderAddr = (() => {
    if (pegConfig.mode === PeggedChainMode.Off) {
      return bridge?.address ?? "";
    }
    return pegConfig.getSpenderAddress();
  })();

  const tokenAddress = pegConfig?.getTokenBalanceAddress(
    selectedToken?.token?.address || "",
    fromChain?.id,
    selectedToken?.token?.symbol,
    transferConfig.pegged_pair_configs,
  );

  const tokenContract = useCustomContractLoader(provider, tokenAddress || "", ERC20__factory) as ERC20 | undefined;
  // const [tokenBalance, , , reload] = useTokenBalance(tokenContract, address);
  const [transferSuccess, setTransferSuccess] = useState<Boolean>(false);
  const [allowance, setAllowance] = useState<BigNumber>();
  const [transfState, setTransfState] = useState<
    TransferHistoryStatus | LPHistoryStatus | "approve" | "bridgeRateUpdated" | "transfer"
  >(TRANSFER);
  const [loading, setLoading] = useState(false);
  const [transferId, setTransferId] = useState<string>("");
  const [txhash, setTxhash] = useState<string>("");
  const [newEstimateAmtInfoInState, setNewEstimateAmtInfoInState] = useState<EstimateAmtResponse.AsObject>({
    eqValueTokenAmt: "",
    bridgeRate: 0,
    baseFee: "",
    percFee: "",
    slippageTolerance: 0,
    maxSlippage: 0,
    estimatedReceiveAmt: "",
  });
  const [hasGotAllowance, setHasGotAllowance] = useState(false);
  const { isNativeToken } = useNativeETHToken(fromChain, selectedToken);
  const { isBigAmountDelayed, delayMinutes } = useBigAmountDelay(toChain, selectedToken?.token, receiveAmount);

  let detailInter;
  const { themeType } = useContext(ColorThemeContext);
  // allowance: param address is user address and contract address
  const getAllowance = useCallback(() => {
    if (!tokenContract || !address) {
      return;
    }
    tokenContract
      ?.allowance(address, spenderAddr || AddressZero)
      .then(result => {
        setAllowance(result);
        setHasGotAllowance(true);
      })
      .catch(e => {
        console.log(e);
      });
  }, [address, tokenContract, spenderAddr]);

  useEffect(() => {
    getAllowance();
  }, [getAllowance]);

  useEffect(() => {
    let img = new Image();
    img.src = themeType === "dark" ? arrTop : arrTopLightIcon; //为了解决图片加载过慢的问题。
    return () => {
      clearInterval(detailInter);
    };
  }, []);

  const onHandleCancel = () => {
    //交易
    clearInterval(detailInter);
    if (transferSuccess) {
      onSuccess();
      onCancel();
    } else {
      onCancel();
    }
  };
  const updateRate = () => {
    dispatch(setEstimateAmtInfoInState(newEstimateAmtInfoInState));
    setTransfState(TRANSFER);
  };

  const getBigAmountModalMsg = (): string => {
    const time = isBigAmountDelayed ? `up to ${delayMinutes} minutes` : "5-20 minutes";
    return `Please allow ${time} for the funds to arrive at your wallet on ${toChain?.name}.`;
  };

  const handleAction = async () => {
    if (!fromChain || !toChain || !selectedToken) {
      return;
    }
    console.log("Selected Token", selectedToken);

    /// Don't estimate for pegged ETH
    if (selectedToken?.token.display_symbol === "ETH" && pegConfig.mode != PeggedChainMode.Off) {
      return;
    }

    const estimateRequest = new EstimateAmtRequest();
    estimateRequest.setSrcChainId(fromChain?.id);
    estimateRequest.setDstChainId(toChain?.id);
    estimateRequest.setTokenSymbol(selectedToken?.token.symbol);
    estimateRequest.setUsrAddr(address);
    estimateRequest.setSlippageTolerance(Number(rate) * 10000);
    estimateRequest.setAmt(value.toString());
    estimateRequest.setIsPegged(pegConfig.mode !== PeggedChainMode.Off);

    console.log("Estimate Request", estimateRequest);

    const client = new WebClient(`${process.env.REACT_APP_GRPC_SERVER_URL}`, null, null);
    const res = await client.estimateAmt(estimateRequest, null);
    if (pegConfig.mode === PeggedChainMode.Off) {
      if (res.getBridgeRate() !== estimateAmtInfoInState?.bridgeRate) {
        setNewEstimateAmtInfoInState(res.toObject());
        setTransfState(BRIDGE_RATE_UPDATED);
        return;
      }
    }
    if (!allowance && !isNativeToken) {
      getAllowance();
      return;
    }
    if (!transactor || !allowance || !bridge || !tokenContract || !selectedToken?.token?.address) {
      return;
    }
    if (
      (pegConfig.mode === PeggedChainMode.Deposit && (!originalTokenVault || originalTokenVault === undefined)) ||
      (pegConfig.mode === PeggedChainMode.Burn && (!peggedTokenBridge || peggedTokenBridge === undefined))
    ) {
      return;
    }

    try {
      if (!isNativeToken) {
        if (!allowance) {
          return;
        }
        if (value.gt(allowance) || allowance.isZero()) {
          if (!isNativeToken) {
            setLoading(true);
            const approveTx = await transactor(tokenContract.approve(spenderAddr, MaxUint256));
            await approveTx.wait();
            setTransfState(TRANSFER);
            setLoading(false);
            getAllowance();
            return;
          }
        }
      }
      if (value.isZero()) {
        return;
      }
      const nonce = new Date().getTime();
      const _transferId = (() => {
        switch (pegConfig.mode) {
          case PeggedChainMode.Deposit:
          case PeggedChainMode.DepositThenSwap:
            return ethers.utils.solidityKeccak256(
              ["address", "address", "uint256", "uint64", "address", "uint64", "uint64"],
              [
                address,
                selectedToken?.token?.address,
                value.toString(),
                toChain?.id.toString(),
                address,
                nonce.toString(),
                fromChain?.id.toString(),
              ],
            );
          case PeggedChainMode.BurnThenSwap:
          case PeggedChainMode.Burn:
            return ethers.utils.solidityKeccak256(
              ["address", "address", "uint256", "address", "uint64", "uint64"],
              [
                address,
                selectedToken?.token?.address,
                value.toString(),
                address,
                nonce.toString(),
                fromChain?.id.toString(),
              ],
            );
          default:
            /**
             * sender: address
             * receiver: address (与sender都是我自己)
             * token: token.address
             * amount: bigNumber
             * dstChainId: toChainId
             * nonce: 时间戳
             * block.Chainid: fromChainId
             */
            return ethers.utils.solidityKeccak256(
              ["address", "address", "address", "uint256", "uint64", "uint64", "uint64"],
              [
                address,
                address,
                selectedToken?.token?.address,
                value.toString(),
                toChain?.id.toString(),
                nonce.toString(),
                fromChain?.id.toString(),
              ],
            );
        }
      })();
      setTransferId(_transferId);
      setLoading(true);
      const executor = (wrapToken: string | undefined) => {
        switch (pegConfig.mode) {
          case PeggedChainMode.Burn:
          case PeggedChainMode.BurnThenSwap:
            return transactor(
              peggedTokenBridge!.burn(pegConfig.config.pegged_token.token.address, value, address, nonce),
            );
          case PeggedChainMode.Deposit:
          case PeggedChainMode.DepositThenSwap:
            // if deposit the native token like BNB on BSC,AVAX on Avalanche, call the depositNative contract instead of the deposit.
            // what notable are Ethereum Mainnet, Celo, and BOBA chains are not supported
            if (
              wrapToken === pegConfig.config.org_token.token.address &&
              (fromChain.id !== 1 && fromChain.id !== 42220, fromChain.id !== 288)
            ) {
              return transactor(
                originalTokenVault!.depositNative(value, pegConfig.config.pegged_chain_id, address, nonce, { value }),
              );
            } else {
              return transactor(
                originalTokenVault!.deposit(
                  pegConfig.config.org_token.token.address,
                  value,
                  pegConfig.config.pegged_chain_id,
                  address,
                  nonce,
                ),
              );
            }
          default:
            return transactor(
              isNativeToken
                ? bridge.sendNative(
                    address,
                    value,
                    BigNumber.from(selectedToChain?.id),
                    BigNumber.from(nonce),
                    BigNumber.from(res.getMaxSlippage() || 0),
                    { value },
                  )
                : bridge.send(
                    address,
                    selectedToken?.token?.address,
                    value,
                    BigNumber.from(selectedToChain?.id),
                    BigNumber.from(nonce),
                    BigNumber.from(res.getMaxSlippage() || 0),
                  ),
            );
        }
      };

      let wrapTokenAddress;
      try {
        wrapTokenAddress = await originalTokenVault?.nativeWrap();
      } catch (e) {
        console.log("wrap token not support");
      }

      const transferTx = await executor(wrapTokenAddress).catch(e => {
        setLoading(false); //处理钱包拒绝交易
        onHandleCancel();
      });
      if (transferTx) {
        setTransferSuccess(true);
        setTxhash(transferTx.hash);
        setTransfState(TransferHistoryStatus?.TRANSFER_COMPLETED);
        const newtxStr = JSON.stringify(transferTx);
        const newtx = JSON.parse(newtxStr);
        if (newtx.code) {
          setLoading(false);
        } else {
          const selectedToChainToken = getTokenByChainAndTokenSymbol(toChain?.id, selectedToken?.token?.symbol)?.token;
          let transferJson;
          if (selectedToChainToken) {
            transferJson = {
              dst_block_tx_link: "",
              src_send_info: {
                amount: parseUnits(amount, selectedToken.token.decimal).toString(),
                chain: fromChain,
                token: selectedToken.token,
              },
              src_block_tx_link: `${getNetworkById(fromChain.id).blockExplorerUrl}/tx/${transferTx.hash}`,
              dst_received_info: {
                amount: parseUnits(receiveAmount.toString(), selectedToChainToken?.decimal).toString(),
                chain: toChain,
                token: selectedToChainToken,
              },
              status: TransferHistoryStatus.TRANSFER_SUBMITTING,
              transfer_id: _transferId,
              ts: new Date().getTime(),
              updateTime: new Date().getTime(),
              nonce,
              isLocal: true,
              txIsFailed: false,
            };
          }
          const localTransferListJsonStr = localStorage.getItem("transferListJson");
          let localTransferList: TransferHistory[] = [];
          if (localTransferListJsonStr) {
            localTransferList = JSON.parse(localTransferListJsonStr)[address] || [];
          }
          localTransferList.unshift(transferJson);
          const newJson = { [address]: localTransferList };
          localStorage.setItem("transferListJson", JSON.stringify(newJson));

          // Todo: mark的传参
          // const res = await markTransfer({
          //   transfer_id: _transferId,
          //   src_send_info: {
          //     chain: fromChain,
          //     token: selectedToken?.token,
          //     amount: value.toString(),
          //   },
          //   dst_min_received_info: {
          //     chain: toChain,
          //     token: selectedToChainToken || {
          //       symbol: "",
          //       address: "",
          //       decimal: 0,
          //     },
          //     amount: receiveNum.toString(),
          //   },
          //   addr: address,
          //   src_tx_hash: transferTx.hash,
          //   type: MarkTransferTypeRequest.TRANSFER_TYPE_SEND,
          // });
          // if (res.err) {
          //   onSuccess();
          //   onCancel();
          //   return;
          // }
        }
      }
    } catch (e) {
      //处理交易gaslimit 过低的失败
      // setTransfState("txFailed");
      clearInterval(detailInter);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  let titleText = "Transfer";
  let content;

  if (allowance && allowance.isZero() && !isNativeToken) {
    content = (
      <div className={classes.content}>
        <Avatar
          src={selectedToken?.icon}
          alt={getTokenSymbol(selectedToken?.token?.symbol, fromChain?.id)}
          style={{ marginBottom: 12 }}
        />
        <div className={classes.modalToptext}>
          {selectedToken?.token.display_symbol ?? getTokenListSymbol(selectedToken?.token?.symbol, fromChain?.id)}
        </div>
        <div className={classes.modaldes} style={{ marginTop: 20 }}>
          Please approve{" "}
          {selectedToken?.token.display_symbol ?? getTokenListSymbol(selectedToken?.token?.symbol, fromChain?.id)}{" "}
          before you continue the cross-chain transfer.
        </div>
        <Button
          type="primary"
          size="large"
          block
          loading={loading}
          onClick={() => {
            // approveMethod();
            handleAction();
          }}
          className={classes.button}
        >
          Approve
        </Button>
      </div>
    );
  } else if (transfState === BRIDGE_RATE_UPDATED) {
    content = (
      <>
        <TransDetail amount={amount} receiveAmount={receiveAmount} />
        <div className={classes.modalTop}>
          <div className={classes.transferde2}>
            <div className={classes.warningInnerbody}>
              <div>
                <WarningFilled style={{ fontSize: 20, marginRight: 5, color: "#ff8f00" }} />
                <span style={{ color: "#17171A" }}>Bridge Rate Updated</span>
              </div>
              <div
                style={{ color: "#3366FF", cursor: "pointer" }}
                onClick={() => {
                  updateRate();
                }}
              >
                Accept
              </div>
            </div>
          </div>
        </div>
        <Button
          type="primary"
          size="large"
          block
          // loading={loading}
          onClick={() => {
            //   handleAction();
          }}
          className={classes.button}
          disabled
        >
          Confirm Transfer
        </Button>
      </>
    );
  } else if (transfState === TransferHistoryStatus?.TRANSFER_COMPLETED) {
    // Relay - check your fund
    content = (
      <div>
        <div className={classes.modalTopIcon} style={{ marginTop: 80 }}>
          <img src={themeType === "dark" ? arrTop : arrTopLightIcon} height="120" alt="" />
        </div>
        <div className={classes.modalToptext2}>Transfer Submitted.</div>
        <div className={classes.modaldes}>{getBigAmountModalMsg()}</div>
        <Button
          type="primary"
          size="large"
          block
          // loading={loading}
          onClick={() => {
            setTransfState(TRANSFER);
            onSuccess();
            onHandleCancel();
          }}
          className={classes.button}
        >
          Done
        </Button>
      </div>
    );
    titleText = "";
  } else {
    content = (
      <>
        <TransDetail amount={amount} receiveAmount={receiveAmount} />
        <div className={classes.modalTop} hidden={arrivalGasTokenAmount.lte(0)}>
          <div className={classes.transferdes}>
            You will also receive{" "}
            <span style={{ color: "#ff8f00" }}>
              {arrivalGasTokenAmountDisplay} {arrivalGasTokenSymbol}
            </span>{" "}
            to pay gas fee on {toChain?.name}
          </div>
        </div>
        <Button
          type="primary"
          size="large"
          block
          loading={loading}
          onClick={() => {
            // transferMethod();
            handleAction();
          }}
          className={classes.button}
          style={{ marginTop: 0 }}
        >
          Confirm Transfer
        </Button>
      </>
    );
  }
  return (
    <Modal
      title={titleText}
      onCancel={onHandleCancel}
      visible={showTransferModal && hasGotAllowance}
      footer={null}
      className={classes.transferModal}
      maskClosable={false}
    >
      {content}
    </Modal>
  );
};

export default TransferModal;
