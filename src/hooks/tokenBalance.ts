import { BigNumber } from "ethers";
import { useEffect, useState } from "react";
import { useToggle } from "react-use";
import { ERC20 } from "../typechain/ERC20";

export type UseBalanceReturn = [BigNumber, boolean, string, () => void];

function useTokenBalance(tokenContract: ERC20 | undefined, address: string, timeout = 3000): UseBalanceReturn {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [reloadTrigger, reload] = useToggle(false);

  useEffect(() => {
    setError("");

    if (!tokenContract || !address) {
      return;
    }

    const balancePromise = tokenContract.balanceOf(address);

    let timeoutTimer: NodeJS.Timeout;
    const timeoutPromise = new Promise<BigNumber>((_, reject) => {
      timeoutTimer = setTimeout(() => {
        reject(new Error("Token balance fetching timed out"));
      }, timeout);
    });

    setLoading(true);

    Promise.race([balancePromise, timeoutPromise])
      .then((bal: BigNumber) => {
        clearTimeout(timeoutTimer);
        setError("");
        setRetryCount(0);
        setBalance(bal);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [tokenContract, address, reloadTrigger, timeout]);

  useEffect(() => {
    if (error && retryCount < 3) {
      console.log("reloading balance, retry", retryCount);
      setRetryCount(retryCount + 1);
      reload();
    }
  }, [error, retryCount, reload]);

  return [balance, loading, error, reload];
}

export default useTokenBalance;
