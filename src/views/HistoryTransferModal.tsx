import { useEffect, useState } from "react";
import { Modal, Button, message } from "antd";
import { createUseStyles } from "react-jss";
import { ethers } from "ethers";
import { LoadingOutlined, WarningFilled } from "@ant-design/icons";
import { base64, getAddress, hexlify } from "ethers/lib/utils";
import { BigNumber } from "@ethersproject/bignumber";

import { TransferHistoryStatus, WithdrawDetail, TransferHistory } from "../constants/type";
import errorMessages from "../constants/errorMessage";
import { Theme } from "../theme";
import { useContractsContext } from "../providers/ContractsContextProvider";
import { useWeb3Context } from "../providers/Web3ContextProvider";

import { getTransferStatus, withdrawLiquidity } from "../redux/gateway";
import { switchChain } from "../redux/transferSlice";
import { useAppSelector } from "../redux/store";
import { getNetworkById } from "../constants/network";

import {
  WithdrawReq as WithdrawReqProto,
  // WithdrawLq as WithdrawLqProto,
  WithdrawType,
} from "../proto/sgn/cbridge/v1/tx_pb";
import {
  EstimateWithdrawAmtRequest,
  EstimateWithdrawAmtResponse,
  WithdrawInfo,
  WithdrawLiquidityRequest,
  WithdrawMethodType,
  EstimateWithdrawAmt,
} from "../proto/sgn/gateway/v1/gateway_pb";

import { WebClient } from "../proto/sgn/gateway/v1/GatewayServiceClientPb";

/* eslint-disable */
/* eslint-disable camelcase */
/* eslint-disable no-debugger */

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
    fontSize: 18,
    fontWeight: 700,
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
    contracts: { bridge },
    transactor,
  } = useContractsContext();
  const { signer, chainId, address } = useWeb3Context();
  const { windowWidth } = useAppSelector(state => state);
  const { isMobile } = windowWidth;
  const [loading, setLoading] = useState(false);
  const [transfState, setTransfState] = useState(record?.status);
  const [withdrawDetail, setWithdrawDetail] = useState<WithdrawDetail>();
  const [transferStatusInfo, setTransferStatusInfo] = useState<any>();

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
      // const resList = res.getReqAmtMap();
      // const data = resList.get(Number(record?.src_send_info.chain.id));
      // const totleFee = (Number(data?.getBaseFee()) + Number(data?.getPercFee())).toString() || "0";
      // const eqValueTokenAmtBigNum = BigNumber.from(data?.getEqValueTokenAmt());
      // const feeBigNum = BigNumber.from(totleFee);
      // const targetReceiveAmounts = eqValueTokenAmtBigNum.sub(feeBigNum);
      // return targetReceiveAmounts.toString();
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
    if (!bridge || !signer) {
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
      let sig;
      try {
        sig = await signer.signMessage(
          ethers.utils.arrayify(ethers.utils.keccak256(withdrawReqProto.serializeBinary())),
        );
        if (sig) {
          setTransfState(TransferHistoryStatus?.TRANSFER_REQUESTING_REFUND);
        }
      } catch (error) {
        setLoading(false);
        return;
      }

      const bytes = ethers.utils.arrayify(sig);
      const req = new WithdrawLiquidityRequest();
      req.setWithdrawReq(withdrawReqProto.serializeBinary());
      req.setSig(bytes);
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
    // const withdrawRes = await transactor(bridge.withdraw(wdmsg, sigs, signers, powers));

    const res = await transactor(bridge.withdraw(wdmsg, sigs, signers, powers)).catch(() => {
      // onHandleCancel();
      setTransfState(TransferHistoryStatus?.TRANSFER_REFUND_TO_BE_CONFIRMED);
      setLoading(false);
    });

    if (res) {
      // await markTransfer({
      //   transfer_id: record.transfer_id,
      //   src_tx_hash: res.hash,
      //   type: MarkTransferTypeRequest.TRANSFER_TYPE_REFUND,
      // });

      const transferJson = {
        dst_block_tx_link: record.dst_block_tx_link,
        src_send_info: record.src_send_info,
        src_block_tx_link: `${getNetworkById(record.src_send_info.chain.id).blockExplorerUrl}/tx/${res.hash}`,
        dst_received_info: record.dst_received_info,
        status: TransferHistoryStatus.TRANSFER_CONFIRMING_YOUR_REFUND,
        transfer_id: record.transfer_id,
        nonce: record.nonce,
        ts: record.ts,
        isLocal: true,
        updateTime: new Date().getTime(),
        txIsFailed: false,
      };
      const localTransferListJsonStr = localStorage.getItem("transferListJson");
      let localTransferList: TransferHistory[] = [];
      if (localTransferListJsonStr) {
        localTransferList = JSON.parse(localTransferListJsonStr)[address] || [];
      }
      let isHave = false;
      localTransferList.map(item => {
        if (item.transfer_id === record.transfer_id) {
          isHave = true;
          item.updateTime = new Date().getTime();
          item.txIsFailed = false;
          item.src_block_tx_link = `${getNetworkById(record.src_send_info.chain.id).blockExplorerUrl}/tx/${res.hash}`;
        }
        return item;
      });

      if (!isHave) {
        localTransferList.unshift(transferJson);
      }
      const newJson = { [address]: localTransferList };
      localStorage.setItem("transferListJson", JSON.stringify(newJson));
      setLoading(false);
      setTransfState(TransferHistoryStatus.TRANSFER_REFUNDED);
    }

    // const params = {
    //   transfer_id: record.transfer_id,
    // };
    // detailInter = setInterval(async () => {
    //   const res = await getTransferStatus(params);
    //   setTransferStatusInfo(res);
    //   if (res?.status) {
    //     const status = res.status;
    //     if (status === TransferHistoryStatus.TRANSFER_REFUNDED) {
    //       clearInterval(detailInter);
    //       setLoading(false);
    //       setTransfState(status);
    //     }
    //   } else {
    //     setLoading(false);
    //     clearInterval(detailInter);
    //   }
    // }, 5000);
  };

  if (record?.src_send_info?.chain.id !== chainId) {
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
              switchChain(record?.src_send_info?.chain.id, "");
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
  } else if (transfState === TransferHistoryStatus.TRANSFER_REFUND_TO_BE_CONFIRMED) {
    content = (
      <>
        <div className={classes.modalTop}>
          <div className={classes.modaldes} style={{ marginTop: 70 }}>
            Click the “Confirm Refund” button to get your refund.
          </div>
        </div>
        <Button
          type="primary"
          size="large"
          block
          loading={loading}
          onClick={() => {
            confirmRefund();
          }}
          className={classes.button}
        >
          Confirm Refund
        </Button>
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
