import { useEffect, useState } from "react";
import { Modal, Button, message } from "antd";
import { createUseStyles } from "react-jss";
import { LoadingOutlined, WarningFilled } from "@ant-design/icons";
import { base64, getAddress, hexlify } from "ethers/lib/utils";
import { BigNumber } from "@ethersproject/bignumber";

import { TransferHistoryStatus, WithdrawDetail, TransferHistory } from "../constants/type";
import errorMessages from "../constants/errorMessage";
import { Theme } from "../theme";
import { useContractsContext } from "../providers/ContractsContextProvider";
import { useWeb3Context } from "../providers/Web3ContextProvider";

import { getTransferStatus, withdrawLiquidity } from "../redux/gateway";
import { switchChain, setFromChain } from "../redux/transferSlice";
import { useAppSelector, useAppDispatch } from "../redux/store";
import { GetPeggedMode, PeggedChainMode, getPeggedPairConfigs } from "../hooks/usePeggedPairConfig";

import { WithdrawReq as WithdrawReqProto, WithdrawType } from "../proto/sgn/cbridge/v1/tx_pb";
import {
  EstimateWithdrawAmtRequest,
  EstimateWithdrawAmtResponse,
  WithdrawInfo,
  WithdrawLiquidityRequest,
  WithdrawMethodType,
  EstimateWithdrawAmt,
} from "../proto/gateway/gateway_pb";

import { WebClient } from "../proto/gateway/GatewayServiceClientPb";

import { formatBlockExplorerUrlWithTxHash } from "../utils/formatUrl";
import { storageConstants } from "../constants/const";
import { isToBeConfirmRefund } from "../utils/mergeTransferHistory";
import { getNonEVMMode, NonEVMMode, useNonEVMContext } from "../providers/NonEVMContextProvider";
import { submitFlowRefundRequest } from "../redux/NonEVMAPIs/flowAPIs";
import { getNetworkById } from "../constants/network";

/* eslint-disable */
/* eslint-disable camelcase */

