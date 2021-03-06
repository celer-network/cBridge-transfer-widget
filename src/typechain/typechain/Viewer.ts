/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export declare namespace DataTypes {
  export type ValidatorInfoStruct = {
    valAddr: string;
    status: BigNumberish;
    signer: string;
    tokens: BigNumberish;
    shares: BigNumberish;
    minSelfDelegation: BigNumberish;
    commissionRate: BigNumberish;
  };

  export type ValidatorInfoStructOutput = [string, number, string, BigNumber, BigNumber, BigNumber, BigNumber] & {
    valAddr: string;
    status: number;
    signer: string;
    tokens: BigNumber;
    shares: BigNumber;
    minSelfDelegation: BigNumber;
    commissionRate: BigNumber;
  };

  export type UndelegationStruct = {
    shares: BigNumberish;
    creationBlock: BigNumberish;
  };

  export type UndelegationStructOutput = [BigNumber, BigNumber] & {
    shares: BigNumber;
    creationBlock: BigNumber;
  };

  export type DelegatorInfoStruct = {
    valAddr: string;
    tokens: BigNumberish;
    shares: BigNumberish;
    undelegations: DataTypes.UndelegationStruct[];
    undelegationTokens: BigNumberish;
    withdrawableUndelegationTokens: BigNumberish;
  };

  export type DelegatorInfoStructOutput = [
    string,
    BigNumber,
    BigNumber,
    DataTypes.UndelegationStructOutput[],
    BigNumber,
    BigNumber,
  ] & {
    valAddr: string;
    tokens: BigNumber;
    shares: BigNumber;
    undelegations: DataTypes.UndelegationStructOutput[];
    undelegationTokens: BigNumber;
    withdrawableUndelegationTokens: BigNumber;
  };
}

export interface ViewerInterface extends utils.Interface {
  contractName: "Viewer";
  functions: {
    "getBondedValidatorInfos()": FunctionFragment;
    "getDelegatorInfos(address)": FunctionFragment;
    "getDelegatorTokens(address)": FunctionFragment;
    "getMinValidatorTokens()": FunctionFragment;
    "getValidatorInfo(address)": FunctionFragment;
    "getValidatorInfos()": FunctionFragment;
    "shouldBondValidator(address)": FunctionFragment;
    "staking()": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "getBondedValidatorInfos", values?: undefined): string;
  encodeFunctionData(functionFragment: "getDelegatorInfos", values: [string]): string;
  encodeFunctionData(functionFragment: "getDelegatorTokens", values: [string]): string;
  encodeFunctionData(functionFragment: "getMinValidatorTokens", values?: undefined): string;
  encodeFunctionData(functionFragment: "getValidatorInfo", values: [string]): string;
  encodeFunctionData(functionFragment: "getValidatorInfos", values?: undefined): string;
  encodeFunctionData(functionFragment: "shouldBondValidator", values: [string]): string;
  encodeFunctionData(functionFragment: "staking", values?: undefined): string;

  decodeFunctionResult(functionFragment: "getBondedValidatorInfos", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getDelegatorInfos", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getDelegatorTokens", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getMinValidatorTokens", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getValidatorInfo", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getValidatorInfos", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "shouldBondValidator", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "staking", data: BytesLike): Result;

  events: {};
}

export interface Viewer extends BaseContract {
  contractName: "Viewer";
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: ViewerInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined,
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(eventFilter?: TypedEventFilter<TEvent>): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(eventFilter: TypedEventFilter<TEvent>): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    getBondedValidatorInfos(overrides?: CallOverrides): Promise<[DataTypes.ValidatorInfoStructOutput[]]>;

    getDelegatorInfos(_delAddr: string, overrides?: CallOverrides): Promise<[DataTypes.DelegatorInfoStructOutput[]]>;

    getDelegatorTokens(_delAddr: string, overrides?: CallOverrides): Promise<[BigNumber, BigNumber]>;

    getMinValidatorTokens(overrides?: CallOverrides): Promise<[BigNumber]>;

    getValidatorInfo(_valAddr: string, overrides?: CallOverrides): Promise<[DataTypes.ValidatorInfoStructOutput]>;

    getValidatorInfos(overrides?: CallOverrides): Promise<[DataTypes.ValidatorInfoStructOutput[]]>;

    shouldBondValidator(_valAddr: string, overrides?: CallOverrides): Promise<[boolean]>;

    staking(overrides?: CallOverrides): Promise<[string]>;
  };

  getBondedValidatorInfos(overrides?: CallOverrides): Promise<DataTypes.ValidatorInfoStructOutput[]>;

  getDelegatorInfos(_delAddr: string, overrides?: CallOverrides): Promise<DataTypes.DelegatorInfoStructOutput[]>;

  getDelegatorTokens(_delAddr: string, overrides?: CallOverrides): Promise<[BigNumber, BigNumber]>;

  getMinValidatorTokens(overrides?: CallOverrides): Promise<BigNumber>;

  getValidatorInfo(_valAddr: string, overrides?: CallOverrides): Promise<DataTypes.ValidatorInfoStructOutput>;

  getValidatorInfos(overrides?: CallOverrides): Promise<DataTypes.ValidatorInfoStructOutput[]>;

  shouldBondValidator(_valAddr: string, overrides?: CallOverrides): Promise<boolean>;

  staking(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    getBondedValidatorInfos(overrides?: CallOverrides): Promise<DataTypes.ValidatorInfoStructOutput[]>;

    getDelegatorInfos(_delAddr: string, overrides?: CallOverrides): Promise<DataTypes.DelegatorInfoStructOutput[]>;

    getDelegatorTokens(_delAddr: string, overrides?: CallOverrides): Promise<[BigNumber, BigNumber]>;

    getMinValidatorTokens(overrides?: CallOverrides): Promise<BigNumber>;

    getValidatorInfo(_valAddr: string, overrides?: CallOverrides): Promise<DataTypes.ValidatorInfoStructOutput>;

    getValidatorInfos(overrides?: CallOverrides): Promise<DataTypes.ValidatorInfoStructOutput[]>;

    shouldBondValidator(_valAddr: string, overrides?: CallOverrides): Promise<boolean>;

    staking(overrides?: CallOverrides): Promise<string>;
  };

  filters: {};

  estimateGas: {
    getBondedValidatorInfos(overrides?: CallOverrides): Promise<BigNumber>;

    getDelegatorInfos(_delAddr: string, overrides?: CallOverrides): Promise<BigNumber>;

    getDelegatorTokens(_delAddr: string, overrides?: CallOverrides): Promise<BigNumber>;

    getMinValidatorTokens(overrides?: CallOverrides): Promise<BigNumber>;

    getValidatorInfo(_valAddr: string, overrides?: CallOverrides): Promise<BigNumber>;

    getValidatorInfos(overrides?: CallOverrides): Promise<BigNumber>;

    shouldBondValidator(_valAddr: string, overrides?: CallOverrides): Promise<BigNumber>;

    staking(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    getBondedValidatorInfos(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getDelegatorInfos(_delAddr: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getDelegatorTokens(_delAddr: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getMinValidatorTokens(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getValidatorInfo(_valAddr: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getValidatorInfos(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    shouldBondValidator(_valAddr: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    staking(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
