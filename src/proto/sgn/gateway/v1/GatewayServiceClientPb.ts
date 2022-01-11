/**
 * @fileoverview gRPC-Web generated client stub for sgn.gateway.v1
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as sgn_gateway_v1_gateway_pb from '../../../sgn/gateway/v1/gateway_pb';


export class WebClient {
  client_: grpcWeb.AbstractClientBase;
  hostname_: string;
  credentials_: null | { [index: string]: string; };
  options_: null | { [index: string]: any; };

  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; }) {
    if (!options) options = {};
    if (!credentials) credentials = {};
    options['format'] = 'binary';

    this.client_ = new grpcWeb.GrpcWebClientBase(options);
    this.hostname_ = hostname;
    this.credentials_ = credentials;
    this.options_ = options;
  }

  methodInfoGetTransferConfigs = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/GetTransferConfigs',
    grpcWeb.MethodType.UNARY,
    sgn_gateway_v1_gateway_pb.GetTransferConfigsRequest,
    sgn_gateway_v1_gateway_pb.GetTransferConfigsResponse,
    (request: sgn_gateway_v1_gateway_pb.GetTransferConfigsRequest) => {
      return request.serializeBinary();
    },
    sgn_gateway_v1_gateway_pb.GetTransferConfigsResponse.deserializeBinary
  );

  getTransferConfigs(
    request: sgn_gateway_v1_gateway_pb.GetTransferConfigsRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_gateway_v1_gateway_pb.GetTransferConfigsResponse>;

  getTransferConfigs(
    request: sgn_gateway_v1_gateway_pb.GetTransferConfigsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_gateway_v1_gateway_pb.GetTransferConfigsResponse) => void): grpcWeb.ClientReadableStream<sgn_gateway_v1_gateway_pb.GetTransferConfigsResponse>;

  getTransferConfigs(
    request: sgn_gateway_v1_gateway_pb.GetTransferConfigsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_gateway_v1_gateway_pb.GetTransferConfigsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/GetTransferConfigs',
        request,
        metadata || {},
        this.methodInfoGetTransferConfigs,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/GetTransferConfigs',
    request,
    metadata || {},
    this.methodInfoGetTransferConfigs);
  }

  methodInfoGetTransferConfigsForAll = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/GetTransferConfigsForAll',
    grpcWeb.MethodType.UNARY,
    sgn_gateway_v1_gateway_pb.GetTransferConfigsRequest,
    sgn_gateway_v1_gateway_pb.GetTransferConfigsResponse,
    (request: sgn_gateway_v1_gateway_pb.GetTransferConfigsRequest) => {
      return request.serializeBinary();
    },
    sgn_gateway_v1_gateway_pb.GetTransferConfigsResponse.deserializeBinary
  );

  getTransferConfigsForAll(
    request: sgn_gateway_v1_gateway_pb.GetTransferConfigsRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_gateway_v1_gateway_pb.GetTransferConfigsResponse>;

  getTransferConfigsForAll(
    request: sgn_gateway_v1_gateway_pb.GetTransferConfigsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_gateway_v1_gateway_pb.GetTransferConfigsResponse) => void): grpcWeb.ClientReadableStream<sgn_gateway_v1_gateway_pb.GetTransferConfigsResponse>;

  getTransferConfigsForAll(
    request: sgn_gateway_v1_gateway_pb.GetTransferConfigsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_gateway_v1_gateway_pb.GetTransferConfigsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/GetTransferConfigsForAll',
        request,
        metadata || {},
        this.methodInfoGetTransferConfigsForAll,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/GetTransferConfigsForAll',
    request,
    metadata || {},
    this.methodInfoGetTransferConfigsForAll);
  }

  methodInfoGetTokenInfo = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/GetTokenInfo',
    grpcWeb.MethodType.UNARY,
    sgn_gateway_v1_gateway_pb.GetTokenInfoRequest,
    sgn_gateway_v1_gateway_pb.GetTokenInfoResponse,
    (request: sgn_gateway_v1_gateway_pb.GetTokenInfoRequest) => {
      return request.serializeBinary();
    },
    sgn_gateway_v1_gateway_pb.GetTokenInfoResponse.deserializeBinary
  );

  getTokenInfo(
    request: sgn_gateway_v1_gateway_pb.GetTokenInfoRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_gateway_v1_gateway_pb.GetTokenInfoResponse>;

  getTokenInfo(
    request: sgn_gateway_v1_gateway_pb.GetTokenInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_gateway_v1_gateway_pb.GetTokenInfoResponse) => void): grpcWeb.ClientReadableStream<sgn_gateway_v1_gateway_pb.GetTokenInfoResponse>;

  getTokenInfo(
    request: sgn_gateway_v1_gateway_pb.GetTokenInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_gateway_v1_gateway_pb.GetTokenInfoResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/GetTokenInfo',
        request,
        metadata || {},
        this.methodInfoGetTokenInfo,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/GetTokenInfo',
    request,
    metadata || {},
    this.methodInfoGetTokenInfo);
  }

  methodInfoEstimateAmt = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/EstimateAmt',
    grpcWeb.MethodType.UNARY,
    sgn_gateway_v1_gateway_pb.EstimateAmtRequest,
    sgn_gateway_v1_gateway_pb.EstimateAmtResponse,
    (request: sgn_gateway_v1_gateway_pb.EstimateAmtRequest) => {
      return request.serializeBinary();
    },
    sgn_gateway_v1_gateway_pb.EstimateAmtResponse.deserializeBinary
  );

  estimateAmt(
    request: sgn_gateway_v1_gateway_pb.EstimateAmtRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_gateway_v1_gateway_pb.EstimateAmtResponse>;

  estimateAmt(
    request: sgn_gateway_v1_gateway_pb.EstimateAmtRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_gateway_v1_gateway_pb.EstimateAmtResponse) => void): grpcWeb.ClientReadableStream<sgn_gateway_v1_gateway_pb.EstimateAmtResponse>;

  estimateAmt(
    request: sgn_gateway_v1_gateway_pb.EstimateAmtRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_gateway_v1_gateway_pb.EstimateAmtResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/EstimateAmt',
        request,
        metadata || {},
        this.methodInfoEstimateAmt,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/EstimateAmt',
    request,
    metadata || {},
    this.methodInfoEstimateAmt);
  }

  methodInfoGetTransferStatus = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/GetTransferStatus',
    grpcWeb.MethodType.UNARY,
    sgn_gateway_v1_gateway_pb.GetTransferStatusRequest,
    sgn_gateway_v1_gateway_pb.GetTransferStatusResponse,
    (request: sgn_gateway_v1_gateway_pb.GetTransferStatusRequest) => {
      return request.serializeBinary();
    },
    sgn_gateway_v1_gateway_pb.GetTransferStatusResponse.deserializeBinary
  );

  getTransferStatus(
    request: sgn_gateway_v1_gateway_pb.GetTransferStatusRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_gateway_v1_gateway_pb.GetTransferStatusResponse>;

  getTransferStatus(
    request: sgn_gateway_v1_gateway_pb.GetTransferStatusRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_gateway_v1_gateway_pb.GetTransferStatusResponse) => void): grpcWeb.ClientReadableStream<sgn_gateway_v1_gateway_pb.GetTransferStatusResponse>;

  getTransferStatus(
    request: sgn_gateway_v1_gateway_pb.GetTransferStatusRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_gateway_v1_gateway_pb.GetTransferStatusResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/GetTransferStatus',
        request,
        metadata || {},
        this.methodInfoGetTransferStatus,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/GetTransferStatus',
    request,
    metadata || {},
    this.methodInfoGetTransferStatus);
  }

  methodInfoGetLPInfoList = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/GetLPInfoList',
    grpcWeb.MethodType.UNARY,
    sgn_gateway_v1_gateway_pb.GetLPInfoListRequest,
    sgn_gateway_v1_gateway_pb.GetLPInfoListResponse,
    (request: sgn_gateway_v1_gateway_pb.GetLPInfoListRequest) => {
      return request.serializeBinary();
    },
    sgn_gateway_v1_gateway_pb.GetLPInfoListResponse.deserializeBinary
  );

  getLPInfoList(
    request: sgn_gateway_v1_gateway_pb.GetLPInfoListRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_gateway_v1_gateway_pb.GetLPInfoListResponse>;

  getLPInfoList(
    request: sgn_gateway_v1_gateway_pb.GetLPInfoListRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_gateway_v1_gateway_pb.GetLPInfoListResponse) => void): grpcWeb.ClientReadableStream<sgn_gateway_v1_gateway_pb.GetLPInfoListResponse>;

  getLPInfoList(
    request: sgn_gateway_v1_gateway_pb.GetLPInfoListRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_gateway_v1_gateway_pb.GetLPInfoListResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/GetLPInfoList',
        request,
        metadata || {},
        this.methodInfoGetLPInfoList,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/GetLPInfoList',
    request,
    metadata || {},
    this.methodInfoGetLPInfoList);
  }

  methodInfoWithdrawLiquidity = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/WithdrawLiquidity',
    grpcWeb.MethodType.UNARY,
    sgn_gateway_v1_gateway_pb.WithdrawLiquidityRequest,
    sgn_gateway_v1_gateway_pb.WithdrawLiquidityResponse,
    (request: sgn_gateway_v1_gateway_pb.WithdrawLiquidityRequest) => {
      return request.serializeBinary();
    },
    sgn_gateway_v1_gateway_pb.WithdrawLiquidityResponse.deserializeBinary
  );

  withdrawLiquidity(
    request: sgn_gateway_v1_gateway_pb.WithdrawLiquidityRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_gateway_v1_gateway_pb.WithdrawLiquidityResponse>;

  withdrawLiquidity(
    request: sgn_gateway_v1_gateway_pb.WithdrawLiquidityRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_gateway_v1_gateway_pb.WithdrawLiquidityResponse) => void): grpcWeb.ClientReadableStream<sgn_gateway_v1_gateway_pb.WithdrawLiquidityResponse>;

  withdrawLiquidity(
    request: sgn_gateway_v1_gateway_pb.WithdrawLiquidityRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_gateway_v1_gateway_pb.WithdrawLiquidityResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/WithdrawLiquidity',
        request,
        metadata || {},
        this.methodInfoWithdrawLiquidity,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/WithdrawLiquidity',
    request,
    metadata || {},
    this.methodInfoWithdrawLiquidity);
  }

  methodInfoEstimateWithdrawAmt = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/EstimateWithdrawAmt',
    grpcWeb.MethodType.UNARY,
    sgn_gateway_v1_gateway_pb.EstimateWithdrawAmtRequest,
    sgn_gateway_v1_gateway_pb.EstimateWithdrawAmtResponse,
    (request: sgn_gateway_v1_gateway_pb.EstimateWithdrawAmtRequest) => {
      return request.serializeBinary();
    },
    sgn_gateway_v1_gateway_pb.EstimateWithdrawAmtResponse.deserializeBinary
  );

  estimateWithdrawAmt(
    request: sgn_gateway_v1_gateway_pb.EstimateWithdrawAmtRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_gateway_v1_gateway_pb.EstimateWithdrawAmtResponse>;

  estimateWithdrawAmt(
    request: sgn_gateway_v1_gateway_pb.EstimateWithdrawAmtRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_gateway_v1_gateway_pb.EstimateWithdrawAmtResponse) => void): grpcWeb.ClientReadableStream<sgn_gateway_v1_gateway_pb.EstimateWithdrawAmtResponse>;

  estimateWithdrawAmt(
    request: sgn_gateway_v1_gateway_pb.EstimateWithdrawAmtRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_gateway_v1_gateway_pb.EstimateWithdrawAmtResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/EstimateWithdrawAmt',
        request,
        metadata || {},
        this.methodInfoEstimateWithdrawAmt,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/EstimateWithdrawAmt',
    request,
    metadata || {},
    this.methodInfoEstimateWithdrawAmt);
  }

  methodInfoQueryLiquidityStatus = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/QueryLiquidityStatus',
    grpcWeb.MethodType.UNARY,
    sgn_gateway_v1_gateway_pb.QueryLiquidityStatusRequest,
    sgn_gateway_v1_gateway_pb.QueryLiquidityStatusResponse,
    (request: sgn_gateway_v1_gateway_pb.QueryLiquidityStatusRequest) => {
      return request.serializeBinary();
    },
    sgn_gateway_v1_gateway_pb.QueryLiquidityStatusResponse.deserializeBinary
  );

  queryLiquidityStatus(
    request: sgn_gateway_v1_gateway_pb.QueryLiquidityStatusRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_gateway_v1_gateway_pb.QueryLiquidityStatusResponse>;

  queryLiquidityStatus(
    request: sgn_gateway_v1_gateway_pb.QueryLiquidityStatusRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_gateway_v1_gateway_pb.QueryLiquidityStatusResponse) => void): grpcWeb.ClientReadableStream<sgn_gateway_v1_gateway_pb.QueryLiquidityStatusResponse>;

  queryLiquidityStatus(
    request: sgn_gateway_v1_gateway_pb.QueryLiquidityStatusRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_gateway_v1_gateway_pb.QueryLiquidityStatusResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/QueryLiquidityStatus',
        request,
        metadata || {},
        this.methodInfoQueryLiquidityStatus,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/QueryLiquidityStatus',
    request,
    metadata || {},
    this.methodInfoQueryLiquidityStatus);
  }

  methodInfoUnlockFarmingReward = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/UnlockFarmingReward',
    grpcWeb.MethodType.UNARY,
    sgn_gateway_v1_gateway_pb.UnlockFarmingRewardRequest,
    sgn_gateway_v1_gateway_pb.UnlockFarmingRewardResponse,
    (request: sgn_gateway_v1_gateway_pb.UnlockFarmingRewardRequest) => {
      return request.serializeBinary();
    },
    sgn_gateway_v1_gateway_pb.UnlockFarmingRewardResponse.deserializeBinary
  );

  unlockFarmingReward(
    request: sgn_gateway_v1_gateway_pb.UnlockFarmingRewardRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_gateway_v1_gateway_pb.UnlockFarmingRewardResponse>;

  unlockFarmingReward(
    request: sgn_gateway_v1_gateway_pb.UnlockFarmingRewardRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_gateway_v1_gateway_pb.UnlockFarmingRewardResponse) => void): grpcWeb.ClientReadableStream<sgn_gateway_v1_gateway_pb.UnlockFarmingRewardResponse>;

  unlockFarmingReward(
    request: sgn_gateway_v1_gateway_pb.UnlockFarmingRewardRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_gateway_v1_gateway_pb.UnlockFarmingRewardResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/UnlockFarmingReward',
        request,
        metadata || {},
        this.methodInfoUnlockFarmingReward,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/UnlockFarmingReward',
    request,
    metadata || {},
    this.methodInfoUnlockFarmingReward);
  }

  methodInfoGetFarmingRewardDetails = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/GetFarmingRewardDetails',
    grpcWeb.MethodType.UNARY,
    sgn_gateway_v1_gateway_pb.GetFarmingRewardDetailsRequest,
    sgn_gateway_v1_gateway_pb.GetFarmingRewardDetailsResponse,
    (request: sgn_gateway_v1_gateway_pb.GetFarmingRewardDetailsRequest) => {
      return request.serializeBinary();
    },
    sgn_gateway_v1_gateway_pb.GetFarmingRewardDetailsResponse.deserializeBinary
  );

  getFarmingRewardDetails(
    request: sgn_gateway_v1_gateway_pb.GetFarmingRewardDetailsRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_gateway_v1_gateway_pb.GetFarmingRewardDetailsResponse>;

  getFarmingRewardDetails(
    request: sgn_gateway_v1_gateway_pb.GetFarmingRewardDetailsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_gateway_v1_gateway_pb.GetFarmingRewardDetailsResponse) => void): grpcWeb.ClientReadableStream<sgn_gateway_v1_gateway_pb.GetFarmingRewardDetailsResponse>;

  getFarmingRewardDetails(
    request: sgn_gateway_v1_gateway_pb.GetFarmingRewardDetailsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_gateway_v1_gateway_pb.GetFarmingRewardDetailsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/GetFarmingRewardDetails',
        request,
        metadata || {},
        this.methodInfoGetFarmingRewardDetails,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/GetFarmingRewardDetails',
    request,
    metadata || {},
    this.methodInfoGetFarmingRewardDetails);
  }

  methodInfoTransferHistory = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/TransferHistory',
    grpcWeb.MethodType.UNARY,
    sgn_gateway_v1_gateway_pb.TransferHistoryRequest,
    sgn_gateway_v1_gateway_pb.TransferHistoryResponse,
    (request: sgn_gateway_v1_gateway_pb.TransferHistoryRequest) => {
      return request.serializeBinary();
    },
    sgn_gateway_v1_gateway_pb.TransferHistoryResponse.deserializeBinary
  );

  transferHistory(
    request: sgn_gateway_v1_gateway_pb.TransferHistoryRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_gateway_v1_gateway_pb.TransferHistoryResponse>;

  transferHistory(
    request: sgn_gateway_v1_gateway_pb.TransferHistoryRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_gateway_v1_gateway_pb.TransferHistoryResponse) => void): grpcWeb.ClientReadableStream<sgn_gateway_v1_gateway_pb.TransferHistoryResponse>;

  transferHistory(
    request: sgn_gateway_v1_gateway_pb.TransferHistoryRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_gateway_v1_gateway_pb.TransferHistoryResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/TransferHistory',
        request,
        metadata || {},
        this.methodInfoTransferHistory,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/TransferHistory',
    request,
    metadata || {},
    this.methodInfoTransferHistory);
  }

  methodInfoLPHistory = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/LPHistory',
    grpcWeb.MethodType.UNARY,
    sgn_gateway_v1_gateway_pb.LPHistoryRequest,
    sgn_gateway_v1_gateway_pb.LPHistoryResponse,
    (request: sgn_gateway_v1_gateway_pb.LPHistoryRequest) => {
      return request.serializeBinary();
    },
    sgn_gateway_v1_gateway_pb.LPHistoryResponse.deserializeBinary
  );

  lPHistory(
    request: sgn_gateway_v1_gateway_pb.LPHistoryRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_gateway_v1_gateway_pb.LPHistoryResponse>;

  lPHistory(
    request: sgn_gateway_v1_gateway_pb.LPHistoryRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_gateway_v1_gateway_pb.LPHistoryResponse) => void): grpcWeb.ClientReadableStream<sgn_gateway_v1_gateway_pb.LPHistoryResponse>;

  lPHistory(
    request: sgn_gateway_v1_gateway_pb.LPHistoryRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_gateway_v1_gateway_pb.LPHistoryResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/LPHistory',
        request,
        metadata || {},
        this.methodInfoLPHistory,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/LPHistory',
    request,
    metadata || {},
    this.methodInfoLPHistory);
  }

  methodInfoRewardingData = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/RewardingData',
    grpcWeb.MethodType.UNARY,
    sgn_gateway_v1_gateway_pb.RewardingDataRequest,
    sgn_gateway_v1_gateway_pb.RewardingDataResponse,
    (request: sgn_gateway_v1_gateway_pb.RewardingDataRequest) => {
      return request.serializeBinary();
    },
    sgn_gateway_v1_gateway_pb.RewardingDataResponse.deserializeBinary
  );

  rewardingData(
    request: sgn_gateway_v1_gateway_pb.RewardingDataRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_gateway_v1_gateway_pb.RewardingDataResponse>;

  rewardingData(
    request: sgn_gateway_v1_gateway_pb.RewardingDataRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_gateway_v1_gateway_pb.RewardingDataResponse) => void): grpcWeb.ClientReadableStream<sgn_gateway_v1_gateway_pb.RewardingDataResponse>;

  rewardingData(
    request: sgn_gateway_v1_gateway_pb.RewardingDataRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_gateway_v1_gateway_pb.RewardingDataResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/RewardingData',
        request,
        metadata || {},
        this.methodInfoRewardingData,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/RewardingData',
    request,
    metadata || {},
    this.methodInfoRewardingData);
  }

  methodInfoStakingConfig = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/StakingConfig',
    grpcWeb.MethodType.UNARY,
    sgn_gateway_v1_gateway_pb.StakingConfigRequest,
    sgn_gateway_v1_gateway_pb.StakingConfigResponse,
    (request: sgn_gateway_v1_gateway_pb.StakingConfigRequest) => {
      return request.serializeBinary();
    },
    sgn_gateway_v1_gateway_pb.StakingConfigResponse.deserializeBinary
  );

  stakingConfig(
    request: sgn_gateway_v1_gateway_pb.StakingConfigRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_gateway_v1_gateway_pb.StakingConfigResponse>;

  stakingConfig(
    request: sgn_gateway_v1_gateway_pb.StakingConfigRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_gateway_v1_gateway_pb.StakingConfigResponse) => void): grpcWeb.ClientReadableStream<sgn_gateway_v1_gateway_pb.StakingConfigResponse>;

  stakingConfig(
    request: sgn_gateway_v1_gateway_pb.StakingConfigRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_gateway_v1_gateway_pb.StakingConfigResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/StakingConfig',
        request,
        metadata || {},
        this.methodInfoStakingConfig,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/StakingConfig',
    request,
    metadata || {},
    this.methodInfoStakingConfig);
  }

  methodInfoUnlockStakingReward = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/UnlockStakingReward',
    grpcWeb.MethodType.UNARY,
    sgn_gateway_v1_gateway_pb.UnlockStakingRewardRequest,
    sgn_gateway_v1_gateway_pb.UnlockStakingRewardResponse,
    (request: sgn_gateway_v1_gateway_pb.UnlockStakingRewardRequest) => {
      return request.serializeBinary();
    },
    sgn_gateway_v1_gateway_pb.UnlockStakingRewardResponse.deserializeBinary
  );

  unlockStakingReward(
    request: sgn_gateway_v1_gateway_pb.UnlockStakingRewardRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_gateway_v1_gateway_pb.UnlockStakingRewardResponse>;

  unlockStakingReward(
    request: sgn_gateway_v1_gateway_pb.UnlockStakingRewardRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_gateway_v1_gateway_pb.UnlockStakingRewardResponse) => void): grpcWeb.ClientReadableStream<sgn_gateway_v1_gateway_pb.UnlockStakingRewardResponse>;

  unlockStakingReward(
    request: sgn_gateway_v1_gateway_pb.UnlockStakingRewardRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_gateway_v1_gateway_pb.UnlockStakingRewardResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/UnlockStakingReward',
        request,
        metadata || {},
        this.methodInfoUnlockStakingReward,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/UnlockStakingReward',
    request,
    metadata || {},
    this.methodInfoUnlockStakingReward);
  }

  methodInfoGetStakingRewardDetails = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/GetStakingRewardDetails',
    grpcWeb.MethodType.UNARY,
    sgn_gateway_v1_gateway_pb.GetStakingRewardDetailsRequest,
    sgn_gateway_v1_gateway_pb.GetStakingRewardDetailsResponse,
    (request: sgn_gateway_v1_gateway_pb.GetStakingRewardDetailsRequest) => {
      return request.serializeBinary();
    },
    sgn_gateway_v1_gateway_pb.GetStakingRewardDetailsResponse.deserializeBinary
  );

  getStakingRewardDetails(
    request: sgn_gateway_v1_gateway_pb.GetStakingRewardDetailsRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_gateway_v1_gateway_pb.GetStakingRewardDetailsResponse>;

  getStakingRewardDetails(
    request: sgn_gateway_v1_gateway_pb.GetStakingRewardDetailsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_gateway_v1_gateway_pb.GetStakingRewardDetailsResponse) => void): grpcWeb.ClientReadableStream<sgn_gateway_v1_gateway_pb.GetStakingRewardDetailsResponse>;

  getStakingRewardDetails(
    request: sgn_gateway_v1_gateway_pb.GetStakingRewardDetailsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_gateway_v1_gateway_pb.GetStakingRewardDetailsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/GetStakingRewardDetails',
        request,
        metadata || {},
        this.methodInfoGetStakingRewardDetails,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/GetStakingRewardDetails',
    request,
    metadata || {},
    this.methodInfoGetStakingRewardDetails);
  }

  methodInfoGetTotalLiquidityProviderTokenBalance = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/GetTotalLiquidityProviderTokenBalance',
    grpcWeb.MethodType.UNARY,
    sgn_gateway_v1_gateway_pb.GetTotalLiquidityProviderTokenBalanceRequest,
    sgn_gateway_v1_gateway_pb.GetTotalLiquidityProviderTokenBalanceResponse,
    (request: sgn_gateway_v1_gateway_pb.GetTotalLiquidityProviderTokenBalanceRequest) => {
      return request.serializeBinary();
    },
    sgn_gateway_v1_gateway_pb.GetTotalLiquidityProviderTokenBalanceResponse.deserializeBinary
  );

  getTotalLiquidityProviderTokenBalance(
    request: sgn_gateway_v1_gateway_pb.GetTotalLiquidityProviderTokenBalanceRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_gateway_v1_gateway_pb.GetTotalLiquidityProviderTokenBalanceResponse>;

  getTotalLiquidityProviderTokenBalance(
    request: sgn_gateway_v1_gateway_pb.GetTotalLiquidityProviderTokenBalanceRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_gateway_v1_gateway_pb.GetTotalLiquidityProviderTokenBalanceResponse) => void): grpcWeb.ClientReadableStream<sgn_gateway_v1_gateway_pb.GetTotalLiquidityProviderTokenBalanceResponse>;

  getTotalLiquidityProviderTokenBalance(
    request: sgn_gateway_v1_gateway_pb.GetTotalLiquidityProviderTokenBalanceRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_gateway_v1_gateway_pb.GetTotalLiquidityProviderTokenBalanceResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/GetTotalLiquidityProviderTokenBalance',
        request,
        metadata || {},
        this.methodInfoGetTotalLiquidityProviderTokenBalance,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/GetTotalLiquidityProviderTokenBalance',
    request,
    metadata || {},
    this.methodInfoGetTotalLiquidityProviderTokenBalance);
  }

  methodInfoUpdateChain = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/UpdateChain',
    grpcWeb.MethodType.UNARY,
    sgn_gateway_v1_gateway_pb.UpdateChainRequest,
    sgn_gateway_v1_gateway_pb.UpdateChainResponse,
    (request: sgn_gateway_v1_gateway_pb.UpdateChainRequest) => {
      return request.serializeBinary();
    },
    sgn_gateway_v1_gateway_pb.UpdateChainResponse.deserializeBinary
  );

  updateChain(
    request: sgn_gateway_v1_gateway_pb.UpdateChainRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_gateway_v1_gateway_pb.UpdateChainResponse>;

  updateChain(
    request: sgn_gateway_v1_gateway_pb.UpdateChainRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_gateway_v1_gateway_pb.UpdateChainResponse) => void): grpcWeb.ClientReadableStream<sgn_gateway_v1_gateway_pb.UpdateChainResponse>;

  updateChain(
    request: sgn_gateway_v1_gateway_pb.UpdateChainRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_gateway_v1_gateway_pb.UpdateChainResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/UpdateChain',
        request,
        metadata || {},
        this.methodInfoUpdateChain,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/UpdateChain',
    request,
    metadata || {},
    this.methodInfoUpdateChain);
  }

  methodInfoUpdateToken = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/UpdateToken',
    grpcWeb.MethodType.UNARY,
    sgn_gateway_v1_gateway_pb.UpdateTokenRequest,
    sgn_gateway_v1_gateway_pb.UpdateTokenResponse,
    (request: sgn_gateway_v1_gateway_pb.UpdateTokenRequest) => {
      return request.serializeBinary();
    },
    sgn_gateway_v1_gateway_pb.UpdateTokenResponse.deserializeBinary
  );

  updateToken(
    request: sgn_gateway_v1_gateway_pb.UpdateTokenRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_gateway_v1_gateway_pb.UpdateTokenResponse>;

  updateToken(
    request: sgn_gateway_v1_gateway_pb.UpdateTokenRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_gateway_v1_gateway_pb.UpdateTokenResponse) => void): grpcWeb.ClientReadableStream<sgn_gateway_v1_gateway_pb.UpdateTokenResponse>;

  updateToken(
    request: sgn_gateway_v1_gateway_pb.UpdateTokenRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_gateway_v1_gateway_pb.UpdateTokenResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/UpdateToken',
        request,
        metadata || {},
        this.methodInfoUpdateToken,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/UpdateToken',
    request,
    metadata || {},
    this.methodInfoUpdateToken);
  }

  methodInfoGetCampaignScores = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/GetCampaignScores',
    grpcWeb.MethodType.UNARY,
    sgn_gateway_v1_gateway_pb.GetCampaignScoresRequest,
    sgn_gateway_v1_gateway_pb.GetCampaignScoresResponse,
    (request: sgn_gateway_v1_gateway_pb.GetCampaignScoresRequest) => {
      return request.serializeBinary();
    },
    sgn_gateway_v1_gateway_pb.GetCampaignScoresResponse.deserializeBinary
  );

  getCampaignScores(
    request: sgn_gateway_v1_gateway_pb.GetCampaignScoresRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_gateway_v1_gateway_pb.GetCampaignScoresResponse>;

  getCampaignScores(
    request: sgn_gateway_v1_gateway_pb.GetCampaignScoresRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_gateway_v1_gateway_pb.GetCampaignScoresResponse) => void): grpcWeb.ClientReadableStream<sgn_gateway_v1_gateway_pb.GetCampaignScoresResponse>;

  getCampaignScores(
    request: sgn_gateway_v1_gateway_pb.GetCampaignScoresRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_gateway_v1_gateway_pb.GetCampaignScoresResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/GetCampaignScores',
        request,
        metadata || {},
        this.methodInfoGetCampaignScores,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/GetCampaignScores',
    request,
    metadata || {},
    this.methodInfoGetCampaignScores);
  }

  methodInfoGetInfoByTxHash = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/GetInfoByTxHash',
    grpcWeb.MethodType.UNARY,
    sgn_gateway_v1_gateway_pb.GetInfoByTxHashRequest,
    sgn_gateway_v1_gateway_pb.GetInfoByTxHashResponse,
    (request: sgn_gateway_v1_gateway_pb.GetInfoByTxHashRequest) => {
      return request.serializeBinary();
    },
    sgn_gateway_v1_gateway_pb.GetInfoByTxHashResponse.deserializeBinary
  );

  getInfoByTxHash(
    request: sgn_gateway_v1_gateway_pb.GetInfoByTxHashRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_gateway_v1_gateway_pb.GetInfoByTxHashResponse>;

  getInfoByTxHash(
    request: sgn_gateway_v1_gateway_pb.GetInfoByTxHashRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_gateway_v1_gateway_pb.GetInfoByTxHashResponse) => void): grpcWeb.ClientReadableStream<sgn_gateway_v1_gateway_pb.GetInfoByTxHashResponse>;

  getInfoByTxHash(
    request: sgn_gateway_v1_gateway_pb.GetInfoByTxHashRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_gateway_v1_gateway_pb.GetInfoByTxHashResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/GetInfoByTxHash',
        request,
        metadata || {},
        this.methodInfoGetInfoByTxHash,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/GetInfoByTxHash',
    request,
    metadata || {},
    this.methodInfoGetInfoByTxHash);
  }

  methodInfoFixEventMiss = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/FixEventMiss',
    grpcWeb.MethodType.UNARY,
    sgn_gateway_v1_gateway_pb.FixEventMissRequest,
    sgn_gateway_v1_gateway_pb.FixEventMissResponse,
    (request: sgn_gateway_v1_gateway_pb.FixEventMissRequest) => {
      return request.serializeBinary();
    },
    sgn_gateway_v1_gateway_pb.FixEventMissResponse.deserializeBinary
  );

  fixEventMiss(
    request: sgn_gateway_v1_gateway_pb.FixEventMissRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_gateway_v1_gateway_pb.FixEventMissResponse>;

  fixEventMiss(
    request: sgn_gateway_v1_gateway_pb.FixEventMissRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_gateway_v1_gateway_pb.FixEventMissResponse) => void): grpcWeb.ClientReadableStream<sgn_gateway_v1_gateway_pb.FixEventMissResponse>;

  fixEventMiss(
    request: sgn_gateway_v1_gateway_pb.FixEventMissRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_gateway_v1_gateway_pb.FixEventMissResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/FixEventMiss',
        request,
        metadata || {},
        this.methodInfoFixEventMiss,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/FixEventMiss',
    request,
    metadata || {},
    this.methodInfoFixEventMiss);
  }

  methodInfoReportCurrentBlockNumber = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/ReportCurrentBlockNumber',
    grpcWeb.MethodType.UNARY,
    sgn_gateway_v1_gateway_pb.ReportCurrentBlockNumberRequest,
    sgn_gateway_v1_gateway_pb.ReportCurrentBlockNumberResponse,
    (request: sgn_gateway_v1_gateway_pb.ReportCurrentBlockNumberRequest) => {
      return request.serializeBinary();
    },
    sgn_gateway_v1_gateway_pb.ReportCurrentBlockNumberResponse.deserializeBinary
  );

  reportCurrentBlockNumber(
    request: sgn_gateway_v1_gateway_pb.ReportCurrentBlockNumberRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_gateway_v1_gateway_pb.ReportCurrentBlockNumberResponse>;

  reportCurrentBlockNumber(
    request: sgn_gateway_v1_gateway_pb.ReportCurrentBlockNumberRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_gateway_v1_gateway_pb.ReportCurrentBlockNumberResponse) => void): grpcWeb.ClientReadableStream<sgn_gateway_v1_gateway_pb.ReportCurrentBlockNumberResponse>;

  reportCurrentBlockNumber(
    request: sgn_gateway_v1_gateway_pb.ReportCurrentBlockNumberRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_gateway_v1_gateway_pb.ReportCurrentBlockNumberResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/ReportCurrentBlockNumber',
        request,
        metadata || {},
        this.methodInfoReportCurrentBlockNumber,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/ReportCurrentBlockNumber',
    request,
    metadata || {},
    this.methodInfoReportCurrentBlockNumber);
  }

  methodInfoGetCurrentBlockNumberByNode = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/GetCurrentBlockNumberByNode',
    grpcWeb.MethodType.UNARY,
    sgn_gateway_v1_gateway_pb.GetCurrentBlockNumberByNodeRequest,
    sgn_gateway_v1_gateway_pb.GetCurrentBlockNumberByNodeResponse,
    (request: sgn_gateway_v1_gateway_pb.GetCurrentBlockNumberByNodeRequest) => {
      return request.serializeBinary();
    },
    sgn_gateway_v1_gateway_pb.GetCurrentBlockNumberByNodeResponse.deserializeBinary
  );

  getCurrentBlockNumberByNode(
    request: sgn_gateway_v1_gateway_pb.GetCurrentBlockNumberByNodeRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_gateway_v1_gateway_pb.GetCurrentBlockNumberByNodeResponse>;

  getCurrentBlockNumberByNode(
    request: sgn_gateway_v1_gateway_pb.GetCurrentBlockNumberByNodeRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_gateway_v1_gateway_pb.GetCurrentBlockNumberByNodeResponse) => void): grpcWeb.ClientReadableStream<sgn_gateway_v1_gateway_pb.GetCurrentBlockNumberByNodeResponse>;

  getCurrentBlockNumberByNode(
    request: sgn_gateway_v1_gateway_pb.GetCurrentBlockNumberByNodeRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_gateway_v1_gateway_pb.GetCurrentBlockNumberByNodeResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/GetCurrentBlockNumberByNode',
        request,
        metadata || {},
        this.methodInfoGetCurrentBlockNumberByNode,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/GetCurrentBlockNumberByNode',
    request,
    metadata || {},
    this.methodInfoGetCurrentBlockNumberByNode);
  }

  methodInfoGetRetentionRewardsInfo = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/GetRetentionRewardsInfo',
    grpcWeb.MethodType.UNARY,
    sgn_gateway_v1_gateway_pb.GetRetentionRewardsInfoRequest,
    sgn_gateway_v1_gateway_pb.GetRetentionRewardsInfoResponse,
    (request: sgn_gateway_v1_gateway_pb.GetRetentionRewardsInfoRequest) => {
      return request.serializeBinary();
    },
    sgn_gateway_v1_gateway_pb.GetRetentionRewardsInfoResponse.deserializeBinary
  );

  getRetentionRewardsInfo(
    request: sgn_gateway_v1_gateway_pb.GetRetentionRewardsInfoRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_gateway_v1_gateway_pb.GetRetentionRewardsInfoResponse>;

  getRetentionRewardsInfo(
    request: sgn_gateway_v1_gateway_pb.GetRetentionRewardsInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_gateway_v1_gateway_pb.GetRetentionRewardsInfoResponse) => void): grpcWeb.ClientReadableStream<sgn_gateway_v1_gateway_pb.GetRetentionRewardsInfoResponse>;

  getRetentionRewardsInfo(
    request: sgn_gateway_v1_gateway_pb.GetRetentionRewardsInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_gateway_v1_gateway_pb.GetRetentionRewardsInfoResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/GetRetentionRewardsInfo',
        request,
        metadata || {},
        this.methodInfoGetRetentionRewardsInfo,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/GetRetentionRewardsInfo',
    request,
    metadata || {},
    this.methodInfoGetRetentionRewardsInfo);
  }

  methodInfoClaimRetentionRewards = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/ClaimRetentionRewards',
    grpcWeb.MethodType.UNARY,
    sgn_gateway_v1_gateway_pb.ClaimRetentionRewardsRequest,
    sgn_gateway_v1_gateway_pb.ClaimRetentionRewardsResponse,
    (request: sgn_gateway_v1_gateway_pb.ClaimRetentionRewardsRequest) => {
      return request.serializeBinary();
    },
    sgn_gateway_v1_gateway_pb.ClaimRetentionRewardsResponse.deserializeBinary
  );

  claimRetentionRewards(
    request: sgn_gateway_v1_gateway_pb.ClaimRetentionRewardsRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_gateway_v1_gateway_pb.ClaimRetentionRewardsResponse>;

  claimRetentionRewards(
    request: sgn_gateway_v1_gateway_pb.ClaimRetentionRewardsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_gateway_v1_gateway_pb.ClaimRetentionRewardsResponse) => void): grpcWeb.ClientReadableStream<sgn_gateway_v1_gateway_pb.ClaimRetentionRewardsResponse>;

  claimRetentionRewards(
    request: sgn_gateway_v1_gateway_pb.ClaimRetentionRewardsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_gateway_v1_gateway_pb.ClaimRetentionRewardsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/ClaimRetentionRewards',
        request,
        metadata || {},
        this.methodInfoClaimRetentionRewards,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/ClaimRetentionRewards',
    request,
    metadata || {},
    this.methodInfoClaimRetentionRewards);
  }

  methodInfoGetFeeRebateInfo = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/GetFeeRebateInfo',
    grpcWeb.MethodType.UNARY,
    sgn_gateway_v1_gateway_pb.GetFeeRebateInfoRequest,
    sgn_gateway_v1_gateway_pb.GetFeeRebateInfoResponse,
    (request: sgn_gateway_v1_gateway_pb.GetFeeRebateInfoRequest) => {
      return request.serializeBinary();
    },
    sgn_gateway_v1_gateway_pb.GetFeeRebateInfoResponse.deserializeBinary
  );

  getFeeRebateInfo(
    request: sgn_gateway_v1_gateway_pb.GetFeeRebateInfoRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_gateway_v1_gateway_pb.GetFeeRebateInfoResponse>;

  getFeeRebateInfo(
    request: sgn_gateway_v1_gateway_pb.GetFeeRebateInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_gateway_v1_gateway_pb.GetFeeRebateInfoResponse) => void): grpcWeb.ClientReadableStream<sgn_gateway_v1_gateway_pb.GetFeeRebateInfoResponse>;

  getFeeRebateInfo(
    request: sgn_gateway_v1_gateway_pb.GetFeeRebateInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_gateway_v1_gateway_pb.GetFeeRebateInfoResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/GetFeeRebateInfo',
        request,
        metadata || {},
        this.methodInfoGetFeeRebateInfo,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/GetFeeRebateInfo',
    request,
    metadata || {},
    this.methodInfoGetFeeRebateInfo);
  }

  methodInfoClaimFeeRebate = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/ClaimFeeRebate',
    grpcWeb.MethodType.UNARY,
    sgn_gateway_v1_gateway_pb.ClaimFeeRebateRequest,
    sgn_gateway_v1_gateway_pb.ClaimFeeRebateResponse,
    (request: sgn_gateway_v1_gateway_pb.ClaimFeeRebateRequest) => {
      return request.serializeBinary();
    },
    sgn_gateway_v1_gateway_pb.ClaimFeeRebateResponse.deserializeBinary
  );

  claimFeeRebate(
    request: sgn_gateway_v1_gateway_pb.ClaimFeeRebateRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_gateway_v1_gateway_pb.ClaimFeeRebateResponse>;

  claimFeeRebate(
    request: sgn_gateway_v1_gateway_pb.ClaimFeeRebateRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_gateway_v1_gateway_pb.ClaimFeeRebateResponse) => void): grpcWeb.ClientReadableStream<sgn_gateway_v1_gateway_pb.ClaimFeeRebateResponse>;

  claimFeeRebate(
    request: sgn_gateway_v1_gateway_pb.ClaimFeeRebateRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_gateway_v1_gateway_pb.ClaimFeeRebateResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/ClaimFeeRebate',
        request,
        metadata || {},
        this.methodInfoClaimFeeRebate,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/ClaimFeeRebate',
    request,
    metadata || {},
    this.methodInfoClaimFeeRebate);
  }

}

