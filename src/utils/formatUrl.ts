import { getNetworkById } from "../constants/network";

type BlockExplorerUrlFormatType = {
  chainId: number;
  txHash: string;
};

type RpcUrlFormatType = {
  chainId: number;
};

const formatBlockExplorerUrlWithTxHash = (param: BlockExplorerUrlFormatType) => {
  const initBlockExplorerUrl = getNetworkById(param.chainId).blockExplorerUrl;
  const blockExplorerUrl = initBlockExplorerUrl?.endsWith("/")
    ? initBlockExplorerUrl?.slice(0, initBlockExplorerUrl.length - 1)
    : initBlockExplorerUrl;
  return `${blockExplorerUrl}/tx/${param.txHash}`;
};

const formatRpcUrl = (param: RpcUrlFormatType) => {
  const initRpcUrl = getNetworkById(param.chainId).rpcUrl;
  const rpcUrl = initRpcUrl?.endsWith("/") ? initRpcUrl?.slice(0, initRpcUrl.length - 1) : initRpcUrl;
  return `${rpcUrl}`;
};

export { formatBlockExplorerUrlWithTxHash, formatRpcUrl };
