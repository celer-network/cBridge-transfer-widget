import { Modal, Button } from "antd";
import { ethers } from "ethers";
import { FC, useEffect, useState, useContext } from "react";
import { createUseStyles } from "react-jss";
import { WarningFilled } from "@ant-design/icons";
import { BigNumber } from "@ethersproject/bignumber";
import { formatUnits } from "@ethersproject/units";
import { formatDecimalPart, safeParseUnits } from "celer-web-utils/lib/format";
import { useConnectedWallet, TxResult } from "@terra-money/wallet-provider";
import { MsgExecuteContract } from "@terra-money/terra.js";
import { getAddress } from "ethers/lib/utils";

import { useContractsContext } from "../../providers/ContractsContextProvider";
import { useWeb3Context } from "../../providers/Web3ContextProvider";

import { useAppDispatch, useAppSelector } from "../../redux/store";
import { setEstimateAmtInfoInState } from "../../redux/transferSlice";

import { Theme } from "../../theme";
import { ERC20 } from "../../typechain/typechain/ERC20";
import { ERC20__factory } from "../../typechain/typechain/factories/ERC20__factory";
import { ColorThemeContext } from "../../providers/ThemeProvider";
import { useCustomContractLoader, useBigAmountDelay, useNativeETHToken } from "../../hooks";
import arrTop from "../../images/arrTop.svg";
import TransDetail from "./TransDetail";
import {
  TransferHistoryStatus,
  TransferHistory,
  FlowDepositParameters,
  FlowBurnParameters,
} from "../../constants/type";
import arrTopLightIcon from "../../images/arrTopLight.svg";

/* eslint-disable camelcase */

import { WebClient } from "../../proto/gateway/GatewayServiceClientPb";
import { EstimateAmtRequest, EstimateAmtResponse } from "../../proto/gateway/gateway_pb";
import { getNetworkById } from "../../constants/network";
import { PeggedChainMode, usePeggedPairConfig } from "../../hooks/usePeggedPairConfig";
import {
  isNonEVMChain,
  convertNonEVMAddressToEVMCompatible,
  useNonEVMContext,
  getNonEVMMode,
  NonEVMMode,
} from "../../providers/NonEVMContextProvider";
import { depositFromFlow, burnFromFlow } from "../../redux/NonEVMAPIs/flowAPIs";
import { pegV2ThirdPartDeployTokens, storageConstants } from "../../constants/const";
import { useNonEVMBigAmountDelay } from "../../hooks/useNonEVMBigAmountDelay";
import { convertCanonicalToTerraAddress, convertTerraToCanonicalAddress } from "../../redux/NonEVMAPIs/terraAPIs";
import { useMultiBurnConfig } from "../../hooks/useMultiBurnConfig";
import { isApeChain } from "../../hooks/useTransfer";

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
    "&:focus, &:hover": {
      background: theme.buttonHover,
    },
    "&::before": {
      backgroundColor: `${theme.primaryBrand} !important`,
    },
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
  nonEVMReceiverAddress: string;
  onCancel: () => void;
  onSuccess: () => void;
}