const useStyles = createUseStyles((theme: Theme) => ({
  modalTop: {},
  modalTopDes: {
    fontSize: 14,
  },
  modaldes: {
    color: theme.surfacePrimary,
    marginTop: 40,
    fontSize: 15,
    textAlign: "center",
  },
  modaldes2: {
    color: theme.surfacePrimary,
    marginTop: 70,
    fontSize: 15,
    textAlign: "center",
  },
  button: {
    marginTop: 40,
    height: 56,
    lineHeight: "42px",
    background: theme.primaryBrand,
    borderRadius: 16,
    border: "none",
    fontSize: 18,
    fontWeight: 700,
    "&:focus, &:hover": {
      background: theme.buttonHover,
    },
    "&::before": {
      backgroundColor: `${theme.primaryBrand} !important`,
    },
  },
  modalTopIcon: {
    fontSize: 16,
    fontWeight: 600,
    width: "100%",
    textAlign: "center",
    marginTop: 40,
    marginBottom: 45,
  },
  modalToptext: {
    fontSize: 15,
    width: "100%",
    textAlign: "center",
    fontWeight: 600,
    color: theme.surfacePrimary,
  },
  transferModal: {
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
        minHeight: 240,
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
  yellowText: {
    color: theme.infoWarning,
    display: "inline-block",
  },
}));

const HistoryTransferModal = ({ visible, onCancel, record }) => {
  const classes = useStyles();
  const {
    contracts: { bridge, originalTokenVault, originalTokenVaultV2 },
    transactor,
  } = useContractsContext();
  const { signer, chainId, address } = useWeb3Context();
  const { flowConnected, loadNonEVMModal } = useNonEVMContext();
  const dispatch = useAppDispatch();
  const { windowWidth, transferInfo } = useAppSelector(state => state);
  const { transferConfig } = transferInfo;
  const { isMobile } = windowWidth;
  const [loading, setLoading] = useState(false);
  const [transfState, setTransfState] = useState(record?.status);
  const [withdrawDetail, setWithdrawDetail] = useState<WithdrawDetail>();
  const [transferStatusInfo, setTransferStatusInfo] = useState<any>();
  const peggedMode = GetPeggedMode(
    record?.src_send_info?.chain?.id,
    record?.dst_received_info?.chain?.id,
    record?.dst_received_info?.token?.symbol,
    transferInfo.transferConfig.pegged_pair_configs,
  );
  getPeggedPairConfigs(
    transferInfo.transferConfig.pegged_pair_configs,
    record.src_send_info.chain,
    record.dst_received_info.chain,
    { token: record.src_send_info.token },
    dispatch,
  );
  const srcSendChainNonEVMMode = getNonEVMMode(record?.src_send_info?.chain.id ?? 0);

  useEffect(() => {
    setTransfState(record?.status);
  }, [record]);

  let content;
  let detailInter;
  const getestimate = async () => {
    const withdrawItem = new WithdrawInfo();
    withdrawItem.setChainId(record?.src_send_info.chain.id);
    withdrawItem.setAmount(record?.src_send_info.amount);
    withdrawItem.setSlippageTolerance(1000000);

    const estimateReq = new EstimateWithdrawAmtRequest();
    estimateReq.setSrcWithdrawsList(Array(withdrawItem));
    estimateReq.setDstChainId(record?.src_send_info.chain.id);
    estimateReq.setTokenSymbol(record?.src_send_info.token.symbol);
    estimateReq.setUsrAddr(address);

    const client = new WebClient(`${process.env.REACT_APP_GRPC_SERVER_URL}`, null, null);
    const res: EstimateWithdrawAmtResponse = await client.estimateWithdrawAmt(estimateReq, null);

    let estimateResult = "";
    if (!res.getErr() && res.getReqAmtMap()) {
      const resMap = res.getReqAmtMap();
      resMap.forEach((entry: EstimateWithdrawAmt, key: number) => {
        if (key === Number(record?.src_send_info.chain.id)) {
          const totleFee = (Number(entry.getBaseFee()) + Number(entry.getPercFee())).toString() || "0";
          const eqValueTokenAmtBigNum = BigNumber.from(entry.getEqValueTokenAmt());
          const feeBigNum = BigNumber.from(totleFee);
          const targetReceiveAmounts = eqValueTokenAmtBigNum.sub(feeBigNum);
          estimateResult = targetReceiveAmounts.toString();
        }
      });
    }

    return estimateResult;
  };
  const requestRefund = async () => {
    if (!bridge && srcSendChainNonEVMMode === NonEVMMode.off) {
      return;
    }
    if (!signer) {
      return;
    }
    setLoading(true);
    const estimated = await getestimate();
    if (estimated) {
      const timestamp = Math.floor(Date.now() / 1000);
      const withdrawReqProto = new WithdrawReqProto();
      withdrawReqProto.setXferId(record.transfer_id);
      withdrawReqProto.setReqId(timestamp);
      withdrawReqProto.setWithdrawType(WithdrawType.WITHDRAW_TYPE_REFUND_TRANSFER);

      const req = new WithdrawLiquidityRequest();
      req.setWithdrawReq(withdrawReqProto.serializeBinary());
      req.setEstimatedReceivedAmt(estimated);
      req.setMethodType(WithdrawMethodType.WD_METHOD_TYPE_ONE_RM);
      const wres = await withdrawLiquidity(req);
      if (!wres.getErr()) {
        detailInter = setInterval(async () => {
          const res = await getTransferStatus({ transfer_id: record.transfer_id });
          setTransferStatusInfo(res);
          if (res?.status) {
            const status = res.status;
            // if (status === TransferHistoryStatus.TRANSFER_REQUESTING_REFUND) {
            //   setTransfState(status);
            // } else
            if (status === TransferHistoryStatus.TRANSFER_REFUND_TO_BE_CONFIRMED) {
              setTransfState(status);
              const { wd_onchain, sorted_sigs, signers, powers } = res;
              setWithdrawDetail({
                _wdmsg: wd_onchain,
                _sigs: sorted_sigs,
                _signers: signers,
                _powers: powers,
              });
              setLoading(false);
              clearInterval(detailInter);
            }
          } else if (res.status === TransferHistoryStatus.TRANSFER_UNKNOWN) {
            console.error("status: " + res.status);
          } else {
            clearInterval(detailInter);
            setLoading(false);
          }
        }, 5000);
      } else {
        message.error("Refund error");
        setLoading(false);
        setTransfState(TransferHistoryStatus?.TRANSFER_TO_BE_REFUNDED);
      }
    }
  };

  const confirmFlowRefund = async () => {
    let nowWithdrawDetail = withdrawDetail;
    if (!nowWithdrawDetail) {
      const res = await getTransferStatus({
        transfer_id: record.transfer_id,
      });
      setTransferStatusInfo(res);
      const { wd_onchain, sorted_sigs, signers, powers } = res;
      nowWithdrawDetail = {
        _wdmsg: wd_onchain,
        _sigs: sorted_sigs,
        _signers: signers,
        _powers: powers,
      };
    }
    setLoading(true);
    const { _wdmsg, _sigs } = nowWithdrawDetail;
    const wdmsg = base64.decode(_wdmsg);
    const sigs = _sigs.map(item => {
      return base64.decode(item);
    });

    console.log("record", record);

    const depositContractAddress =
      transferInfo.transferConfig.pegged_pair_configs.find(peggedPairConfig => {
        return (
          peggedPairConfig.org_chain_id === record?.src_send_info?.chain?.id &&
          peggedPairConfig.org_token.token.symbol === record.src_send_info.token.symbol
        );
      })?.pegged_deposit_contract_addr ?? "";

    const txHash = await submitFlowRefundRequest(
      depositContractAddress,
      record.src_send_info.token.address,
      wdmsg,
      sigs,
    );

    setLoading(false);
    console.log("txHash", txHash);

    if (txHash.length > 0) {
      const transferJson: TransferHistory = {
        dst_block_tx_link: record.dst_block_tx_link,
        src_send_info: record.src_send_info,
        src_block_tx_link: `${getNetworkById(record.src_send_info.chain.id).blockExplorerUrl}/transaction/${txHash}`,
        srcAddress: address,
        dstAddress: address,
        dst_received_info: record.dst_received_info,
        status: TransferHistoryStatus.TRANSFER_CONFIRMING_YOUR_REFUND,
        transfer_id: record.transfer_id,
        nonce: record.nonce,
        ts: record.ts,
        isLocal: true,
        updateTime: new Date().getTime(),
        txIsFailed: false,
      };
      const localTransferListJsonStr = localStorage.getItem(storageConstants.KEY_TRANSFER_LIST_JSON);
      let localTransferList: TransferHistory[] = [];
      if (localTransferListJsonStr) {
        localTransferList = JSON.parse(localTransferListJsonStr) || [];
      }
      let isHave = false;
      localTransferList.map(item => {
        if (item.transfer_id === record.transfer_id) {
          isHave = true;
          item.updateTime = new Date().getTime();
          item.txIsFailed = false;
          item.src_block_tx_link = `${
            getNetworkById(record.src_send_info.chain.id).blockExplorerUrl
          }/transaction/${txHash}`;
        }
        return item;
      });

      if (!isHave) {
        localTransferList.unshift(transferJson);
      }
      localStorage.setItem(storageConstants.KEY_TRANSFER_LIST_JSON, JSON.stringify(localTransferList));
      setLoading(false);
      setTransfState(TransferHistoryStatus.TRANSFER_REFUNDED);
    }
  };

  const confirmRefund = async () => {
    if (!transactor || !bridge) {
      return;
    }
    let nowWithdrawDetail = withdrawDetail;
    if (!nowWithdrawDetail) {
      const res = await getTransferStatus({
        transfer_id: record.transfer_id,
      });
      setTransferStatusInfo(res);
      const { wd_onchain, sorted_sigs, signers, powers } = res;
      nowWithdrawDetail = {
        _wdmsg: wd_onchain,
        _sigs: sorted_sigs,
        _signers: signers,
        _powers: powers,
      };
    }
    setLoading(true);
    const { _wdmsg, _signers, _sigs, _powers } = nowWithdrawDetail;
    const wdmsg = base64.decode(_wdmsg);
    const signers = _signers.map(item => {
      const decodeSigners = base64.decode(item);
      const hexlifyObj = hexlify(decodeSigners);
      return getAddress(hexlifyObj);
    });
    const sigs = _sigs.map(item => {
      return base64.decode(item);
    });
    const powers = _powers.map(item => {
      const decodeNum = base64.decode(item);
      return BigNumber.from(decodeNum);
    });
    const executor = () => {
      // if (peggedMode === PeggedChainMode.Burn && peggedTokenBridge) {
      //   return transactor(peggedTokenBridge.mint(wdmsg, sigs, signers, powers));
      // } else
      if (peggedMode === PeggedChainMode.Deposit) {
        if (originalTokenVaultV2) {
          return transactor(originalTokenVaultV2.withdraw(wdmsg, sigs, signers, powers));
        } else if (originalTokenVault) {
          return transactor(originalTokenVault.withdraw(wdmsg, sigs, signers, powers));
        }
      }

      if (peggedMode === PeggedChainMode.Off) {
        return transactor(bridge.withdraw(wdmsg, sigs, signers, powers));
      }
    };
    const res = await executor()?.catch(_ => {
      setTransfState(TransferHistoryStatus?.TRANSFER_REFUND_TO_BE_CONFIRMED);
      setLoading(false);
    });
    if (res) {
      const transferJson: TransferHistory = {
        dst_block_tx_link: record.dst_block_tx_link,
        src_send_info: record.src_send_info,
        src_block_tx_link: formatBlockExplorerUrlWithTxHash({
          chainId: record.src_send_info.chain.id,
          txHash: res.hash,
        }),
        srcAddress: address,
        dstAddress: address,
        dst_received_info: record.dst_received_info,
        status: TransferHistoryStatus.TRANSFER_CONFIRMING_YOUR_REFUND,
        transfer_id: record.transfer_id,
        nonce: record.nonce,
        ts: record.ts,
        isLocal: true,
        updateTime: new Date().getTime(),
        txIsFailed: false,
      };
      const localTransferListJsonStr = localStorage.getItem(storageConstants.KEY_TRANSFER_LIST_JSON);
      let localTransferList: TransferHistory[] = [];
      if (localTransferListJsonStr) {
        localTransferList = JSON.parse(localTransferListJsonStr) || [];
      }
      let isHave = false;
      localTransferList.map(item => {
        if (item.transfer_id === record.transfer_id) {
          isHave = true;
          item.updateTime = new Date().getTime();
          item.txIsFailed = false;
          item.src_block_tx_link = formatBlockExplorerUrlWithTxHash({
            chainId: record.src_send_info.chain.id,
            txHash: res.hash,
          });
        }
        return item;
      });

      if (!isHave) {
        localTransferList.unshift(transferJson);
      }
      localStorage.setItem(storageConstants.KEY_TRANSFER_LIST_JSON, JSON.stringify(localTransferList));
      setLoading(false);
      setTransfState(TransferHistoryStatus.TRANSFER_REFUNDED);
    }
  };

  if (srcSendChainNonEVMMode === NonEVMMode.off && record?.src_send_info?.chain.id !== chainId) {
    content = (
      <div>
        <div style={{ textAlign: "center" }}>
          <WarningFilled style={{ fontSize: 50, color: "#ffaa00", marginTop: 40 }} />
        </div>
        <div className={classes.modaldes}>
          Please switch to <div className={classes.yellowText}>{record?.src_send_info?.chain.name} </div> before{" "}
          {transfState === TransferHistoryStatus.TRANSFER_TO_BE_REFUNDED
            ? "requesting a refund."
            : "confirming liquidity removal."}
        </div>
        <Button
          type="primary"
          size="large"
          block
          loading={loading}
          onClick={() => {
            if (!isMobile) {
              switchChain(record?.src_send_info?.chain.id, "", (chainId: number) => {
                const chain = transferConfig.chains.find(chainInfo => {
                  return chainInfo.id === chainId;
                });
                if (chain !== undefined) {
                  dispatch(setFromChain(chain));
                }
              });
            } else {
              onCancel();
            }
          }}
          className={classes.button}
        >
          OK
        </Button>
      </div>
    );
  } else if (
    (srcSendChainNonEVMMode === NonEVMMode.flowTest || srcSendChainNonEVMMode === NonEVMMode.flowMainnet) &&
    !flowConnected
  ) {
    content = (
      <div>
        <div style={{ textAlign: "center" }}>
          <WarningFilled style={{ fontSize: 50, color: "#ffaa00", marginTop: 40 }} />
        </div>
        <div className={classes.modaldes}>
          Please connect <div className={classes.yellowText}>{record?.src_send_info?.chain.name} </div> before{" "}
          {transfState === TransferHistoryStatus.TRANSFER_TO_BE_REFUNDED
            ? "requesting a refund."
            : "confirming liquidity removal."}
        </div>
        <Button
          type="primary"
          size="large"
          block
          loading={loading}
          onClick={() => {
            if (!isMobile) {
              loadNonEVMModal(NonEVMMode.flowTest);
            } else {
              onCancel();
            }
          }}
          className={classes.button}
        >
          OK
        </Button>
      </div>
    );
  } else if (transfState === TransferHistoryStatus.TRANSFER_TO_BE_REFUNDED) {
    content = (
      <>
        <div className={classes.modalTop}>
          <div className={classes.modaldes2}>
            The transfer cannot be completed because{" "}
            {errorMessages[transferStatusInfo?.refund_reason ?? record?.refund_reason] ||
              "the bridge rate has moved unfavorably by your slippage tolerance"}
            . Please click the button below to get a refund.
          </div>
        </div>
        <Button
          type="primary"
          size="large"
          block
          loading={loading}
          onClick={() => {
            requestRefund();
          }}
          className={classes.button}
        >
          Request Refund
        </Button>
      </>
    );
  } else if (transfState === TransferHistoryStatus.TRANSFER_REQUESTING_REFUND) {
    content = (
      <>
        <div className={classes.modalTop}>
          <div className={classes.modalTopIcon}>
            <LoadingOutlined style={{ fontSize: 50, fontWeight: "bold", color: "#3366FF" }} />
          </div>
          <div className={classes.modaldes}>
            Your refund request is waiting for Celer State Guardian Network (SGN) confirmation, which may take a few
            minutes to complete.
          </div>
        </div>
      </>
    );
  } else if (transfState === TransferHistoryStatus.TRANSFER_REFUNDED) {
    content = (
      <>
        <div className={classes.modalTop}>
          <div className={classes.modaldes}>
            Your refund request has been submitted. You should receive your refund on{" "}
            {record?.src_send_info.chain?.name} in a few minutes.
          </div>
        </div>
        <Button
          type="primary"
          size="large"
          block
          loading={loading}
          onClick={() => {
            onCancel();
          }}
          className={classes.button}
        >
          OK
        </Button>
      </>
    );
  } else if (transfState === TransferHistoryStatus.TRANSFER_REFUND_TO_BE_CONFIRMED || isToBeConfirmRefund(record)) {
    content = (
      <>
        <div className={classes.modalTop}>
          <div className={classes.modaldes} style={{ marginTop: 70 }}>
            Click the "Confirm Refund" button to get your refund.
          </div>
        </div>
        <Button
          type="primary"
          size="large"
          block
          loading={loading}
          onClick={() => {
            if (srcSendChainNonEVMMode === NonEVMMode.off) {
              confirmRefund();
            } else if (
              srcSendChainNonEVMMode === NonEVMMode.flowMainnet ||
              srcSendChainNonEVMMode === NonEVMMode.flowTest
            ) {
              confirmFlowRefund();
            }
          }}
          className={classes.button}
        >
          Confirm Refund
        </Button>
      </>
    );
  }

  return (
    <Modal
      className={classes.transferModal}
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={512}
      maskClosable={false}
    >
      {content}
    </Modal>
  );
};

export default HistoryTransferModal;
