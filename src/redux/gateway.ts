import axios from "axios";
import {
  GetTransferConfigsResponse,
  MarkTransferRequest,
  GetTransferStatusRequest,
  GetTransferStatusResponse,
  TransferHistoryRequest,
  TransferHistoryResponse,
  ERC721TokenUriMetadata,
  NFTHistoryRequest,
  NFTHistoryResponse,
} from "../constants/type";

import {
  EstimateWithdrawAmtRequest,
  EstimateWithdrawAmtResponse,
  GetTokenBoundRequest,
  GetTokenBoundResponse,
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

export const estimateWithdrawAmt = (reqParams: EstimateWithdrawAmtRequest): Promise<EstimateWithdrawAmtResponse> => {
  return client.estimateWithdrawAmt(reqParams, null);
};
export const getTokenBound = (reqParams: GetTokenBoundRequest): Promise<GetTokenBoundResponse> => {
  return client.getTokenBound(reqParams, null);
};
export const markTransfer = (params: MarkTransferRequest) => {
  return axios
    .post(`${process.env.REACT_APP_SERVER_URL}/v1/markTransfer`, {
      ...params,
    })
    .then(res => {
      return res.data;
    })
    .catch(e => {
      console.log("error=>", e);
    });
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

// eslint-disable-next-line
export const getNFTBridgeChainList = (): Promise<any> =>
  axios
    .get(`${process.env.REACT_APP_NFT_CONFIG_URL}`)
    .then(res => {
      return res.data;
    })
    .catch(e => {
      console.log("error=>", e);
    });

export const getTokenUriMetaDataJson = (tokenUri: string): Promise<ERC721TokenUriMetadata | undefined> =>
  axios
    .get(tokenUri)
    .then(res => {
      return res.data as ERC721TokenUriMetadata;
    })
    .catch(e => {
      console.log("error=>", e);
      return undefined;
    });

// eslint-disable-next-line
export const getNFTList = (nftAddress: string, chainId: number, userAddress: string): Promise<any> =>
  axios
    .get(`${process.env.REACT_APP_SERVER_URL}/nftbr/own/${userAddress}/${chainId}/${nftAddress}`)
    .then(res => {
      return { addr: nftAddress, data: res.data };
    })
    .catch(e => {
      console.log("error=>", e);
    });

export const nftHistory = (address: string, reqParams: NFTHistoryRequest): Promise<NFTHistoryResponse> =>
  axios
    .get(`${process.env.REACT_APP_SERVER_URL}/nftbr/history/${address}`, {
      // headers: {
      //   "Access-Control-Allow-Origin": "*",
      //   "Content-Type": "application/json",
      // },
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
