import * as fcl from "@onflow/fcl";

import axios from "axios";
import {
  FlowDepositParameters,
  FlowDepositResponse,
  FlowBurnParameters,
  FlowBurnResponse,
  FlowDepositTokenConfig,
  FlowBurnTokenConfig,
  FlowTokenPathConfigs,
  FlowTokenPathConfig,
} from "../../constants/type";
// eslint-disable-next-line
import { sha3_256 } from "js-sha3";

const flowFungibleTokenAddress =
  process.env.REACT_APP_ENV === "TEST" || process.env.REACT_APP_ENV === "DEV"
    ? "0x9a0766d93b6608b7"
    : "0xf233dcee88fe0abe";
const tokenPathUrl =
  process.env.REACT_APP_ENV === "TEST" || process.env.REACT_APP_ENV === "DEV"
    ? "https://get.celer.app/flow/testnet/token_path_config.json"
    : "https://get.celer.app/flow/mainnet/token_path_config_mainnet.json";

const addPrefixOxForFlowContractAddress = (address: string) => {
  return "0x" + address.replace("0x", "");
};

const removeFlowAddressLeading0s = (address: string) => {
  return "0x" + address.replace("0x", "").replace(/^0+/, "");
};

export const getFlowTokenPathConfigs = (): Promise<FlowTokenPathConfigs> =>
  axios
    .get(tokenPathUrl)
    /* eslint-disable camelcase */
    // .get(`${process.env.REACT_APP_SERVER_URL}/v1/getTransferConfigsForAll`)
    .then(res => {
      return res.data;
    })
    .catch(e => {
      console.log("error=>", e);
    });

export const depositFromFlow = async (parameters: FlowDepositParameters): Promise<FlowDepositResponse> => {
  const cadenceCode = fcl.transaction`
    import FungibleToken from ${flowFungibleTokenAddress}
    import SafeBox from ${addPrefixOxForFlowContractAddress(parameters.safeBoxContractAddress)}

    transaction() {
      let provRef: &{FungibleToken.Provider}

      prepare(acct: AuthAccount) {
        self.provRef = acct.borrow<&{FungibleToken.Provider}>(from: ${
          parameters.storagePath
        }) ?? panic("Could not borrow a reference to the owner's vault")
      }

      execute {
        let depoInfo = SafeBox.DepoInfo(amt: UFix64(${parameters.amount}), mintChId: ${
    parameters.mintChainId
  }, mintAddr: "${parameters.evmMintAddress}", nonce: ${parameters.nonce})
        SafeBox.deposit(from: self.provRef, info: depoInfo)
      }
    }
    `;

  try {
    const response = await fcl.send([
      cadenceCode,
      fcl.proposer(fcl.currentUser().authorization),
      fcl.payer(fcl.currentUser().authorization),
      fcl.authorizations([fcl.currentUser().authorization]),
      fcl.limit(9999),
    ]);

    const amountString = Number(parameters.amount)?.toFixed(8).toString() ?? parameters.amount;
    const depositParameterValue =
      removeFlowAddressLeading0s(parameters.flowAddress) + parameters.tokenAddress + amountString + parameters.nonce;

    const transferId = "0x" + sha3_256(depositParameterValue);

    return { flowTransanctionId: response.transactionId, transferId };
  } catch (error) {
    console.log("Flow send transaction error", error);
    return { flowTransanctionId: "", transferId: "" };
  }
};

export const checkTokenReceivabilityForFlowAccount = async (
  address: string,
  receiverPath: string,
): Promise<boolean> => {
  if (address.length === 0) {
    return false;
  }
  const candence = fcl.script`
      import FungibleToken from ${flowFungibleTokenAddress}
      pub fun main(): Bool {
          let vaultRef = getAccount(${address})
              .getCapability(${receiverPath})
              .borrow<&{FungibleToken.Receiver}>()
          if vaultRef == nil {
            return false
          } else {
            return true
          }
      }`;

  try {
    const response = await fcl.send([candence]);
    const isFlowAccouintInitialized = await fcl.decode(response);
    return isFlowAccouintInitialized;
  } catch {
    return false;
  }
};

