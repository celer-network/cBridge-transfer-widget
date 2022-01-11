import * as jspb from 'google-protobuf'



export class GetTotalStatsRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTotalStatsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetTotalStatsRequest): GetTotalStatsRequest.AsObject;
  static serializeBinaryToWriter(message: GetTotalStatsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTotalStatsRequest;
  static deserializeBinaryFromReader(message: GetTotalStatsRequest, reader: jspb.BinaryReader): GetTotalStatsRequest;
}

export namespace GetTotalStatsRequest {
  export type AsObject = {
  }
}

export class GetTotalStatsResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): GetTotalStatsResponse;
  hasErr(): boolean;
  clearErr(): GetTotalStatsResponse;

  getTotalTransactionVolume(): number;
  setTotalTransactionVolume(value: number): GetTotalStatsResponse;

  getTotalTransactionCount(): number;
  setTotalTransactionCount(value: number): GetTotalStatsResponse;

  getLast24TotalTransactionVolume(): number;
  setLast24TotalTransactionVolume(value: number): GetTotalStatsResponse;

  getLast24TotalTransactionCount(): number;
  setLast24TotalTransactionCount(value: number): GetTotalStatsResponse;

  getTotalLiquidity(): number;
  setTotalLiquidity(value: number): GetTotalStatsResponse;

  getUniqueAddress(): number;
  setUniqueAddress(value: number): GetTotalStatsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTotalStatsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetTotalStatsResponse): GetTotalStatsResponse.AsObject;
  static serializeBinaryToWriter(message: GetTotalStatsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTotalStatsResponse;
  static deserializeBinaryFromReader(message: GetTotalStatsResponse, reader: jspb.BinaryReader): GetTotalStatsResponse;
}

export namespace GetTotalStatsResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    totalTransactionVolume: number,
    totalTransactionCount: number,
    last24TotalTransactionVolume: number,
    last24TotalTransactionCount: number,
    totalLiquidity: number,
    uniqueAddress: number,
  }
}

export class GetDailyTotalLiquidityRequest extends jspb.Message {
  getBegin(): number;
  setBegin(value: number): GetDailyTotalLiquidityRequest;

  getEnd(): number;
  setEnd(value: number): GetDailyTotalLiquidityRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetDailyTotalLiquidityRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetDailyTotalLiquidityRequest): GetDailyTotalLiquidityRequest.AsObject;
  static serializeBinaryToWriter(message: GetDailyTotalLiquidityRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetDailyTotalLiquidityRequest;
  static deserializeBinaryFromReader(message: GetDailyTotalLiquidityRequest, reader: jspb.BinaryReader): GetDailyTotalLiquidityRequest;
}

export namespace GetDailyTotalLiquidityRequest {
  export type AsObject = {
    begin: number,
    end: number,
  }
}

export class GetDailyTotalLiquidityResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): GetDailyTotalLiquidityResponse;
  hasErr(): boolean;
  clearErr(): GetDailyTotalLiquidityResponse;

  getDailyLiquidityList(): Array<DailyTotalLiquidity>;
  setDailyLiquidityList(value: Array<DailyTotalLiquidity>): GetDailyTotalLiquidityResponse;
  clearDailyLiquidityList(): GetDailyTotalLiquidityResponse;
  addDailyLiquidity(value?: DailyTotalLiquidity, index?: number): DailyTotalLiquidity;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetDailyTotalLiquidityResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetDailyTotalLiquidityResponse): GetDailyTotalLiquidityResponse.AsObject;
  static serializeBinaryToWriter(message: GetDailyTotalLiquidityResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetDailyTotalLiquidityResponse;
  static deserializeBinaryFromReader(message: GetDailyTotalLiquidityResponse, reader: jspb.BinaryReader): GetDailyTotalLiquidityResponse;
}

export namespace GetDailyTotalLiquidityResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    dailyLiquidityList: Array<DailyTotalLiquidity.AsObject>,
  }
}

export class DailyTotalLiquidity extends jspb.Message {
  getTime(): number;
  setTime(value: number): DailyTotalLiquidity;

  getTotalLiquidity(): number;
  setTotalLiquidity(value: number): DailyTotalLiquidity;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DailyTotalLiquidity.AsObject;
  static toObject(includeInstance: boolean, msg: DailyTotalLiquidity): DailyTotalLiquidity.AsObject;
  static serializeBinaryToWriter(message: DailyTotalLiquidity, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DailyTotalLiquidity;
  static deserializeBinaryFromReader(message: DailyTotalLiquidity, reader: jspb.BinaryReader): DailyTotalLiquidity;
}

export namespace DailyTotalLiquidity {
  export type AsObject = {
    time: number,
    totalLiquidity: number,
  }
}

export class GetDailyTransactionCountRequest extends jspb.Message {
  getBegin(): number;
  setBegin(value: number): GetDailyTransactionCountRequest;

