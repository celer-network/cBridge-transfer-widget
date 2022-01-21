import * as jspb from 'google-protobuf'



export class ReportCurrentBlockNumberRequest extends jspb.Message {
  getReport(): Uint8Array | string;
  getReport_asU8(): Uint8Array;
  getReport_asB64(): string;
  setReport(value: Uint8Array | string): ReportCurrentBlockNumberRequest;

  getSig(): Uint8Array | string;
  getSig_asU8(): Uint8Array;
  getSig_asB64(): string;
  setSig(value: Uint8Array | string): ReportCurrentBlockNumberRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ReportCurrentBlockNumberRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ReportCurrentBlockNumberRequest): ReportCurrentBlockNumberRequest.AsObject;
  static serializeBinaryToWriter(message: ReportCurrentBlockNumberRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ReportCurrentBlockNumberRequest;
  static deserializeBinaryFromReader(message: ReportCurrentBlockNumberRequest, reader: jspb.BinaryReader): ReportCurrentBlockNumberRequest;
}

export namespace ReportCurrentBlockNumberRequest {
  export type AsObject = {
    report: Uint8Array | string,
    sig: Uint8Array | string,
  }
}

export class CurrentBlockNumberReport extends jspb.Message {
  getTimestamp(): number;
  setTimestamp(value: number): CurrentBlockNumberReport;

  getBlockNumsMap(): jspb.Map<string, number>;
  clearBlockNumsMap(): CurrentBlockNumberReport;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CurrentBlockNumberReport.AsObject;
  static toObject(includeInstance: boolean, msg: CurrentBlockNumberReport): CurrentBlockNumberReport.AsObject;
  static serializeBinaryToWriter(message: CurrentBlockNumberReport, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CurrentBlockNumberReport;
  static deserializeBinaryFromReader(message: CurrentBlockNumberReport, reader: jspb.BinaryReader): CurrentBlockNumberReport;
}

export namespace CurrentBlockNumberReport {
  export type AsObject = {
    timestamp: number,
    blockNumsMap: Array<[string, number]>,
  }
}

export class ReportCurrentBlockNumberResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): ReportCurrentBlockNumberResponse;
  hasErr(): boolean;
  clearErr(): ReportCurrentBlockNumberResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ReportCurrentBlockNumberResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ReportCurrentBlockNumberResponse): ReportCurrentBlockNumberResponse.AsObject;
  static serializeBinaryToWriter(message: ReportCurrentBlockNumberResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ReportCurrentBlockNumberResponse;
  static deserializeBinaryFromReader(message: ReportCurrentBlockNumberResponse, reader: jspb.BinaryReader): ReportCurrentBlockNumberResponse;
}

export namespace ReportCurrentBlockNumberResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
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
  ERROR_CODE_COMMON = 500,
  ERROR_NO_TOKEN_ON_DST_CHAIN = 1001,
  ERROR_NO_TOKEN_ON_SRC_CHAIN = 1002,
  ERROR_INIT_WITHDRAW_FAILED = 1003,
  ERROR_CODE_NO_ENOUGH_TOKEN_ON_DST_CHAIN = 1004,
}
