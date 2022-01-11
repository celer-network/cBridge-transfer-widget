import Notify from "bnc-notify";
import { notification } from "antd";
import { ClockCircleOutlined, WarningOutlined } from "@ant-design/icons";

import { BigNumber, BigNumberish, ethers } from "ethers";

import { JsonRpcProvider, TransactionRequest, TransactionResponse } from "@ethersproject/providers";
import { parseUnits } from "@ethersproject/units";

export type Transactor<T extends ethers.Transaction> = (
  tx: Promise<T> | ethers.utils.Deferrable<TransactionRequest>,
) => Promise<T | TransactionResponse>;

/**
 * A wrapper around BlockNative's wonderful Notify.js https://docs.blocknative.com/notify
 *
 * @param provider The Ethereum Provider
 * @param gasPrice Optional gas price
 * @param etherscanUrl Optional Etherscan URL
 */
export default function transactorWithNotifier<T extends ethers.Transaction>(
  provider?: JsonRpcProvider | undefined,
  gasPrice?: BigNumberish | undefined,
  etherscanUrl?: string,
): Transactor<T> | undefined {
  if (typeof provider !== "undefined") {
    return async (tx: Promise<T> | ethers.utils.Deferrable<TransactionRequest>): Promise<T | TransactionResponse> => {
      const signer = provider.getSigner();
      const network = await provider.getNetwork();
      const localChainName = localStorage.getItem("chainName");

      const options = {
        dappId: "0b58206a-f3c0-4701-a62f-73c7243e8c77", // GET YOUR OWN KEY AT https://account.blocknative.com
        system: "ethereum" as const,
        networkId: network.chainId,
        darkMode: true,
        mobilePosition: "top" as const,
        desktopPosition: "topRight" as const,
        // transactionHandler: (txInformation: TransactionEvent) => {
        // },
      };
      const notify = Notify(options);

      let etherscanNetwork = "";
      if (network.name && network.chainId > 1) {
        etherscanNetwork = network.name + ".";
      }

      let etherscanTxUrl = "https://" + etherscanNetwork + "etherscan.io/tx/";
      if (network.chainId === 100) {
        etherscanTxUrl = "https://blockscout.com/poa/xdai/tx/";
      }

      try {
        let result: T | TransactionResponse;
        if (tx instanceof Promise) {
          result = await tx;
        } else {
          if (!tx.gasPrice) {
            /* eslint-disable-next-line no-param-reassign */
            tx.gasPrice = gasPrice || parseUnits("4.1", "gwei");
          }
          if (!tx.gasLimit) {
            /* eslint-disable-next-line no-param-reassign */
            tx.gasLimit = BigNumber.from(120000);
          }
          result = await signer.sendTransaction(tx);
        }

        // if it is a valid Notify.js network, use that, if not, just send a default notification
        if ([1, 3, 4, 5, 42, 100].indexOf(network.chainId) >= 0) {
          if (result.hash) {
            const { emitter } = notify.hash(result.hash);
            emitter.on("all", transaction => ({
              onclick: () => window.open((etherscanUrl || etherscanTxUrl) + transaction.hash),
            }));
          }
        } else {
          notification.info({
            message: (
              <div style={{ fontSize: 14 }}>
                Your transaction has been
                {localChainName && <div>send to {localChainName}</div>}
              </div>
            ),
            description: new Date().toLocaleTimeString(),
            placement: "topRight",
            className: "notifi",
            key: "notifi",
            icon: <ClockCircleOutlined spin style={{ color: "#eec05a" }} />,
          });
        }
        return result;
      } catch (e) {
        const err = e as GenericError;
        const message = err.message;
        if (message) {
          console.log(
            "Transaction Error:",
            message,
            message.indexOf("MetaMask Tx Signature: User denied transaction signature"),
          );
          if (message.indexOf("MetaMask Tx Signature: User denied transaction signature") === -1) {
            notification.error({
              message: "Your transaction has failed",
              description: new Date().toLocaleTimeString(),
              placement: "topRight",
              className: "notifi",
              key: "notifi",
              icon: <WarningOutlined style={{ color: "#d94549" }} />,
            });
          }
        }
        throw e;
        // return e;
      }
    };
  }
  return undefined;
}

interface GenericError {
  message: string;
  stack?: string;
}
