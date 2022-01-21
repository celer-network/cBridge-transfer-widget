import axios from "axios";
import {
  GetTransferConfigsResponse,
  GetTransferStatusRequest,
  GetTransferStatusResponse,
  TransferHistoryRequest,
  TransferHistoryResponse,
} from "../constants/type";

import {
  EstimateWithdrawAmtRequest,
  EstimateWithdrawAmtResponse,
  WithdrawLiquidityRequest,
  WithdrawLiquidityResponse,
} from "../proto/gateway/gateway_pb";
import { WebClient } from "../proto/gateway/GatewayServiceClientPb";

/* eslint-disable camelcase */
const preFix = { pathPrefix: process.env.REACT_APP_SERVER_URL }; // 域名
console.log("preFix", preFix);
const client = new WebClient(`${process.env.REACT_APP_GRPC_SERVER_URL}`, null, null);
export const getTransferConfigs = (): Promise<GetTransferConfigsResponse> =>
  axios
    .get(`${process.env.REACT_APP_SERVER_URL}/v1/getTransferConfigsForAll`)
    .then(res => {
      return res.data;
    })
    .catch(e => {
      console.log("error=>", e);
    });

// export const estimateAmt = (reqParams: EstimateAmtRequest): Promise<EstimateAmtResponse> => {
//   return Web.EstimateAmt(reqParams, preFix);
// };

export const estimateWithdrawAmt = (reqParams: EstimateWithdrawAmtRequest): Promise<EstimateWithdrawAmtResponse> => {
  return client.estimateWithdrawAmt(reqParams, null);
};

export const getTransferStatus = (params: GetTransferStatusRequest): Promise<GetTransferStatusResponse> => {
  return axios
    .post(`${process.env.REACT_APP_SERVER_URL}/v1/getTransferStatus`, {
      ...params,
    })
    .then(res => {
      return res.data;
    })
    .catch(e => {
      console.log("error=>", e);
    });
};

export const withdrawLiquidity = (reqParams: WithdrawLiquidityRequest): Promise<WithdrawLiquidityResponse> => {
  return client.withdrawLiquidity(reqParams, null);
};

export const transferHistory = (reqParams: TransferHistoryRequest): Promise<TransferHistoryResponse> =>
  axios
    .get(`${process.env.REACT_APP_SERVER_URL}/v1/transferHistory`, {
      params: {
        ...reqParams,
      },
    })
    .then(res => {
      return res.data;
    })
    .catch(e => {
      console.log("error=>", e);
    });

export const checkTransferHistory = (reqParams: TransferHistoryRequest): Promise<TransferHistoryResponse> =>
  axios
    .get(`${process.env.REACT_APP_SERVER_URL_CHECK}/v1/transferHistory`, {
      params: {
        ...reqParams,
      },
    })
    .then(res => {
      return res.data;
    })
    .catch(e => {
      console.log("error=>", e);
    });
