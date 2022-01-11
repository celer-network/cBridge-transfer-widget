/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-shadow */
/* eslint-disable camelcase */

// import { Bytes } from "ethers";
import { MapLike } from "typescript";

interface ErrMsg {
  code: ErrCode;
  msg: string;
}

enum ErrCode {
  ERROR_CODE_UNDEFINED = 0,
  ERROR_CODE_COMMON = 500,
  ERROR_NO_TOKEN_ON_DST_CHAIN = 1001,
}

export enum LPHistoryStatus {
  LP_UNKNOWN,
  LP_WAITING_FOR_SGN,
  LP_WAITING_FOR_LP,
  LP_SUBMITTING,
  LP_COMPLETED,
  LP_FAILED,
  LP_DELAYED,
}

interface Chain {
  id: number;
  name: string;
  icon: string;
  block_delay: number;
  gas_token_symbol: string;
  explore_url: string;
  rpc_url: string;
  contract_addr: string;
  drop_gas_amt?: string;
}

interface PeggedPairConfig {
  org_chain_id: number;
  org_token: TokenInfo;
  pegged_chain_id: number;
  pegged_token: TokenInfo;
  pegged_deposit_contract_addr: string;
  pegged_burn_contract_addr: string;
  canonical_token_contract_addr: string;
}

interface Token {
  symbol: string;
  address: string;
  decimal: number;
  xfer_disabled: boolean;
  display_symbol?: string; /// FOR ETH <=====> WETH
}

interface GetAdvancedInfoRequest {
  addr: string;
}

interface GetAdvancedInfoResponse {
  slippage_tolerance: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any;
}
interface SetAdvancedInfoRequest {
  addr: string;
  slippage_tolerance: number;
}

interface ChainTokenInfo {
  token: Array<TokenInfo>;
}

interface GetTransferConfigsResponse {
  chains: Array<Chain>;
  chain_token: MapLike<ChainTokenInfo>;
  farming_reward_contract_addr: string;
  pegged_pair_configs: Array<PeggedPairConfig>;
}

interface EstimateAmtRequest {
  src_chain_id: number;
  dst_chain_id: number;
  token_symbol: string;
  amt: string;
  usr_addr: string;
}

interface EstimateAmtResponse {
  eq_value_token_amt: string;
  bridge_rate: number;
  fee: string;
  slippage_tolerance: number;
  max_slippage: number;
  err: any;
}

interface GetTransferStatusRequest {
  transfer_id: string;
}

interface GetTransferStatusResponse {
  status: TransferHistoryStatus;
  wd_onchain: string;
  sorted_sigs: Array<string>;
  signers: Array<string>;
  powers: Array<string>;
  src_block_tx_link?: string;
  dst_block_tx_link?: string;
}

export enum MarkTransferTypeRequest {
  TRANSFER_TYPE_UNKNOWN = 0,
  TRANSFER_TYPE_SEND = 1,
  TRANSFER_TYPE_REFUND = 2,
}

interface WithdrawLiquidityRequest {
  transfer_id?: string;
  receiver_addr?: string;
  amount?: string;
  token_addr?: string;
  chain_id?: number;
  sig?: string;
  reqid?: number;
  // creator:string
}

interface WithdrawLiquidityResponse {
  seq_num: string;
  withdraw_id: string;
}
interface WithdrawDetail {
  _wdmsg: string;
  _sigs: Array<string>;
  _signers: Array<string>;
  _powers: Array<string>;
}

interface TransferHistoryRequest {
  next_page_token: string; // for first page, it's ""
  page_size: number;
  addr: string;
}

interface TransferHistory {
  transfer_id: string;
  src_send_info: TransferInfo;
  dst_received_info: TransferInfo;
  ts: number;
  src_block_tx_link: string;
  dst_block_tx_link: string;
  status: TransferHistoryStatus;
  updateTime?: number;
  txIsFailed?: boolean;
}

export enum TransferHistoryStatus {
  TRANSFER_UNKNOWN,
  TRANSFER_SUBMITTING, // user: after calling mark transfer api
  TRANSFER_FAILED, // user: check if tx reverted when shown status is TRANSFER_SUBMITTING
  TRANSFER_WAITING_FOR_SGN_CONFIRMATION, // relayer: on send tx success event
  TRANSFER_WAITING_FOR_FUND_RELEASE, // relayer: mark send tx
  TRANSFER_COMPLETED, // relayer: on relay tx success event
  TRANSFER_TO_BE_REFUNDED, // x: transfer rejected by sgn and waiting for withdraw api called
  TRANSFER_REQUESTING_REFUND, // user: withdraw api has been called and withdraw is processing by sgn
  TRANSFER_REFUND_TO_BE_CONFIRMED, // x: withdraw is approved by sgn
  TRANSFER_CONFIRMING_YOUR_REFUND, // user: mark refund has been submitted on chain
  TRANSFER_REFUNDED, // relayer: on refund(withdraw liquidity actually) tx event
  TRANSFER_DELAYED,
}

interface TransferInfo {
  chain: Chain;
  token: Token;
  amount: string;
}

interface TransferHistoryResponse {
  history: Array<TransferHistory>;
  next_page_token: string;
  current_size: number;
}

interface TokenInfo {
  token: Token;
  name: string;
  icon: string;
  max_amt: string;
  balance?: string;
}

interface ErrMsg {
  code: ErrCode;
  msg: string;
}

interface Signature {
  signer: string;
  sig_bytes: string;
}

export type {
  //   LPHistoryStatus,
  Chain,
  Token,
  GetAdvancedInfoRequest,
  GetAdvancedInfoResponse,
  SetAdvancedInfoRequest,
  GetTransferConfigsResponse,
  EstimateAmtRequest,
  EstimateAmtResponse,
  GetTransferStatusRequest,
  GetTransferStatusResponse,
  WithdrawLiquidityRequest,
  WithdrawLiquidityResponse,
  WithdrawDetail,
  TransferHistoryRequest,
  TransferHistory,
  TransferInfo,
  TransferHistoryResponse,
  TokenInfo,
  ErrMsg,
  Signature,
  PeggedPairConfig,
};
