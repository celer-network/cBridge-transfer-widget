/**
 * @fileoverview gRPC-Web generated client stub for sgn.explorer.v1
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as sgn_explorer_v1_explorer_pb from '../../../sgn/explorer/v1/explorer_pb';


export class ExplorerClient {
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

  methodInfoGetTotalStats = new grpcWeb.MethodDescriptor(
    '/sgn.explorer.v1.Explorer/GetTotalStats',
    grpcWeb.MethodType.UNARY,
    sgn_explorer_v1_explorer_pb.GetTotalStatsRequest,
    sgn_explorer_v1_explorer_pb.GetTotalStatsResponse,
    (request: sgn_explorer_v1_explorer_pb.GetTotalStatsRequest) => {
      return request.serializeBinary();
    },
    sgn_explorer_v1_explorer_pb.GetTotalStatsResponse.deserializeBinary
  );

  getTotalStats(
    request: sgn_explorer_v1_explorer_pb.GetTotalStatsRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_explorer_v1_explorer_pb.GetTotalStatsResponse>;

  getTotalStats(
    request: sgn_explorer_v1_explorer_pb.GetTotalStatsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_explorer_v1_explorer_pb.GetTotalStatsResponse) => void): grpcWeb.ClientReadableStream<sgn_explorer_v1_explorer_pb.GetTotalStatsResponse>;

  getTotalStats(
    request: sgn_explorer_v1_explorer_pb.GetTotalStatsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_explorer_v1_explorer_pb.GetTotalStatsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.explorer.v1.Explorer/GetTotalStats',
        request,
        metadata || {},
        this.methodInfoGetTotalStats,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.explorer.v1.Explorer/GetTotalStats',
    request,
    metadata || {},
    this.methodInfoGetTotalStats);
  }

  methodInfoGetDailyTotalLiquidity = new grpcWeb.MethodDescriptor(
    '/sgn.explorer.v1.Explorer/GetDailyTotalLiquidity',
    grpcWeb.MethodType.UNARY,
    sgn_explorer_v1_explorer_pb.GetDailyTotalLiquidityRequest,
    sgn_explorer_v1_explorer_pb.GetDailyTotalLiquidityResponse,
    (request: sgn_explorer_v1_explorer_pb.GetDailyTotalLiquidityRequest) => {
      return request.serializeBinary();
    },
    sgn_explorer_v1_explorer_pb.GetDailyTotalLiquidityResponse.deserializeBinary
  );

  getDailyTotalLiquidity(
    request: sgn_explorer_v1_explorer_pb.GetDailyTotalLiquidityRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_explorer_v1_explorer_pb.GetDailyTotalLiquidityResponse>;

  getDailyTotalLiquidity(
    request: sgn_explorer_v1_explorer_pb.GetDailyTotalLiquidityRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_explorer_v1_explorer_pb.GetDailyTotalLiquidityResponse) => void): grpcWeb.ClientReadableStream<sgn_explorer_v1_explorer_pb.GetDailyTotalLiquidityResponse>;

  getDailyTotalLiquidity(
    request: sgn_explorer_v1_explorer_pb.GetDailyTotalLiquidityRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_explorer_v1_explorer_pb.GetDailyTotalLiquidityResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.explorer.v1.Explorer/GetDailyTotalLiquidity',
        request,
        metadata || {},
        this.methodInfoGetDailyTotalLiquidity,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.explorer.v1.Explorer/GetDailyTotalLiquidity',
    request,
    metadata || {},
    this.methodInfoGetDailyTotalLiquidity);
  }

  methodInfoGetDailyTransactionCount = new grpcWeb.MethodDescriptor(
    '/sgn.explorer.v1.Explorer/GetDailyTransactionCount',
    grpcWeb.MethodType.UNARY,
    sgn_explorer_v1_explorer_pb.GetDailyTransactionCountRequest,
    sgn_explorer_v1_explorer_pb.GetDailyTransactionCountResponse,
    (request: sgn_explorer_v1_explorer_pb.GetDailyTransactionCountRequest) => {
      return request.serializeBinary();
    },
    sgn_explorer_v1_explorer_pb.GetDailyTransactionCountResponse.deserializeBinary
  );

  getDailyTransactionCount(
    request: sgn_explorer_v1_explorer_pb.GetDailyTransactionCountRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_explorer_v1_explorer_pb.GetDailyTransactionCountResponse>;

  getDailyTransactionCount(
    request: sgn_explorer_v1_explorer_pb.GetDailyTransactionCountRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_explorer_v1_explorer_pb.GetDailyTransactionCountResponse) => void): grpcWeb.ClientReadableStream<sgn_explorer_v1_explorer_pb.GetDailyTransactionCountResponse>;

  getDailyTransactionCount(
    request: sgn_explorer_v1_explorer_pb.GetDailyTransactionCountRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_explorer_v1_explorer_pb.GetDailyTransactionCountResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.explorer.v1.Explorer/GetDailyTransactionCount',
        request,
        metadata || {},
        this.methodInfoGetDailyTransactionCount,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.explorer.v1.Explorer/GetDailyTransactionCount',
    request,
    metadata || {},
    this.methodInfoGetDailyTransactionCount);
  }

  methodInfoGetDailyTransactionVolume = new grpcWeb.MethodDescriptor(
    '/sgn.explorer.v1.Explorer/GetDailyTransactionVolume',
    grpcWeb.MethodType.UNARY,
    sgn_explorer_v1_explorer_pb.GetDailyTransactionVolumeRequest,
    sgn_explorer_v1_explorer_pb.GetDailyTransactionVolumeResponse,
    (request: sgn_explorer_v1_explorer_pb.GetDailyTransactionVolumeRequest) => {
      return request.serializeBinary();
    },
    sgn_explorer_v1_explorer_pb.GetDailyTransactionVolumeResponse.deserializeBinary
  );

  getDailyTransactionVolume(
    request: sgn_explorer_v1_explorer_pb.GetDailyTransactionVolumeRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_explorer_v1_explorer_pb.GetDailyTransactionVolumeResponse>;

  getDailyTransactionVolume(
    request: sgn_explorer_v1_explorer_pb.GetDailyTransactionVolumeRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_explorer_v1_explorer_pb.GetDailyTransactionVolumeResponse) => void): grpcWeb.ClientReadableStream<sgn_explorer_v1_explorer_pb.GetDailyTransactionVolumeResponse>;

  getDailyTransactionVolume(
    request: sgn_explorer_v1_explorer_pb.GetDailyTransactionVolumeRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_explorer_v1_explorer_pb.GetDailyTransactionVolumeResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.explorer.v1.Explorer/GetDailyTransactionVolume',
        request,
        metadata || {},
        this.methodInfoGetDailyTransactionVolume,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.explorer.v1.Explorer/GetDailyTransactionVolume',
    request,
    metadata || {},
    this.methodInfoGetDailyTransactionVolume);
  }

}