  getEnd(): number;
  setEnd(value: number): GetDailyTransactionCountRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetDailyTransactionCountRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetDailyTransactionCountRequest): GetDailyTransactionCountRequest.AsObject;
  static serializeBinaryToWriter(message: GetDailyTransactionCountRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetDailyTransactionCountRequest;
  static deserializeBinaryFromReader(message: GetDailyTransactionCountRequest, reader: jspb.BinaryReader): GetDailyTransactionCountRequest;
}

export namespace GetDailyTransactionCountRequest {
  export type AsObject = {
    begin: number,
    end: number,
  }
}

export class GetDailyTransactionCountResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): GetDailyTransactionCountResponse;
  hasErr(): boolean;
  clearErr(): GetDailyTransactionCountResponse;

  getDailyTransactionCountList(): Array<DailyTransactionCount>;
  setDailyTransactionCountList(value: Array<DailyTransactionCount>): GetDailyTransactionCountResponse;
  clearDailyTransactionCountList(): GetDailyTransactionCountResponse;
  addDailyTransactionCount(value?: DailyTransactionCount, index?: number): DailyTransactionCount;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetDailyTransactionCountResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetDailyTransactionCountResponse): GetDailyTransactionCountResponse.AsObject;
  static serializeBinaryToWriter(message: GetDailyTransactionCountResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetDailyTransactionCountResponse;
  static deserializeBinaryFromReader(message: GetDailyTransactionCountResponse, reader: jspb.BinaryReader): GetDailyTransactionCountResponse;
}

export namespace GetDailyTransactionCountResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    dailyTransactionCountList: Array<DailyTransactionCount.AsObject>,
  }
}

export class DailyTransactionCount extends jspb.Message {
  getTime(): number;
  setTime(value: number): DailyTransactionCount;

  getTransactionCount(): number;
  setTransactionCount(value: number): DailyTransactionCount;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DailyTransactionCount.AsObject;
  static toObject(includeInstance: boolean, msg: DailyTransactionCount): DailyTransactionCount.AsObject;
  static serializeBinaryToWriter(message: DailyTransactionCount, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DailyTransactionCount;
  static deserializeBinaryFromReader(message: DailyTransactionCount, reader: jspb.BinaryReader): DailyTransactionCount;
}

export namespace DailyTransactionCount {
  export type AsObject = {
    time: number,
    transactionCount: number,
  }
}

export class GetDailyTransactionVolumeRequest extends jspb.Message {
  getBegin(): number;
  setBegin(value: number): GetDailyTransactionVolumeRequest;

  getEnd(): number;
  setEnd(value: number): GetDailyTransactionVolumeRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetDailyTransactionVolumeRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetDailyTransactionVolumeRequest): GetDailyTransactionVolumeRequest.AsObject;
  static serializeBinaryToWriter(message: GetDailyTransactionVolumeRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetDailyTransactionVolumeRequest;
  static deserializeBinaryFromReader(message: GetDailyTransactionVolumeRequest, reader: jspb.BinaryReader): GetDailyTransactionVolumeRequest;
}

export namespace GetDailyTransactionVolumeRequest {
  export type AsObject = {
    begin: number,
    end: number,
  }
}

export class GetDailyTransactionVolumeResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): GetDailyTransactionVolumeResponse;
  hasErr(): boolean;
  clearErr(): GetDailyTransactionVolumeResponse;

  getDailyTransactionVolumeList(): Array<DailyTransactionVolume>;
  setDailyTransactionVolumeList(value: Array<DailyTransactionVolume>): GetDailyTransactionVolumeResponse;
  clearDailyTransactionVolumeList(): GetDailyTransactionVolumeResponse;
  addDailyTransactionVolume(value?: DailyTransactionVolume, index?: number): DailyTransactionVolume;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetDailyTransactionVolumeResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetDailyTransactionVolumeResponse): GetDailyTransactionVolumeResponse.AsObject;
  static serializeBinaryToWriter(message: GetDailyTransactionVolumeResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetDailyTransactionVolumeResponse;
  static deserializeBinaryFromReader(message: GetDailyTransactionVolumeResponse, reader: jspb.BinaryReader): GetDailyTransactionVolumeResponse;
}

export namespace GetDailyTransactionVolumeResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    dailyTransactionVolumeList: Array<DailyTransactionVolume.AsObject>,
  }
}

export class DailyTransactionVolume extends jspb.Message {
  getTime(): number;
  setTime(value: number): DailyTransactionVolume;

  getDailyTransactionVolume(): number;
  setDailyTransactionVolume(value: number): DailyTransactionVolume;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DailyTransactionVolume.AsObject;
  static toObject(includeInstance: boolean, msg: DailyTransactionVolume): DailyTransactionVolume.AsObject;
  static serializeBinaryToWriter(message: DailyTransactionVolume, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DailyTransactionVolume;
  static deserializeBinaryFromReader(message: DailyTransactionVolume, reader: jspb.BinaryReader): DailyTransactionVolume;
}

export namespace DailyTransactionVolume {
  export type AsObject = {
    time: number,
    dailyTransactionVolume: number,
  }
}

export class ErrMsg extends jspb.Message {
  getCode(): ErrCode;
  setCode(value: ErrCode): ErrMsg;

  getMsg(): string;
  setMsg(value: string): ErrMsg;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ErrMsg.AsObject;
  static toObject(includeInstance: boolean, msg: ErrMsg): ErrMsg.AsObject;
  static serializeBinaryToWriter(message: ErrMsg, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ErrMsg;
  static deserializeBinaryFromReader(message: ErrMsg, reader: jspb.BinaryReader): ErrMsg;
}

export namespace ErrMsg {
  export type AsObject = {
    code: ErrCode,
    msg: string,
  }
}

export enum ErrCode { 
  ERROR_CODE_UNDEFINED = 0,
  ERROR_CODE_INVALID_TIME_PARAM = 1,
}
