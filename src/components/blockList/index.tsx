import { getAddress } from "ethers/lib/utils";
import { ReactNode, useMemo } from "react";
import { useWeb3Context } from "../../providers/Web3ContextProvider";

export default function BlockList({ children }: { children: ReactNode }) {
  const { address } = useWeb3Context();

  const blocked: boolean = useMemo(() => {
    const userBlackListStr = `${process.env.REACT_APP_USER_BLACKLIST}`;
    if (userBlackListStr && address && userBlackListStr !== "undefined") {
      const userBlackList = JSON.parse(userBlackListStr) as [string];
      const blackAddresses = userBlackList?.map(addr => getAddress(addr));
      if (blackAddresses?.includes(getAddress(address))) {
        return true;
      }
    }
    return false;
  }, [address]);

  if (blocked) {
    return <div>Blocked address</div>;
  }

  return <>{children}</>;
}
