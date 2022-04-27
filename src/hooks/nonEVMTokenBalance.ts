import { useEffect, useState } from "react";
import { TokenInfo } from "../constants/type";
import { formatDecimal } from "../helpers/format";
import { NonEVMMode } from "../providers/NonEVMContextProvider";
import { checkTokenBalanceForFlowAccount } from "../redux/NonEVMAPIs/flowAPIs";
import {
  terraGeneralTokenBalance,
  terraNativeBalances,
  terraNativeTokenSymbolMapping,
} from "../redux/NonEVMAPIs/terraAPIs";
import { useAppSelector } from "../redux/store";

export type UseBalanceReturn = [number];

function useNonEVMTokenBalance(
  nonEVMMode: NonEVMMode,
  nonEVMAddress: string,
  nonEVMConnected: boolean,
  selectedToken: TokenInfo | undefined,
): UseBalanceReturn {
  const [nonEVMTokenBalance, setNonEVMTokenBalance] = useState<number>(0);
  const { flowTokenPathConfigs } = useAppSelector(state => state.transferInfo);

  const getFlowBalance = async () => {
    const tokenSymbol = selectedToken?.token.symbol ?? "";
    if (tokenSymbol.length === 0) {
      setNonEVMTokenBalance(0);
      return;
    }

    const flowTokenPath = flowTokenPathConfigs.find(config => {
      return config.Symbol === selectedToken?.token.symbol;
    });

    await checkTokenBalanceForFlowAccount(nonEVMAddress, flowTokenPath?.BalancePath ?? "")
      .then(balance => {
        setNonEVMTokenBalance(balance);
      })
      .catch(_ => {
        setNonEVMTokenBalance(0);
      });
  };

  const getTerraBalance = async () => {
    if (selectedToken === undefined) {
      setNonEVMTokenBalance(0);
      return;
    }
    const terraNativeTokenSymbol = terraNativeTokenSymbolMapping(selectedToken.token.symbol);
    if (terraNativeTokenSymbol.length > 0) {
      await terraNativeBalances(nonEVMAddress)
        .then(coins => {
          const coin = coins.get(terraNativeTokenSymbol);
          if (coin) {
            const balance = Number(coin.amount) / 1000000;
            setNonEVMTokenBalance(balance);
          } else {
            setNonEVMTokenBalance(0);
          }
        })
        .catch(_ => {
          setNonEVMTokenBalance(0);
        });
      return;
    }

    await terraGeneralTokenBalance(nonEVMAddress, selectedToken.token.address)
      .then(balance => {
        const balanceWithoutDecimal = formatDecimal(balance.toString(), selectedToken.token.decimal);
        setNonEVMTokenBalance(Number(balanceWithoutDecimal) ?? 0);
      })
      .catch(_ => {
        setNonEVMTokenBalance(0);
      });
  };

  useEffect(() => {
    if (nonEVMAddress && nonEVMConnected && selectedToken) {
      if (nonEVMMode === NonEVMMode.flowTest || nonEVMMode === NonEVMMode.flowMainnet) {
        getFlowBalance();
      } else if (nonEVMMode === NonEVMMode.terraTest || nonEVMMode === NonEVMMode.terraMainnet) {
        getTerraBalance();
      }
    } else {
      setNonEVMTokenBalance(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nonEVMMode, nonEVMAddress, nonEVMConnected, selectedToken]);

  return [nonEVMTokenBalance];
}

export default useNonEVMTokenBalance;