const TransferModal: FC<IProps> = ({ amount, receiveAmount, nonEVMReceiverAddress, onCancel, onSuccess }) => {
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const classes = useStyles({ isMobile });
  const {
    contracts: { bridge, originalTokenVault, originalTokenVaultV2, peggedTokenBridge, peggedTokenBridgeV2 },
    transactor,
  } = useContractsContext();
  const terraWallet = useConnectedWallet();
  const { provider, address, chainId } = useWeb3Context();
  const { nonEVMMode, nonEVMAddress } = useNonEVMContext();
  const dispatch = useAppDispatch();
  const { transferInfo, modal } = useAppSelector(state => state);
  const { showTransferModal } = modal;
  const { transferConfig, fromChain, toChain, selectedToken, estimateAmtInfoInState, rate, flowTokenPathConfigs } =
    transferInfo;

  const getTokenByChainAndTokenSymbol = (cId, tokenSymbol) => {
    return transferConfig?.chain_token[cId]?.token?.find(tokenInfo => tokenInfo?.token?.symbol === tokenSymbol);
  };

  const selectedToChain = transferConfig?.chains.find(chain => chain.id === toChain?.id);
  const value = safeParseUnits(amount || "0", selectedToken?.token?.decimal ?? 18);

  const toChainInConfig = transferConfig.chains.find(it => it.id === toChain?.id);

  // const arrivalGasTokenAmount = BigNumber.from(toChainInConfig?.drop_gas_amt ?? "0");
  const dropGasAmt =
    estimateAmtInfoInState?.dropGasAmt && estimateAmtInfoInState?.dropGasAmt.length > 0
      ? estimateAmtInfoInState?.dropGasAmt
      : "0";
  const arrivalGasTokenAmount = BigNumber.from(dropGasAmt);
  const arrivalGasTokenDecimal =
    getTokenByChainAndTokenSymbol(toChainInConfig?.id ?? 0, toChainInConfig?.gas_token_symbol)?.token.decimal ?? 18;
  const arrivalGasTokenAmountValue = formatUnits(arrivalGasTokenAmount, arrivalGasTokenDecimal);
  const arrivalGasTokenAmountDisplay = formatDecimalPart(arrivalGasTokenAmountValue || "0", 6, "round", true);
  const arrivalGasTokenSymbol = toChainInConfig?.gas_token_symbol;

  // token contract: param address is selected token's address
  const pegConfig = usePeggedPairConfig();
  const { multiBurnConfig } = useMultiBurnConfig();

  const tokenAddress = pegConfig?.getTokenBalanceAddress(
    selectedToken?.token?.address || "",
    fromChain?.id,
    selectedToken?.token?.symbol,
    transferConfig.pegged_pair_configs,
  );

  const tokenContract = useCustomContractLoader(
    provider,
    isNonEVMChain(fromChain?.id ?? 0) ? "" : tokenAddress || "",
    ERC20__factory,
  ) as ERC20 | undefined;
  const [transferSuccess, setTransferSuccess] = useState<boolean>(false);
  const [transfState, setTransfState] = useState<TransferHistoryStatus | "bridgeRateUpdated" | "transfer">(TRANSFER);
  const [loading, setLoading] = useState(false);
  const [newEstimateAmtInfoInState, setNewEstimateAmtInfoInState] = useState<EstimateAmtResponse.AsObject>({
    eqValueTokenAmt: "",
    bridgeRate: 0,
    baseFee: "",
    percFee: "",
    slippageTolerance: 0,
    maxSlippage: 0,
    estimatedReceiveAmt: "",
    dropGasAmt: "",
  });
  const { isNativeToken } = useNativeETHToken(fromChain, selectedToken);
  const { isBigAmountDelayed, delayMinutes } = useBigAmountDelay(toChain, selectedToken?.token, receiveAmount);
  const { nonEVMBigAmountDelayed, nonEVMDelayTimeInMinute } = useNonEVMBigAmountDelay(receiveAmount);

  let detailInter;
  const { themeType } = useContext(ColorThemeContext);
  useEffect(() => {
    const img = new Image();
    img.src = themeType === "dark" ? arrTop : arrTopLightIcon; // To speed up image source loading
    return () => {
      clearInterval(detailInter);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onHandleCancel = () => {
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
    let time = "5-20 minutes";

    if (isBigAmountDelayed) {
      time = `up to ${delayMinutes} minutes`;
    } else if (nonEVMBigAmountDelayed) {
      time = `up to ${nonEVMDelayTimeInMinute} minutes`;
    }
    return `Please allow ${time} for the funds to arrive at your wallet on ${toChain?.name}.`;
  };

  const getChainInfo = selectedChainId => {
    return transferConfig.chains.find(chain => chain.id === selectedChainId);
  };

  const handleAction = async () => {
    if (!fromChain || !toChain || !selectedToken) {
      return;
    }

    const estimateRequest = new EstimateAmtRequest();
    estimateRequest.setSrcChainId(fromChain?.id);
    estimateRequest.setDstChainId(toChain?.id);
    estimateRequest.setTokenSymbol(selectedToken?.token.symbol);
    estimateRequest.setUsrAddr(address);
    estimateRequest.setSlippageTolerance(Number(rate) * 10000);
    estimateRequest.setAmt(value.toString());
    estimateRequest.setIsPegged(pegConfig.mode !== PeggedChainMode.Off || multiBurnConfig !== undefined);

    const client = new WebClient(`${process.env.REACT_APP_GRPC_SERVER_URL}`, null, null);
    const res = await client.estimateAmt(estimateRequest, null);
    if (pegConfig.mode === PeggedChainMode.Off && multiBurnConfig === undefined) {
      if (res.getBridgeRate() !== estimateAmtInfoInState?.bridgeRate) {
        setNewEstimateAmtInfoInState(res.toObject());
        setTransfState(BRIDGE_RATE_UPDATED);
        return;
      }
    }

    const fromChainNonEVMMode = getNonEVMMode(fromChain?.id ?? 0);

    if (fromChainNonEVMMode !== NonEVMMode.off) {
      submitTransactionFromNonEVMChain(fromChainNonEVMMode);
      return;
    }

    const isToChainNonEVM = isNonEVMChain(toChain.id ?? 0);

    if (!transactor || !bridge || !tokenContract || !selectedToken?.token?.address || fromChain.id !== chainId) {
      return;
    }

    if (multiBurnConfig) {
      submitTransactionForPeggedBridgeV2(multiBurnConfig.burn_config_as_org.token.token.address);
      return;
    }

    if (pegConfig.mode === PeggedChainMode.Deposit && pegConfig.config.vault_version > 0) {
      submitTransactionForOriginalVaultV2();
      return;
    }

    if (
      (pegConfig.mode === PeggedChainMode.Burn || pegConfig.mode === PeggedChainMode.BurnThenSwap) &&
      pegConfig.config.bridge_version > 0
    ) {
      submitTransactionForPeggedBridgeV2(pegConfig.config.pegged_token.token.address);
      return;
    }

    if (
      (pegConfig.mode === PeggedChainMode.Deposit && (!originalTokenVault || originalTokenVault === undefined)) ||
      ((pegConfig.mode === PeggedChainMode.Burn || pegConfig.mode === PeggedChainMode.BurnThenSwap) &&
        (!peggedTokenBridge || peggedTokenBridge === undefined))
    ) {
      return;
    }

    try {
      if (value.isZero()) {
        return;
      }

      setLoading(true);

      const nonce = new Date().getTime();
      const receiverEVMCompatibleAddress = await convertNonEVMAddressToEVMCompatible(nonEVMReceiverAddress, nonEVMMode);
      const transferId = (() => {
        switch (pegConfig.mode) {
          case PeggedChainMode.Deposit:
            return ethers.utils.solidityKeccak256(
              ["address", "address", "uint256", "uint64", "address", "uint64", "uint64"],
              [
                address,
                selectedToken?.token?.address,
                value.toString(),
                toChain?.id.toString(),
                isToChainNonEVM ? receiverEVMCompatibleAddress : address,
                nonce.toString(),
                fromChain?.id.toString(),
              ],
            );
          case PeggedChainMode.BurnThenSwap:
            return ethers.utils.solidityKeccak256(
              ["address", "address", "uint256", "address", "uint64", "uint64"],
              [
                address,
                pegConfig.config.pegged_token.token.address,
                value.toString(),
                isToChainNonEVM ? receiverEVMCompatibleAddress : address,
                nonce.toString(),
                fromChain?.id.toString(),
              ],
            );
          case PeggedChainMode.Burn:
            return ethers.utils.solidityKeccak256(
              ["address", "address", "uint256", "address", "uint64", "uint64"],
              [
                address,
                selectedToken?.token?.address,
                value.toString(),
                isToChainNonEVM ? receiverEVMCompatibleAddress : address,
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

      console.log("transferId", transferId);

      const executor = (wrapToken: string | undefined) => {
        if (chainId !== fromChain?.id) {
          throw new Error("from chain id mismatch");
        }

        switch (pegConfig.mode) {
          case PeggedChainMode.Burn:
          case PeggedChainMode.BurnThenSwap:
            return transactor(
              // eslint-disable-next-line
              peggedTokenBridge!.burn(
                pegConfig.config.pegged_token.token.address,
                value,
                isToChainNonEVM ? receiverEVMCompatibleAddress : address,
                nonce,
              ),
            );
          case PeggedChainMode.Deposit:
            // if deposit the native token like BNB on BSC,AVAX on Avalanche, call the depositNative contract instead of the deposit.
            // what notable are Ethereum Mainnet, Celo, and BOBA chains are not supported
            if (
              wrapToken === pegConfig.config.org_token.token.address &&
              (fromChain.id !== 1 && fromChain.id !== 42220, fromChain.id !== 288)
            ) {
              return transactor(
                // eslint-disable-next-line
                originalTokenVault!.depositNative(
                  value,
                  pegConfig.config.pegged_chain_id,
                  isToChainNonEVM ? receiverEVMCompatibleAddress : address,
                  nonce,
                  { value },
                ),
              );
            }

            return transactor(
              // eslint-disable-next-line
              originalTokenVault!.deposit(
                pegConfig.config.org_token.token.address,
                value,
                pegConfig.config.pegged_chain_id,
                isToChainNonEVM ? receiverEVMCompatibleAddress : address,
                nonce,
              ),
            );

          default:
            if (getAddress(bridge.address) !== getAddress(getChainInfo(chainId)?.contract_addr ?? "")) {
              throw new Error("contract addr not matched");
            }

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

      const transferTx = await executor(wrapTokenAddress).catch(_ => {
        setLoading(false); // Handle transaction rejection
        onHandleCancel();
      });
      if (transferTx) {
        setTransferSuccess(true);
        setTransfState(TransferHistoryStatus?.TRANSFER_COMPLETED);
        const newtxStr = JSON.stringify(transferTx);
        const newtx = JSON.parse(newtxStr);
        if (newtx.code) {
          setLoading(false);
        } else {
          const selectedToChainToken = getTokenByChainAndTokenSymbol(toChain?.id, selectedToken?.token?.symbol)?.token;
          if (selectedToChainToken) {
            const transferJson: TransferHistory = {
              dst_block_tx_link: "",
              src_send_info: {
                amount: safeParseUnits(amount, selectedToken.token.decimal).toString(),
                chain: fromChain,
                token: selectedToken.token,
              },
              src_block_tx_link: `${getNetworkById(fromChain.id).blockExplorerUrl}/tx/${transferTx.hash}`,
              dst_received_info: {
                amount: safeParseUnits(receiveAmount.toString(), selectedToChainToken?.decimal).toString(),
                chain: toChain,
                token: selectedToChainToken,
              },
              srcAddress: address,
              dstAddress: isToChainNonEVM ? nonEVMReceiverAddress : address, /// Local check only, don't use address with leading 0s. Use original address.
              status: TransferHistoryStatus.TRANSFER_SUBMITTING,
              transfer_id: transferId,
              ts: nonce,
              updateTime: nonce,
              nonce,
              isLocal: true,
              txIsFailed: false,
            };

            const localTransferListJsonStr = localStorage.getItem(storageConstants.KEY_TRANSFER_LIST_JSON);
            let localTransferList: TransferHistory[] = [];
            if (localTransferListJsonStr) {
              localTransferList = JSON.parse(localTransferListJsonStr) || [];
            }
            localTransferList.unshift(transferJson);
            localStorage.setItem(storageConstants.KEY_TRANSFER_LIST_JSON, JSON.stringify(localTransferList));
          }
        }
      }
    } catch (e) {
      // Handle failure due to low gas limit setting
      console.log("e", e);
      clearInterval(detailInter);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const submitTransactionFromNonEVMChain = async (fromChainNonEVMMode: NonEVMMode) => {
    setLoading(true);

    if (multiBurnConfig) {
      if (fromChainNonEVMMode === NonEVMMode.flowMainnet || fromChainNonEVMMode === NonEVMMode.flowTest) {
        submitFlowBurn(multiBurnConfig.burn_config_as_org.burn_contract_addr);
      } else if (fromChainNonEVMMode === NonEVMMode.terraMainnet || fromChainNonEVMMode === NonEVMMode.terraTest) {
        submitTerraBurn(multiBurnConfig.burn_config_as_org.token.token.address);
      }
      return;
    }

    const deposit = transferConfig.pegged_pair_configs.find(config => {
      return (
        config.org_chain_id === fromChain?.id &&
        config.pegged_chain_id === toChain?.id &&
        config.org_token.token.symbol === selectedToken?.token.symbol
      );
    });

    const burn = transferConfig.pegged_pair_configs.find(config => {
      return (
        config.pegged_chain_id === fromChain?.id &&
        config.org_chain_id === toChain?.id &&
        config.pegged_token.token.symbol === selectedToken?.token.symbol
      );
    });

    if (deposit) {
      if (fromChainNonEVMMode === NonEVMMode.flowMainnet || fromChainNonEVMMode === NonEVMMode.flowTest) {
        submitFlowDeposit(deposit.pegged_deposit_contract_addr);
      } else if (fromChainNonEVMMode === NonEVMMode.terraMainnet || fromChainNonEVMMode === NonEVMMode.terraTest) {
        submitTerraDeposit(deposit.pegged_deposit_contract_addr);
      }
    } else if (burn) {
      if (fromChainNonEVMMode === NonEVMMode.flowMainnet || fromChainNonEVMMode === NonEVMMode.flowTest) {
        submitFlowBurn(burn.pegged_burn_contract_addr);
      } else if (fromChainNonEVMMode === NonEVMMode.terraMainnet || fromChainNonEVMMode === NonEVMMode.terraTest) {
        submitTerraBurn(burn.pegged_token.token.address);
      }
    } else {
      setLoading(false);
    }
  };

  const submitFlowDeposit = async (flowDepositContractAddress: string) => {
    const nonce = new Date().getTime();
    const flowTokenPath = flowTokenPathConfigs.find(config => {
      return config.Symbol === selectedToken?.token.symbol;
    });
    const depositParameter: FlowDepositParameters = {
      safeBoxContractAddress: flowDepositContractAddress,
      storagePath: flowTokenPath?.StoragePath ?? "",
      amount,
      flowAddress: nonEVMAddress,
      mintChainId: (toChain?.id ?? 0).toString(),
      evmMintAddress: nonEVMReceiverAddress,
      nonce: nonce.toString(),
      tokenAddress: selectedToken?.token.address ?? "",
    };
    await depositFromFlow(depositParameter)
      .then(response => {
        setLoading(false);
        if (response.flowTransanctionId.length > 0) {
          setTransferSuccess(true);
          setTransfState(TransferHistoryStatus?.TRANSFER_COMPLETED);

          const selectedToChainToken = getTokenByChainAndTokenSymbol(toChain?.id, selectedToken?.token?.symbol)?.token;
          if (selectedToChainToken && fromChain && selectedToken?.token && toChain) {
            const transferJson: TransferHistory = {
              dst_block_tx_link: "",
              src_send_info: {
                amount: safeParseUnits(amount, selectedToken?.token.decimal ?? 18).toString(),
                chain: fromChain,
                token: selectedToken?.token,
              },
              src_block_tx_link: `${getNetworkById(fromChain?.id ?? 0).blockExplorerUrl}/transaction/${
                response.flowTransanctionId
              }`,
              srcAddress: depositParameter.flowAddress,
              dst_received_info: {
                amount: safeParseUnits(receiveAmount.toString(), selectedToChainToken?.decimal).toString(),
                chain: toChain,
                token: selectedToChainToken,
              },
              dstAddress: depositParameter.evmMintAddress,
              status: TransferHistoryStatus.TRANSFER_SUBMITTING,
              transfer_id: response.transferId,
              ts: nonce,
              updateTime: nonce,
              nonce,
              isLocal: true,
              txIsFailed: false,
            };

            const localTransferListJsonStr = localStorage.getItem(storageConstants.KEY_TRANSFER_LIST_JSON);
            let localTransferList: TransferHistory[] = [];
            if (localTransferListJsonStr) {
              localTransferList = JSON.parse(localTransferListJsonStr) || [];
            }
            localTransferList.unshift(transferJson);
            localStorage.setItem(storageConstants.KEY_TRANSFER_LIST_JSON, JSON.stringify(localTransferList));
          }
        }
      })
      .catch(_ => {
        // continue
        setLoading(false);
      });
  };

  const submitFlowBurn = async (flowBurnContractAddress: string) => {
    const nonce = new Date().getTime();
    const flowTokenPath = flowTokenPathConfigs.find(config => {
      return config.Symbol === selectedToken?.token.symbol;
    });
    const burnParameter: FlowBurnParameters = {
      pegBridgeAddress: flowBurnContractAddress,
      storagePath: flowTokenPath?.StoragePath ?? "",
      amount,
      flowAddress: nonEVMAddress,
      withdrawChainId: (toChain?.id ?? 0).toString(),
      evmWithdrawAddress: nonEVMReceiverAddress,
      nonce: nonce.toString(),
      tokenAddress: selectedToken?.token.address ?? "",
    };

    await burnFromFlow(burnParameter)
      .then(response => {
        setLoading(false);
        if (response.flowTransanctionId.length > 0) {
          setTransferSuccess(true);
          setTransfState(TransferHistoryStatus?.TRANSFER_COMPLETED);

          const selectedToChainToken = getTokenByChainAndTokenSymbol(toChain?.id, selectedToken?.token?.symbol)?.token;
          if (selectedToChainToken && fromChain && selectedToken?.token && toChain) {
            const transferJson: TransferHistory = {
              dst_block_tx_link: "",
              src_send_info: {
                amount: safeParseUnits(amount, selectedToken?.token.decimal ?? 18).toString(),
                chain: fromChain,
                token: selectedToken?.token,
              },
              src_block_tx_link: `${getNetworkById(fromChain?.id ?? 0).blockExplorerUrl}/transaction/${
                response.flowTransanctionId
              }`,
              srcAddress: burnParameter.flowAddress,
              dst_received_info: {
                amount: safeParseUnits(receiveAmount.toString(), selectedToChainToken?.decimal).toString(),
                chain: toChain,
                token: selectedToChainToken,
              },
              dstAddress: burnParameter.evmWithdrawAddress,
              status: TransferHistoryStatus.TRANSFER_SUBMITTING,
              transfer_id: response.transferId,
              ts: nonce,
              updateTime: nonce,
              nonce,
              isLocal: true,
              txIsFailed: false,
            };

            const localTransferListJsonStr = localStorage.getItem(storageConstants.KEY_TRANSFER_LIST_JSON);
            let localTransferList: TransferHistory[] = [];
            if (localTransferListJsonStr) {
              localTransferList = JSON.parse(localTransferListJsonStr) || [];
            }
            localTransferList.unshift(transferJson);
            localStorage.setItem(storageConstants.KEY_TRANSFER_LIST_JSON, JSON.stringify(localTransferList));
          }
        }
      })
      .catch(_ => {
        // continue
        setLoading(false);
      });
  };

  const submitTerraDeposit = async (canonicalContractAddress: string) => {
    if (terraWallet) {
      const nonce = new Date().getTime();
      const senderEVMCompatibleAddress = await convertTerraToCanonicalAddress(terraWallet.walletAddress);
      const terraContractAddress = await convertCanonicalToTerraAddress(
        canonicalContractAddress.toLowerCase().replace("0x", ""),
      );

      const transferId = ethers.utils.solidityKeccak256(
        ["address", "address", "uint256", "uint64", "address", "uint64", "uint64"],
        [
          senderEVMCompatibleAddress,
          selectedToken?.token?.address,
          (Number(amount) * 1000000).toString(),
          toChain?.id.toString(),
          nonEVMReceiverAddress,
          nonce.toString(),
          fromChain?.id.toString(),
        ],
      );

      terraWallet
        .post({
          msgs: [
            new MsgExecuteContract(
              terraWallet.walletAddress,
              terraContractAddress,
              {
                deposit_native: {
                  dst_chid: toChain?.id ?? 0,
                  mint_acnt: nonEVMReceiverAddress,
                  nonce,
                },
              },
              { uluna: Number(amount) * 1000000 },
            ),
          ],
        })
        .then((nextTxResult: TxResult) => {
          console.log(nextTxResult);
          setLoading(false);
          if (nextTxResult.success) {
            setTransferSuccess(true);
            setTransfState(TransferHistoryStatus?.TRANSFER_COMPLETED);

            const selectedToChainToken = getTokenByChainAndTokenSymbol(
              toChain?.id,
              selectedToken?.token?.symbol,
            )?.token;
            if (selectedToChainToken && fromChain && selectedToken?.token && toChain) {
              const transferJson: TransferHistory = {
                dst_block_tx_link: "",
                src_send_info: {
                  amount: safeParseUnits(amount, selectedToken?.token.decimal ?? 18).toString(),
                  chain: fromChain,
                  token: selectedToken?.token,
                },
                src_block_tx_link: `${
                  getNetworkById(fromChain?.id ?? 0).blockExplorerUrl
                }/tx/${nextTxResult.result.txhash.replace("0x", "")}`,
                srcAddress: terraWallet.walletAddress,
                dst_received_info: {
                  amount: safeParseUnits(receiveAmount.toString(), selectedToChainToken?.decimal).toString(),
                  chain: toChain,
                  token: selectedToChainToken,
                },
                dstAddress: nonEVMReceiverAddress,
                status: TransferHistoryStatus.TRANSFER_SUBMITTING,
                transfer_id: transferId,
                ts: nonce,
                updateTime: nonce,
                nonce,
                isLocal: true,
                txIsFailed: false,
              };

              const localTransferListJsonStr = localStorage.getItem(storageConstants.KEY_TRANSFER_LIST_JSON);
              let localTransferList: TransferHistory[] = [];
              if (localTransferListJsonStr) {
                localTransferList = JSON.parse(localTransferListJsonStr) || [];
              }
              localTransferList.unshift(transferJson);
              localStorage.setItem(storageConstants.KEY_TRANSFER_LIST_JSON, JSON.stringify(localTransferList));
            }
          }
        })
        .catch(error => {
          console.log("error", error);
          setLoading(false);
        });
      return;
    }
    setLoading(false);
  };

  const submitTerraBurn = async (canonicalTokenAddress: string) => {
    if (terraWallet) {
      const nonce = new Date().getTime();
      const senderEVMCompatibleAddress = await convertTerraToCanonicalAddress(terraWallet.walletAddress);
      const terraTokenAddress = await convertCanonicalToTerraAddress(
        canonicalTokenAddress.toLowerCase().replace("0x", ""),
      );

      const transferId = ethers.utils.solidityKeccak256(
        ["address", "address", "uint256", "uint64", "address", "uint64", "uint64"],
        [
          senderEVMCompatibleAddress,
          selectedToken?.token.address, /// selectedToken?.token?.address,
          value.toString(),
          toChain?.id.toString(),
          nonEVMReceiverAddress,
          nonce.toString(),
          fromChain?.id.toString(),
        ],
      );

      const msgInfo = {
        to_chid: toChain?.id ?? 0,
        to_acnt: nonEVMReceiverAddress,
        nonce,
      };

      const base64Msg = Buffer.from(JSON.stringify(msgInfo)).toString("base64");

      terraWallet
        .post({
          msgs: [
            new MsgExecuteContract(terraWallet.walletAddress, terraTokenAddress, {
              burn: {
                msg: base64Msg,
                amount: value.toString(),
              },
            }),
          ],
        })
        .then((nextTxResult: TxResult) => {
          console.log(nextTxResult);
          setLoading(false);
          if (nextTxResult.success) {
            setTransferSuccess(true);
            setTransfState(TransferHistoryStatus?.TRANSFER_COMPLETED);

            const selectedToChainToken = getTokenByChainAndTokenSymbol(
              toChain?.id,
              selectedToken?.token?.symbol,
            )?.token;
            if (selectedToChainToken && fromChain && selectedToken?.token && toChain) {
              const transferJson: TransferHistory = {
                dst_block_tx_link: "",
                src_send_info: {
                  amount: safeParseUnits(amount, selectedToken?.token.decimal ?? 18).toString(),
                  chain: fromChain,
                  token: selectedToken?.token,
                },
                src_block_tx_link: `${
                  getNetworkById(fromChain?.id ?? 0).blockExplorerUrl
                }/tx/${nextTxResult.result.txhash.replace("0x", "")}`,
                srcAddress: terraWallet.walletAddress,
                dst_received_info: {
                  amount: safeParseUnits(receiveAmount.toString(), selectedToChainToken?.decimal).toString(),
                  chain: toChain,
                  token: selectedToChainToken,
                },
                dstAddress: nonEVMReceiverAddress,
                status: TransferHistoryStatus.TRANSFER_SUBMITTING,
                transfer_id: transferId,
                ts: nonce,
                updateTime: nonce,
                nonce,
                isLocal: true,
                txIsFailed: false,
              };

              const localTransferListJsonStr = localStorage.getItem(storageConstants.KEY_TRANSFER_LIST_JSON);
              let localTransferList: TransferHistory[] = [];
              if (localTransferListJsonStr) {
                localTransferList = JSON.parse(localTransferListJsonStr) || [];
              }
              localTransferList.unshift(transferJson);
              localStorage.setItem(storageConstants.KEY_TRANSFER_LIST_JSON, JSON.stringify(localTransferList));
            }
          }
        })
        .catch(error => {
          console.log("error", error);
          setLoading(false);
        });
      return;
    }
    setLoading(false);
  };

  const submitTransactionForOriginalVaultV2 = async () => {
    if (
      value.isZero() ||
      !transactor ||
      fromChain === undefined ||
      toChain === undefined ||
      selectedToken === undefined
    ) {
      return;
    }

    if (!originalTokenVaultV2 || originalTokenVaultV2 === undefined) {
      console.log("Warning: Original Token Vault V2 not ready");
      return;
    }

    const nonce = new Date().getTime();
    const receiverEVMCompatibleAddress = await convertNonEVMAddressToEVMCompatible(nonEVMReceiverAddress, nonEVMMode);
    const isToChainNonEVM = isNonEVMChain(toChain?.id ?? 0);

    const transferId = ethers.utils.solidityKeccak256(
      ["address", "address", "uint256", "uint64", "address", "uint64", "uint64", "address"],
      [
        address,
        selectedToken?.token?.address,
        value.toString(),
        toChain?.id.toString(),
        isToChainNonEVM ? receiverEVMCompatibleAddress : address,
        nonce.toString(),
        fromChain?.id.toString(),
        originalTokenVaultV2.address,
      ],
    );

    const executor = (wrapToken: string | undefined) => {
      if (wrapToken === pegConfig.config.org_token.token.address) {
        if (isApeChain(fromChain.id)) {
          return transactor(
            // eslint-disable-next-line
            originalTokenVaultV2!.depositNative(
              value,
              pegConfig.config.pegged_chain_id,
              isToChainNonEVM ? receiverEVMCompatibleAddress : address,
              nonce,
              { value, gasPrice: 0 },
            ),
          );
        }
        return transactor(
          // eslint-disable-next-line
          originalTokenVaultV2!.depositNative(
            value,
            pegConfig.config.pegged_chain_id,
            isToChainNonEVM ? receiverEVMCompatibleAddress : address,
            nonce,
            { value },
          ),
        );
      }

      // force Ape chain gas price = 0;
      if (isApeChain(fromChain.id)) {
        return transactor(
          // eslint-disable-next-line
          originalTokenVaultV2!.deposit(
            pegConfig.config.org_token.token.address,
            value,
            pegConfig.config.pegged_chain_id,
            isToChainNonEVM ? receiverEVMCompatibleAddress : address,
            nonce,
            { gasPrice: 0 },
          ),
        );
      }
      return transactor(
        // eslint-disable-next-line
        originalTokenVaultV2!.deposit(
          pegConfig.config.org_token.token.address,
          value,
          pegConfig.config.pegged_chain_id,
          isToChainNonEVM ? receiverEVMCompatibleAddress : address,
          nonce,
        ),
      );
    };

    let wrapTokenAddress;
    try {
      wrapTokenAddress = await originalTokenVaultV2?.nativeWrap();
    } catch (e) {
      console.log("wrap token not support");
    }

    try {
      setLoading(true);

      const transferTx = await executor(wrapTokenAddress).catch(_ => {
        setLoading(false); // Handle transaction rejection
        onHandleCancel();
      });
      if (transferTx) {
        setTransferSuccess(true);
        setTransfState(TransferHistoryStatus?.TRANSFER_COMPLETED);
        const newtxStr = JSON.stringify(transferTx);
        const newtx = JSON.parse(newtxStr);
        if (newtx.code) {
          setLoading(false);
        } else {
          const selectedToChainToken = getTokenByChainAndTokenSymbol(toChain?.id, selectedToken?.token?.symbol)?.token;
          if (selectedToChainToken) {
            const transferJson: TransferHistory = {
              dst_block_tx_link: "",
              src_send_info: {
                amount: safeParseUnits(amount, selectedToken.token.decimal).toString(),
                chain: fromChain,
                token: selectedToken.token,
              },
              src_block_tx_link: `${getNetworkById(fromChain.id).blockExplorerUrl}/tx/${transferTx.hash}`,
              dst_received_info: {
                amount: safeParseUnits(receiveAmount.toString(), selectedToChainToken?.decimal).toString(),
                chain: toChain,
                token: selectedToChainToken,
              },
              srcAddress: address,
              dstAddress: isToChainNonEVM ? nonEVMReceiverAddress : address, /// Local check only, don't use address with leading 0s. Use original address.
              status: TransferHistoryStatus.TRANSFER_SUBMITTING,
              transfer_id: transferId,
              ts: nonce,
              updateTime: nonce,
              nonce,
              isLocal: true,
              txIsFailed: false,
            };

            const localTransferListJsonStr = localStorage.getItem(storageConstants.KEY_TRANSFER_LIST_JSON);
            let localTransferList: TransferHistory[] = [];
            if (localTransferListJsonStr) {
              localTransferList = JSON.parse(localTransferListJsonStr) || [];
            }
            localTransferList.unshift(transferJson);
            localStorage.setItem(storageConstants.KEY_TRANSFER_LIST_JSON, JSON.stringify(localTransferList));
          }
        }
      }
    } catch (e) {
      // Handle failure due to low gas limit setting
      console.log("e", e);
      clearInterval(detailInter);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const submitTransactionForPeggedBridgeV2 = async (burnTokenAddress: string) => {
    if (
      value.isZero() ||
      !transactor ||
      fromChain === undefined ||
      toChain === undefined ||
      selectedToken === undefined
    ) {
      return;
    }

    if (!peggedTokenBridgeV2 || peggedTokenBridgeV2 === undefined) {
      console.log("Warning: Pegged Bridge V2 not ready");
      return;
    }

    const nonce = new Date().getTime();
    const receiverEVMCompatibleAddress = await convertNonEVMAddressToEVMCompatible(nonEVMReceiverAddress, nonEVMMode);
    const isToChainNonEVM = isNonEVMChain(toChain?.id ?? 0);

    const transferId = ethers.utils.solidityKeccak256(
      ["address", "address", "uint256", "uint64", "address", "uint64", "uint64", "address"],
      [
        address,
        burnTokenAddress,
        value.toString(),
        toChain?.id.toString(),
        isToChainNonEVM ? receiverEVMCompatibleAddress : address,
        nonce.toString(),
        fromChain?.id.toString(),
        peggedTokenBridgeV2.address,
      ],
    );

    let burn;
    if (pegV2ThirdPartDeployTokens[fromChain?.id]?.includes(tokenAddress)) {
      burn = peggedTokenBridgeV2.burnFrom(
        burnTokenAddress,
        value,
        toChain?.id ?? 0,
        isToChainNonEVM ? receiverEVMCompatibleAddress : address,
        nonce,
      );
    } else {
      burn = peggedTokenBridgeV2.burn(
        burnTokenAddress,
        value,
        toChain?.id ?? 0,
        isToChainNonEVM ? receiverEVMCompatibleAddress : address,
        nonce,
      );
    }

    try {
      setLoading(true);
      const transferTx = await transactor(burn).catch(_ => {
        setLoading(false); // Handle transaction rejection
        onHandleCancel();
      });

      console.log("transferTx", transferTx);
      if (transferTx) {
        setTransferSuccess(true);
        setTransfState(TransferHistoryStatus?.TRANSFER_COMPLETED);
        const newtxStr = JSON.stringify(transferTx);
        const newtx = JSON.parse(newtxStr);
        if (newtx.code) {
          setLoading(false);
        } else {
          const selectedToChainToken = getTokenByChainAndTokenSymbol(toChain?.id, selectedToken?.token?.symbol)?.token;
          if (selectedToChainToken) {
            const transferJson: TransferHistory = {
              dst_block_tx_link: "",
              src_send_info: {
                amount: safeParseUnits(amount, selectedToken.token.decimal).toString(),
                chain: fromChain,
                token: selectedToken.token,
              },
              src_block_tx_link: `${getNetworkById(fromChain.id).blockExplorerUrl}/tx/${transferTx.hash}`,
              dst_received_info: {
                amount: safeParseUnits(receiveAmount.toString(), selectedToChainToken?.decimal).toString(),
                chain: toChain,
                token: selectedToChainToken,
              },
              srcAddress: address,
              dstAddress: isToChainNonEVM ? nonEVMReceiverAddress : address, /// Local check only, don't use address with leading 0s. Use original address.
              status: TransferHistoryStatus.TRANSFER_SUBMITTING,
              transfer_id: transferId,
              ts: nonce,
              updateTime: nonce,
              nonce,
              isLocal: true,
              txIsFailed: false,
            };

            const localTransferListJsonStr = localStorage.getItem(storageConstants.KEY_TRANSFER_LIST_JSON);
            let localTransferList: TransferHistory[] = [];
            if (localTransferListJsonStr) {
              localTransferList = JSON.parse(localTransferListJsonStr) || [];
            }
            localTransferList.unshift(transferJson);
            localStorage.setItem(storageConstants.KEY_TRANSFER_LIST_JSON, JSON.stringify(localTransferList));
          }
        }
      }
    } catch (e) {
      // Handle failure due to low gas limit setting
      console.log("e", e);
      clearInterval(detailInter);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  let titleText = "Transfer";
  let content;

  if (transfState === BRIDGE_RATE_UPDATED) {
    content = (
      <>
        <TransDetail amount={amount} receiveAmount={receiveAmount} receiverAddress={nonEVMReceiverAddress} />
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
        <Button type="primary" size="large" block onClick={() => {}} className={classes.button} disabled>
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
        <TransDetail amount={amount} receiveAmount={receiveAmount} receiverAddress={nonEVMReceiverAddress} />
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
      visible={showTransferModal}
      footer={null}
      className={classes.transferModal}
      maskClosable={false}
    >
      {content}
    </Modal>
  );
};

export default TransferModal;