export const checkTokenBalanceForFlowAccount = async (address: string, balancePath: string): Promise<number> => {
  const candenceCode = fcl.script`
    import FungibleToken from ${flowFungibleTokenAddress}

    pub fun main(): UFix64 {
        let vaultRef = getAccount(${address})
            .getCapability(${balancePath})
            .borrow<&{FungibleToken.Balance}>()
            ?? panic("Could not borrow Balance reference to the Vault")
        return vaultRef.balance
    }`;

  const response = await fcl.send([candenceCode]);
  const balance = await fcl.decode(response);
  return balance;
};

export const setupTokenVaultForFlowAccount = async (tokenPath: FlowTokenPathConfig, accountAddress: string) => {
  try {
    const candence = fcl.transaction`
        import FungibleToken from ${flowFungibleTokenAddress}
        import ${tokenPath.TokenName} from ${addPrefixOxForFlowContractAddress(tokenPath.TokenAddress)}
  
        transaction {
            prepare(signer: AuthAccount) {
                // It's OK if the account already has a Vault, but we don't want to replace it
                if(signer.borrow<&${tokenPath.TokenName}.Vault>(from: ${tokenPath.StoragePath}) != nil) {
                    return
                }
  
                // Create a new ${tokenPath.TokenName} Vault and put it in storage
                signer.save(<-${tokenPath.TokenName}.createEmptyVault(), to: ${tokenPath.StoragePath})
  
                // Create a public capability to the Vault that only exposes
                // the deposit function through the Receiver interface
                signer.link<&${tokenPath.TokenName}.Vault{FungibleToken.Receiver}>(
                    ${tokenPath.ReceiverPath},
                    target: ${tokenPath.StoragePath}
                )
  
                // Create a public capability to the Vault that only exposes
                // the balance field through the Balance interface
                signer.link<&${tokenPath.TokenName}.Vault{FungibleToken.Balance}>(
                    ${tokenPath.BalancePath},
                    target: ${tokenPath.StoragePath}
                )
            }
        }
        `;
    const response = await fcl.send([
      candence,
      fcl.proposer(fcl.currentUser().authorization),
      fcl.authorizations([fcl.currentUser().authorization]),
      fcl.payer(fcl.currentUser().authorization),
      fcl.limit(9999),
    ]);

    await fcl.tx(response).onceSealed();

    return Promise.resolve(true);
  } catch (error) {
    try {
      const doubleCheck = await checkTokenReceivabilityForFlowAccount(accountAddress, tokenPath.ReceiverPath);
      return Promise.resolve(doubleCheck);
    } catch {
      return Promise.resolve(false);
    }
  }
};

export const burnFromFlow = async (parameters: FlowBurnParameters): Promise<FlowBurnResponse> => {
  const cadenceCode = fcl.transaction`
    import FungibleToken from ${flowFungibleTokenAddress}
    import PegBridge from ${addPrefixOxForFlowContractAddress(parameters.pegBridgeAddress)}

    transaction() {
      let provRef: &{FungibleToken.Provider}

      prepare(acct: AuthAccount) {
        self.provRef = acct.borrow<&{FungibleToken.Provider}>(from: ${
          parameters.storagePath
        }) ?? panic("Could not borrow a reference to the owner's vault")
      }

      execute {
        let burnInfo = PegBridge.BurnInfo(amt: UFix64(${parameters.amount}), withdrawChId: ${
    parameters.withdrawChainId
  }, withdrawAddr: "${parameters.evmWithdrawAddress}", nonce: ${parameters.nonce})
        PegBridge.burn(from: self.provRef, info: burnInfo) 
      }
    }
    `;

  try {
    const response = await fcl.send([
      cadenceCode,
      fcl.proposer(fcl.currentUser().authorization),
      fcl.payer(fcl.currentUser().authorization),
      fcl.authorizations([fcl.currentUser().authorization]),
      fcl.limit(9999),
    ]);

    const amountString = Number(parameters.amount)?.toFixed(8).toString() ?? parameters.amount;
    const burnParameterValue =
      removeFlowAddressLeading0s(parameters.flowAddress) + parameters.tokenAddress + amountString + parameters.nonce;

    const transferId = "0x" + sha3_256(burnParameterValue);

    // const transaction = await fcl.tx(response).onceSealed();

    // console.log("tx", transaction)

    return { flowTransanctionId: response.transactionId, transferId };
  } catch (error) {
    console.log("Flow send transaction error", error);
    return { flowTransanctionId: "", transferId: "" };
  }
};

export const burnConfigFromFlow = async (
  pegBridgeAddress: string,
  tokenSymbol: string,
): Promise<FlowBurnTokenConfig> => {
  const candenceCode = fcl.script`
    import PegBridge from ${addPrefixOxForFlowContractAddress(pegBridgeAddress)}

    pub fun main(): PegBridge.TokenCfg {
        return PegBridge.getTokenConfig(identifier: "${tokenSymbol}")
    }`;

  try {
    const response = await fcl.send([candenceCode]);
    const config = await fcl.decode(response);
    return config;
  } catch (error) {
    console.log("error", error);
    return { minBurn: 0, maxBurn: 0, delayThreshold: 0, cap: 0 };
  }
};

export const depositConfigFromFlow = async (
  safeboxAddress: string,
  tokenSymbol: string,
): Promise<FlowDepositTokenConfig> => {
  const candenceCode = fcl.script`
    import SafeBox from ${addPrefixOxForFlowContractAddress(safeboxAddress)}

    pub fun main(): SafeBox.TokenCfg {
        return SafeBox.getTokenConfig(identifier: "${tokenSymbol}")
    }`;

  try {
    const response = await fcl.send([candenceCode]);
    const config = await fcl.decode(response);
    return config;
  } catch (error) {
    console.log("error", error);
    return { minDepo: 0, maxDepo: 0, delayThreshold: 0, cap: 0 };
  }
};

export const getFlowDelayPeriodInMinute = async (delayTransferAddress: string): Promise<number> => {
  const candenceCode = fcl.script`
    import DelayedTransfer from ${addPrefixOxForFlowContractAddress(delayTransferAddress)}

    pub fun main(): UInt64 {
      return DelayedTransfer.delayPeriod
    }`;

  try {
    const response = await fcl.send([candenceCode]);
    const delayPeriod = await fcl.decode(response);
    return delayPeriod / 60;
  } catch (error) {
    console.log("error", error);
    return 0;
  }
};

export const submitFlowRefundRequest = async (
  safeBoxContractAddress: string,
  tokenFullAddress: string,
  wdmsg: Uint8Array,
  gatewaySigs: Uint8Array[],
): Promise<string> => {
  const sigStringArray = gatewaySigs
    .map(sig => {
      return `[${Array.from(sig)}]`;
    })
    .join(",");

  const cadenceCode = fcl.transaction`
  import FungibleToken from ${flowFungibleTokenAddress}
  import cBridge from ${addPrefixOxForFlowContractAddress(safeBoxContractAddress)}
  import SafeBox from ${addPrefixOxForFlowContractAddress(safeBoxContractAddress)}

  transaction() {
    prepare(signer: AuthAccount) {}
  
    execute {
      let wdmsg: [UInt8] = [${Array.from(wdmsg)}]

      let sigStringArray: [[UInt8]] = [${sigStringArray}]

      let sigs :[cBridge.SignerSig] = []
      for sig in sigStringArray {
        let bridgeSig = cBridge.SignerSig(sig)
        sigs.append(bridgeSig)
      }
      SafeBox.withdraw(token: "${tokenFullAddress}", wdmsg: wdmsg, sigs: sigs)
    }
  }`;

  try {
    const response = await fcl.send([
      cadenceCode,
      fcl.proposer(fcl.currentUser().authorization),
      fcl.payer(fcl.currentUser().authorization),
      fcl.authorizations([fcl.currentUser().authorization]),
      fcl.limit(9999),
    ]);

    console.log("flow refund response", response);
    return response.transactionId;
  } catch (error) {
    console.log("error", error);
    return "";
  }
};

export const getFlowTokenLiquidityBalance = async (flowVaultContractAddr: string, receiverPath: string) => {
  const candenceCode = fcl.script`
  import FungibleToken from ${flowFungibleTokenAddress}

  pub fun main(): UFix64 {
      let vaultRef = getAccount(${removeFlowAddressLeading0s(flowVaultContractAddr)})
          .getCapability(${receiverPath})
          .borrow<&{FungibleToken.Balance}>()
          ?? panic("Could not borrow Balance reference to the Vault")
      return vaultRef.balance
  }`;
  try {
    const response = await fcl.send([candenceCode]);
    const liquidity = await fcl.decode(response);
    return liquidity;
  } catch (error) {
    console.log("error", error);
    return 0;
  }
};
