import { useCallback, useState, useEffect, useContext } from "react";
import { Card, Avatar, Button, Typography, Modal, Tooltip, Checkbox } from "antd";
import { InfoCircleOutlined, LinkOutlined, WarningFilled } from "@ant-design/icons";
import { createUseStyles } from "react-jss";
import { BigNumber } from "ethers";
import { useHistory } from "react-router-dom";
import { formatUnits, getAddress } from "ethers/lib/utils";
import { formatDecimalPart } from "celer-web-utils/lib/format";
import { Theme } from "../../theme";
import arrTop from "../../images/arrTop.svg";
import arrTopLightIcon from "../../images/arrTopLight.svg";
import { ColorThemeContext } from "../../providers/ThemeProvider";
import { useAppSelector, useAppDispatch } from "../../redux/store";
import { ModalName, openModal } from "../../redux/modalSlice";
import { getNFTBridgeChainList } from "../../redux/gateway";
import { useWeb3Context } from "../../providers/Web3ContextProvider";
import { useContractsContext } from "../../providers/ContractsContextProvider";
import arrowDowm from "../../images/arrow-D.svg";
import NFTSelector from "./NFTSelector";
import NFTChainSelector from "./NFTChainSelector";
import {
  NFTBridgeMode,
  NFTBridgeStatus,
  NFTChain,
  NFTHistory,
  NFTItem,
  S3NFTConfig,
  S3NFTConfigChain,
  S3NFTToken,
} from "../../constants/type";
import { getNetworkById } from "../../constants/network";
import { storageConstants } from "../../constants/const";
import { loadContract } from "../../hooks/customContractLoader";
import { OrigNFT__factory } from "../../typechain/typechain/factories/OrigNFT__factory";
import { OrigNFT } from "../../typechain/typechain/OrigNFT";
import { NFTBridge__factory } from "../../typechain/typechain/factories/NFTBridge__factory";
import { NFTBridge } from "../../typechain/typechain/NFTBridge";
import { setRefreshHistory, switchChain } from "../../redux/transferSlice";
import { MCNNFT } from "../../typechain/typechain/MCNNFT";
import { MCNNFT__factory } from "../../typechain/typechain/factories/MCNNFT__factory";
import { isApeChain } from "../../hooks/useTransfer";
import { ApeTip } from "./ApeTips";

export type NFT_CHAIN_TYPE = "sourceChain" | "destinationChain";

/* eslint-disable no-debugger */

const SOURCE_CHAIN = "sourceChain";
const DESTINATION_CHAIN = "destinationChain";

const useStyles = createUseStyles<string, { isMobile: boolean }, Theme>((theme: Theme) => ({
  nft: {
    display: "flex",
    flexFlow: "column",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  nftCard: {
    position: "relative",
    width: "100%",
    maxWidth: 560,
    marginTop: props => (props.isMobile ? 0 : 45),
    borderRadius: props => (props.isMobile ? 0 : 16),
    background: props => (props.isMobile ? "transparent" : theme.secondBackground),
    border: props => (props.isMobile ? "none" : `1px solid ${theme.primaryBorder}`),
    "& .ant-card-body": {
      padding: props => (props.isMobile ? "18px 16px 24px 16px" : "18px 32px 32px 32px"),
    },
  },
  cardContent: {
    position: "relative",
    width: props => (props.isMobile ? "100%" : 496),
  },
  cardTitle: {
    color: theme.surfacePrimary,
    fontSize: 18,
    lineHeight: "20px",
    fontWeight: 700,
    textAlign: "center",
    marginBottom: 42,
  },
  cardSourceChain: {
    display: "flex",
    flexDirection: "column",
  },
  sourceChainTitle: {
    color: theme.surfacePrimary,
    fontSize: 14,
    lineHeight: "20px",
    fontWeight: 500,
    marginBottom: 8,
  },
  sourceChainSelector: {
    height: 72,
    marginBottom: 6,
    backgroundColor: theme.primaryBackground,
    border: `1px solid ${theme.primaryBorder}`,
    padding: 16,
    borderRadius: 16,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
  },
  sourceChainSelectorDesc: {
    display: "flex",
    alignItems: "center",
  },
  sourceChainSelectorText: {
    color: theme.surfacePrimary,
    fontSize: 16,
    lineHeight: "20px",
    fontWeight: 700,
  },
  nftSelector: {
    height: 72,
    backgroundColor: theme.primaryBackground,
    border: `1px solid ${theme.primaryBorder}`,
    padding: 16,
    borderRadius: 16,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
  },
  nftSelectorDesc: {
    color: theme.surfacePrimary,
    fontSize: 14,
    lineHeight: "20px",
    fontWeight: 500,
  },
  selectedNftSelector: {
    height: 108,
    backgroundColor: theme.primaryBackground,
    border: `1px solid ${theme.primaryBorder}`,
    padding: 12,
    borderRadius: 16,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedNftSelectorDesc: {
    color: theme.surfacePrimary,
    fontSize: 14,
    lineHeight: "20px",
    fontWeight: 500,
    display: "flex",
  },
  selectedNftSelectorDescImg: {
    width: 84,
    height: 84,
    "& img": {
      borderRadius: 8,
      width: "100%",
      height: "100%",
    },
  },
  selectedNftSelectorDescText: {
    marginLeft: 8,
    height: 84,
    color: theme.surfacePrimary,
    fontWeight: 500,
    fontSize: 14,
    lineHeight: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
  },

  addressText: {
    color: theme.nftTextColor,
    cursor: "pointer",
    "&:focus, &:hover": {
      color: "#1890ff",
    },
  },
  cardDestinationChain: {
    display: "flex",
    flexDirection: "column",
    marginTop: 24,
  },
  cardNftBridgeOverview: {
    display: "flex",
    flexDirection: "column",
    marginTop: 24,
    backgroundColor: theme.primaryBackground,
    border: `1px solid ${theme.primaryBorder}`,
    padding: 16,
    borderRadius: 16,
    justifyContent: "space-between",
    alignItems: "center",
  },

  nftOverviewRow: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  },

  nftFeeTitle: {
    fontSize: 12,
    fontWeight: 460,
    color: "#8F9BB3",
  },
  nftFeeText: {
    fontSize: 12,
    fontWeight: 460,
    color: theme.unityWhite,
  },
  destinationChainTitle: {
    color: theme.surfacePrimary,
    fontSize: 14,
    lineHeight: "20px",
    fontWeight: 500,
    marginBottom: 8,
  },
  destinationChainSelector: {
    height: 72,
    marginBottom: 6,
    backgroundColor: theme.primaryBackground,
    border: `1px solid ${theme.primaryBorder}`,
    padding: 16,
    borderRadius: 16,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
  },
  destinationChainSelectorDesc: {
    display: "flex",
    alignItems: "center",
  },
  destinationChainSelectorText: {
    color: theme.surfacePrimary,
    fontSize: 16,
    lineHeight: "20px",
    fontWeight: 700,
  },
  errBlock: {
    width: "100%",
    minHeight: 40,
    marginTop: 24,
    borderRadius: 8,
    backgroundColor: theme.unityWhite,
    boxShadow: "0px 6px 12px -6px rgba(24, 39, 75, 0.12), 0px 8px 24px -4px rgba(24, 39, 75, 0.08)",
    color: theme.textWarning,
    textAlign: "left",
    fontSize: 14,
    lineHeight: "20px",
    fontWeight: 500,
    padding: "10px 12px",
  },
  btn: {
    width: "100%",
    marginTop: 24,
  },
  nftBtn: {
    width: "100%",
    height: 56,
    border: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    backgroundColor: theme.primaryBrand,
    color: theme.unityWhite,
    fontSize: 16,
    lineHeight: "20px",
    fontWeight: 700,
  },
  linkIcon: {
    fontSize: 14,
    marginLeft: 5,
  },
  transferModal: {
    minWidth: props => (props.isMobile ? "100%" : 448),
    background: theme.secondBackground,
    border: `1px solid ${theme.primaryBackground}`,
    "& .ant-modal-content": {
      background: theme.secondBackground,
      boxShadow: props => (props.isMobile ? "none" : ""),
      "& .ant-modal-close": {
        color: theme.surfacePrimary,
      },
      "& .ant-modal-header": {
        background: theme.secondBackground,
        borderBottom: "none",
        "& .ant-modal-title": {
          color: theme.surfacePrimary,
          "& .ant-typography": {
            color: theme.surfacePrimary,
          },
        },
      },
      "& .ant-modal-body": {
        minHeight: 260,
      },
      "& .ant-modal-footer": {
        border: "none",
        "& .ant-btn-link": {
          color: theme.primaryBrand,
        },
      },
    },
    "& .ant-typography": {
      color: theme.surfacePrimary,
    },
  },
  modalToptext2: {
    fontSize: 16,
    width: "100%",
    textAlign: "center",
    fontWeight: 600,
    color: theme.surfacePrimary,
  },
  modalTopIcon: {
    fontSize: 16,
    fontWeight: 600,
    width: "100%",
    textAlign: "center",
    marginTop: props => (props.isMobile ? 18 : 40),
    marginBottom: props => (props.isMobile ? 18 : 40),
    "&img": {
      width: 90,
    },
  },
  modaldes: {
    color: theme.surfacePrimary,
    marginTop: props => (props.isMobile ? 16 : 40),
    fontSize: 15,
    textAlign: "center",
  },
  button: {
    marginTop: props => (props.isMobile ? 16 : 40),
    height: 56,
    lineHeight: "42px",
    background: theme.primaryBrand,
    borderRadius: 16,
    fontSize: 18,
    fontWeight: 500,
    borderWidth: 0,
    "&:focus, &:hover": {
      background: theme.buttonHover,
    },
    "&::before": {
      backgroundColor: `${theme.primaryBrand} !important`,
    },
  },

  tooltipContent: {
    fontSize: 12,
    fontWeight: 400,
    color: theme.unityBlack,
  },

  approveCheckBoxLabel: {
    fontSize: 12,
    color: theme.nftTextColor,
  },

  bottomButtonContainer: {
    display: "flex",
    alignContent: "space-between",
    alignItems: "center",
    gap: 18,
  },
}));

const NFTBridgeTab = () => {
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const classes = useStyles({ isMobile });
  const { signer, chainId, address } = useWeb3Context();
  const dispatch = useAppDispatch();
  const onShowProviderModal = useCallback(() => {
    dispatch(openModal(ModalName.provider));
  }, [dispatch]);
  const [nftChainType, setNftChainType] = useState<NFT_CHAIN_TYPE>(SOURCE_CHAIN);
  const [s3NFTConfigChains, setS3NFTConfigChains] = useState<Array<S3NFTConfigChain>>([]);
  const [nftChains, setNFTChains] = useState<NFTChain[]>([]);
  const [nftList, setNftList] = useState<S3NFTConfig[]>([]);
  const [sourceChain, setSourceChain] = useState<NFTChain>();
  const [dstChain, setDstChain] = useState<NFTChain>();
  const [selectedNFT, setSelectedNFT] = useState<NFTItem>();
  const [nftChainSelectorVisible, setNftChainSelectorVisible] = useState(false);
  const [nftSelectorVisible, setNftSelectorVisible] = useState(false);
  const [nftBridgeMode, setNFTBridgeMode] = useState<NFTBridgeMode>(NFTBridgeMode.UNDEFINED);
  const [isNFTOverviewLoading, setIsNFTOverviewLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [nftApproved, setNFTApproved] = useState(false);
  const [isAllowShowApprovalButton, setIsAllowShowApprovalButton] = useState(false);
  const [nftTokenContract, setNFTTokenContract] = useState<OrigNFT>();
  const [nativeTokenContract, setNativeTokenContract] = useState<MCNNFT>();
  const [brigeContract, setBridgeContract] = useState<NFTBridge>();
  const [totalFee, setTotalFee] = useState<BigNumber>();
  const [dstNFT, setDstNFT] = useState<S3NFTToken>();
  const [showTransferModal, setShowTransferModal] = useState<boolean>(false);
  const [bridgeFee, setBridgeFee] = useState<BigNumber>();
  const [mintNftFee, setNftMintFee] = useState<BigNumber>();
  const [isAllApproveChecked, setAllApproveChecked] = useState(false);

  const { transactor } = useContractsContext();
  const { themeType } = useContext(ColorThemeContext);

  const { transferConfig } = useAppSelector(state => state.transferInfo);
  const { chains } = transferConfig;

  const routeHistory = useHistory();

  const storageNFTHistory = (history: NFTHistory) => {
    const localNFTListJsonStr = localStorage.getItem(storageConstants.KEY_NFT_HISTORY_LIST_JSON);
    let localNFTList: NFTHistory[] = [];
    if (localNFTListJsonStr) {
      localNFTList = JSON.parse(localNFTListJsonStr)[address] || [];
    }
    localNFTList.unshift(history);
    const newJson = { [address]: localNFTList };
    localStorage.setItem(storageConstants.KEY_NFT_HISTORY_LIST_JSON, JSON.stringify(newJson));
  };

  const onBridgeNFT = async (
    _srcChain: NFTChain | undefined,
    _dstChain: NFTChain | undefined,
    _bridgeMode: NFTBridgeMode,
    _hasApproved: boolean,
    _bridgeContract: NFTBridge | undefined,
    _nftTokenContract: OrigNFT | undefined,
    _nativeTokenContract: MCNNFT | undefined,
    _selectedNFT: NFTItem | undefined,
    _dstNFT: S3NFTToken | undefined,
    _totalFee: BigNumber | undefined,
  ) => {
    setButtonLoading(true);
    try {
      if (_srcChain && _dstChain && _bridgeContract && _selectedNFT && _dstNFT && transactor) {
        if (
          _bridgeMode === NFTBridgeMode.PEGGED ||
          _bridgeMode === NFTBridgeMode.BURN ||
          _bridgeMode === NFTBridgeMode.NON_ORIG_BURN
        ) {
          const dstBridge = _dstChain?.addr;
          const value = _totalFee;
          if (dstBridge) {
            let depositTransaction;
            if (isApeChain(_srcChain.chainid)) {
              depositTransaction = await transactor(
                _bridgeContract.sendTo(_selectedNFT.address, _selectedNFT.nftId, _dstChain.chainid, address, {
                  value,
                  gasPrice: 0,
                }),
              );
            } else {
              depositTransaction = await transactor(
                _bridgeContract.sendTo(_selectedNFT.address, _selectedNFT.nftId, _dstChain.chainid, address, { value }),
              );
            }

            const mintHistory: NFTHistory = {
              createdAt: parseInt(`${Date.now() / 1000}`, 10),
              srcChid: _srcChain.chainid,
              dstChid: _dstChain.chainid,
              sender: address,
              receiver: address,
              srcNft: _selectedNFT.address,
              dstNft: _dstNFT.addr,
              tokID: `${_selectedNFT.nftId}`,
              srcTx: depositTransaction.hash,
              dstTx: "",
              status: NFTBridgeStatus.NFT_BRIDEGE_SUBMITTING,
              txIsFailed: false,
            };
            storageNFTHistory(mintHistory);
            setShowTransferModal(true);
          }
        } else if (_bridgeMode === NFTBridgeMode.NATIVE && _nativeTokenContract) {
          const value = _totalFee;
          const crossChainTx = await transactor(
            _nativeTokenContract["crossChain(uint64,uint256,address)"](_dstChain.chainid, _selectedNFT.nftId, address, {
              value,
            }),
          );

          const crossChainHistory: NFTHistory = {
            createdAt: parseInt(`${Date.now() / 1000}`, 10),
            srcChid: _srcChain.chainid,
            dstChid: _dstChain.chainid,
            sender: address,
            receiver: address,
            srcNft: _selectedNFT.address,
            dstNft: _dstNFT.addr,
            tokID: `${_selectedNFT.nftId}`,
            srcTx: crossChainTx.hash,
            dstTx: "",
            status: NFTBridgeStatus.NFT_BRIDEGE_SUBMITTING,
            txIsFailed: false,
          };

          storageNFTHistory(crossChainHistory);
          setShowTransferModal(true);
        }
      }
    } catch (error) {
      console.error(error);
      setButtonLoading(false);
    }

    setButtonLoading(false);
  };

  const approve = async (
    _srcChain: NFTChain | undefined,
    _selectedNFT: NFTItem | undefined,
    _nftTokenContract: OrigNFT | undefined,
    _hasApproved: boolean,
  ) => {
    if (!_hasApproved && _srcChain && transactor && _selectedNFT) {
      setApproveLoading(true);

      try {
        if (_nftTokenContract) {
          if (isAllApproveChecked) {
            let approveTx;
            if (isApeChain(_srcChain.chainid)) {
              approveTx = await transactor(_nftTokenContract?.setApprovalForAll(_srcChain.addr, true, { gasPrice: 0 }));
            } else {
              approveTx = await transactor(_nftTokenContract?.setApprovalForAll(_srcChain.addr, true));
            }

            await approveTx.wait();
            setNFTApproved(true);
            setIsAllowShowApprovalButton(true);
            setApproveLoading(false);
            return;
          }

          let approveTx;
          if (isApeChain(_srcChain.chainid)) {
            approveTx = await transactor(
              _nftTokenContract.approve(_srcChain.addr, _selectedNFT.nftId, { gasPrice: 0 }),
            );
          } else {
            approveTx = await transactor(_nftTokenContract.approve(_srcChain.addr, _selectedNFT.nftId));
          }
          await approveTx.wait();

          setNFTApproved(true);
          setIsAllowShowApprovalButton(true);
          setApproveLoading(false);
        }
      } catch (e) {
        setApproveLoading(false);
      }
    }
  };

  useEffect(() => {
    let isMounted = true; 

    getNFTBridgeChainList().then(res => {
      if (isMounted) {
        setS3NFTConfigChains(res.bridges);
        console.debug("nfts>>>", JSON.stringify(res.nfts))
        setNftList(res.nfts);
      }
      return () => { isMounted = false };
    });
  }, []);

  useEffect(() => {
    if (!s3NFTConfigChains || s3NFTConfigChains.length === 0 || !chains || chains.length === 0) {
      return;
    }
    const nftChainList: NFTChain[] = [];
    s3NFTConfigChains.forEach(configChain => {
      const chain = chains.find(it => it.id === configChain.chainid);
      if(chain && chain.id === configChain.chainid) {
        nftChainList.push({
          chainid: configChain.chainid,
          addr: configChain.addr,
          icon: chain.icon,
          name: chain.name,
        });
      }
    });
    setNFTChains(nftChainList);
  }, [s3NFTConfigChains, chains]);

  const getDstChainInChainPair = (sourceChainId: number): number | undefined => {
    if (sourceChainId) {
      const selectedChainPairStr = localStorage.getItem(storageConstants.KEY_NFT_CHAIN_PAIR);
      if (selectedChainPairStr) {
        const selectedChainPair = JSON.parse(selectedChainPairStr);
        const { lastSrcChainId, lastDstChainId } = selectedChainPair;

        if (lastSrcChainId && sourceChainId === Number(lastDstChainId)) {
          return lastSrcChainId;
        }
      }
    }
    return undefined;
  };

  // handle chain default logic
  useEffect(() => {
    if (nftChains.length === 0) {
      return;
    }

    const defaultToWalletChain = nftChains.find(it => it.chainid === chainId);
    let finalDefaultSrcChain: NFTChain | undefined;
    if (defaultToWalletChain) {
      finalDefaultSrcChain = defaultToWalletChain;
    } else {
      const savedSrcNFTChainId = localStorage.getItem(storageConstants.KEY_NFT_SRC_CHAIN_ID);
      if (savedSrcNFTChainId && savedSrcNFTChainId !== "undefined") {
        const defaultSrcChain = nftChains.find(it => it.chainid === Number(savedSrcNFTChainId));
        finalDefaultSrcChain = defaultSrcChain;
      } else {
        finalDefaultSrcChain = nftChains[0];
      }
    }
    setSourceChain(finalDefaultSrcChain);
    localStorage.setItem(storageConstants.KEY_NFT_SRC_CHAIN_ID, `${finalDefaultSrcChain?.chainid}`);

    let finalDefaultDstChain: NFTChain | undefined;
    const savedDstNFTChainId = localStorage.getItem(storageConstants.KEY_NFT_DST_CHAIN_ID);
    if (savedDstNFTChainId && savedDstNFTChainId !== "undefined") {
      if (finalDefaultSrcChain && finalDefaultSrcChain.chainid === Number(savedDstNFTChainId)) {
        const dstChainInPair = getDstChainInChainPair(finalDefaultSrcChain.chainid);
        if (dstChainInPair) {
          finalDefaultDstChain = nftChains.find(it => it.chainid === Number(dstChainInPair));
        } else {
          finalDefaultDstChain = nftChains.find(it => it.chainid === Number(savedDstNFTChainId));
        }
      } else {
        finalDefaultDstChain = nftChains.find(it => it.chainid === Number(savedDstNFTChainId));
      }
    } else if (nftChains[1]?.chainid === finalDefaultSrcChain?.chainid) {
      finalDefaultDstChain = nftChains[0];
    } else {
      finalDefaultDstChain = nftChains[1];
    }

    const targetDestinationChainIds = new Set<number>()
    targetDestinationChainIds.add(chainId)

    nftList.forEach(nftConfig => {
      let ids: number[] = []

      if (nftConfig.orig) {
        ids.push(nftConfig.orig.chainid)
      } 

      ids = ids.concat(nftConfig.pegs.map(item => {
        return item.chainid
      }))

      if (ids.includes(chainId)) {
        ids.forEach(id => {
          targetDestinationChainIds.add(id)
        })
      }
    })

    targetDestinationChainIds.delete(chainId)

    if (!targetDestinationChainIds.has(finalDefaultDstChain?.chainid ?? 0)) {
      finalDefaultDstChain = nftChains.find(nftChain => {
        return targetDestinationChainIds.has(nftChain.chainid)
      }) ?? finalDefaultDstChain
    }

    setDstChain(finalDefaultDstChain);
    localStorage.setItem(storageConstants.KEY_NFT_DST_CHAIN_ID, `${finalDefaultDstChain?.chainid}`);
  }, [chainId, nftChains, nftList]);

  useEffect(() => {
    // save selected chain pair
    if (sourceChain && dstChain) {
      localStorage.setItem(
        storageConstants.KEY_NFT_CHAIN_PAIR,
        JSON.stringify({
          lastSrcChainId: localStorage.getItem(storageConstants.KEY_NFT_SRC_CHAIN_ID) ?? 0,
          lastDstChainId: localStorage.getItem(storageConstants.KEY_NFT_DST_CHAIN_ID ?? 0),
        }),
      );
    }
  }, [sourceChain, dstChain]);

  const getPegNFT = (nftConfigs: S3NFTConfig[], _selectedNFT: NFTItem, _sourceChainId: number, _dstChainId: number) => {
    const pegPairs = nftConfigs.filter(
      nftItem =>
        nftItem.orig && nftItem.orig.chainid === _sourceChainId && nftItem.pegs.find(it => it.chainid === _dstChainId),
    );
    if (pegPairs && pegPairs.length > 0) {
      const selectedPegPair = pegPairs.find(
        pegPair => getAddress(pegPair.orig.addr) === getAddress(_selectedNFT?.address),
      );
      const pegNFT = selectedPegPair?.pegs.find(it => it.chainid === _dstChainId);
      return pegNFT;
    }
    return undefined;
  };

  const getBurnNFT = (
    nftConfigs: S3NFTConfig[],
    _selectedNFT: NFTItem,
    _sourceChainId: number,
    _dstChainId: number,
  ) => {
    const burnPairs = nftConfigs.filter(
      nftItem => nftItem.pegs.find(it => it.chainid === _sourceChainId) && nftItem?.orig?.chainid === _dstChainId,
    );
    if (burnPairs && burnPairs.length > 0) {
      const selectedBurnNFT = burnPairs.find(burnPair =>
        burnPair.pegs.find(it => getAddress(it.addr) === getAddress(_selectedNFT?.address)),
      );
      return selectedBurnNFT?.orig;
    }
    return undefined;
  };

  const getRemoteMintNFT = (
    nftConfigs: S3NFTConfig[],
    _selectedNFT: NFTItem,
    _sourceChainId: number,
    _dstChainId: number,
  ): S3NFTToken | undefined => {
    let dstNFTToken;
    nftConfigs.forEach(nftConfig => {
      if (nftConfig.orig) {
        const pegs = nftConfig.pegs;
        // selected nft address exsits in pegs array
        const pegOnSourceChain = pegs?.find(
          it => it.chainid === _sourceChainId && getAddress(it.addr) === getAddress(_selectedNFT.address),
        );
        const pegOnDstChain = pegs?.find(it => it.chainid === _dstChainId);

        if (pegOnSourceChain && pegOnDstChain) {
          dstNFTToken = pegOnDstChain;
        }
      }
    });
    return dstNFTToken;
  };

  const getNativeNFTPairs = (
    nftConfigs: S3NFTConfig[],
    _selectedNFT: NFTItem,
    _srcChainId: number,
    _dstChainId: number,
  ) => {
    // get config which selected nft exists
    const getNativeConfig = nftConfigs.find(item => item.pegs.find(it => _selectedNFT.address === it.addr));
    const srcNativeNFT = getNativeConfig?.pegs.find(nftItem => nftItem.chainid === _srcChainId);
    const dstNativeNFT = getNativeConfig?.pegs.find(nftItem => nftItem.chainid === _dstChainId);
    return { srcNativeNFT, dstNativeNFT };
  };

  // determine nft bridge mode according to src & dst chain
  useEffect(() => {
    if (!sourceChain || !dstChain || nftChains.length === 0 || !selectedNFT || !signer || nftList.length === 0) {
      return;
    }

    const getBridgeMode = (): { mode: NFTBridgeMode; dstToken: S3NFTToken | undefined } => {
      if (selectedNFT.isNativeNft) {
        const nativeTokenPairs = getNativeNFTPairs(nftList, selectedNFT, sourceChain.chainid, dstChain.chainid);
        const dstNativeNFT = nativeTokenPairs.dstNativeNFT;
        return { mode: NFTBridgeMode.NATIVE, dstToken: dstNativeNFT };
      }

      const pegNFT = getPegNFT(nftList, selectedNFT, sourceChain.chainid, dstChain.chainid);
      if (pegNFT) {
        return { mode: NFTBridgeMode.PEGGED, dstToken: pegNFT };
      }

      const burnNFT = getBurnNFT(nftList, selectedNFT, sourceChain.chainid, dstChain.chainid);
      if (burnNFT) {
        return { mode: NFTBridgeMode.BURN, dstToken: burnNFT };
      }

      const remoteMintNFT = getRemoteMintNFT(nftList, selectedNFT, sourceChain.chainid, dstChain.chainid);
      if (remoteMintNFT) {
        return { mode: NFTBridgeMode.NON_ORIG_BURN, dstToken: remoteMintNFT };
      }
      return { mode: NFTBridgeMode.UNDEFINED, dstToken: undefined };
    };

    const { mode, dstToken } = getBridgeMode();

    console.debug("bridgeMode:", mode);
    setNFTBridgeMode(mode);

    const tokenAddress = selectedNFT.address;
    setDstNFT(dstToken);

    const prepareTask = async () => {
      if (tokenAddress && signer && address && nftBridgeMode !== NFTBridgeMode.UNDEFINED) {
        setButtonLoading(true);

        let approved;
        let isApprovedForAll;
        if (nftBridgeMode === NFTBridgeMode.NATIVE) {
          const selectedNftTokenContract = (await loadContract(signer, tokenAddress, MCNNFT__factory)) as MCNNFT;
          setNativeTokenContract(selectedNftTokenContract);
          approved = true;
          isApprovedForAll = true;
        } else {
          const selectedNftTokenContract = (await loadContract(signer, tokenAddress, OrigNFT__factory)) as OrigNFT;
          setNFTTokenContract(selectedNftTokenContract);
          const getApprovedContract = await selectedNftTokenContract.getApproved(selectedNFT.nftId);
          approved = getAddress(getApprovedContract) === getAddress(sourceChain.addr);
          isApprovedForAll = await selectedNftTokenContract.isApprovedForAll(address, sourceChain.addr);
        }
        setAllApproveChecked(isApprovedForAll);
        if (approved || isApprovedForAll) {
          setNFTApproved(true);
          setIsAllowShowApprovalButton(false);
          // setButtonLoading(false);
          // setNFTBridgeButtonEnbale(true);
        } else {
          setNFTApproved(false);
          setIsAllowShowApprovalButton(true);
        }

        // get totalFee
        const srcBridgeContract = (await loadContract(signer, sourceChain.addr, NFTBridge__factory)) as NFTBridge;
        const onChainTotalFee = await srcBridgeContract.totalFee(
          dstChain.chainid,
          selectedNFT.address,
          selectedNFT.nftId,
        );
        const mintFeeTemp = await srcBridgeContract.destTxFee(dstChain.chainid);
        const bridgeFeeTemp = onChainTotalFee.sub(mintFeeTemp);
        setNftMintFee(mintFeeTemp);
        setBridgeFee(bridgeFeeTemp);
        setTotalFee(onChainTotalFee);
        setBridgeContract(srcBridgeContract);
        setIsNFTOverviewLoading(true);
        setButtonLoading(false);
      }
    };

    prepareTask();
  }, [selectedNFT, sourceChain, dstChain, nftChains, signer, address, nftList, nftBridgeMode]);

  const onNFTSelected = nftInfo => {
    setSelectedNFT(nftInfo);
    setNftSelectorVisible(false);
    setIsNFTOverviewLoading(false);
  };

  const selectChain = (nftChain: NFTChain) => {
    if (nftChainType === SOURCE_CHAIN) {
      setNftChainSelectorVisible(false);
      if (chainId !== nftChain.chainid) {
        switchChain(nftChain.chainid, "", () => {});
      }
    } else if (nftChainType === DESTINATION_CHAIN) {
      setDstChain(nftChain);
      setNftChainSelectorVisible(false);
      localStorage.setItem(storageConstants.KEY_NFT_DST_CHAIN_ID, `${nftChain.chainid}`);
    }
  };

  const openChainSeletor = (chainType: NFT_CHAIN_TYPE) => {
    setNftChainType(chainType);
    setNftChainSelectorVisible(true);
  };

  const renderNTFInfo = () => {
    if (selectedNFT) {
      let explorerUrl = getNetworkById(sourceChain?.chainid ?? 0).blockExplorerUrl;
      const index = explorerUrl.lastIndexOf("\\/");
      if (index > 0) {
        explorerUrl = explorerUrl.substring(0, index);
      }
      const openNFTURL = e => {
        e.stopPropagation();
        window.open(`${explorerUrl}/token/${selectedNFT.address}`, "_blank");
      };

      return (
        <div
          className={classes.selectedNftSelector}
          onClick={() => {
            setNftSelectorVisible(true);
          }}
        >
          <div className={classes.selectedNftSelectorDesc}>
            <div className={classes.selectedNftSelectorDescImg}>
              <img src={selectedNFT.img} alt="nftLOGO" />
            </div>
            <div className={classes.selectedNftSelectorDescText}>
              <div>{selectedNFT.name}</div>
              <div>{selectedNFT.tokenName}</div>
              <div>ID: {selectedNFT.nftId} </div>
              <div onClick={openNFTURL} className={classes.addressText}>
                <Typography.Text className={classes.addressText} ellipsis={{ suffix: selectedNFT.address.slice(-4) }}>
                  {selectedNFT.address.substr(0, 6) + "..."}
                </Typography.Text>
                <LinkOutlined className={classes.linkIcon} />
              </div>
            </div>
          </div>
          <div className={classes.selectedNftSelectorMore}>
            <img src={arrowDowm} alt="more destination chain" />
          </div>
        </div>
      );
    }
    return (
      <div
        className={classes.nftSelector}
        onClick={() => {
          setNftSelectorVisible(true);
        }}
      >
        <div className={classes.nftSelectorDesc}>Select an NFT</div>
        <div className={classes.nftSelectorMore}>
          <img src={arrowDowm} alt="more destination chain" />
        </div>
      </div>
    );
  };

  const renderErrorMsg = () => {
    if (chainId && sourceChain?.chainid !== chainId) {
      return (
        <div className={classes.errBlock}>
          <WarningFilled style={{ fontSize: 20, marginRight: 11, color: "#ffaa00" }} />
          <span style={{ color: "#17171A" }}>
            You must switch to{" "}
            {isMobile ? (
              <span style={{ fontWeight: "bold" }}>{sourceChain?.name} </span>
            ) : (
              // eslint-disable-next-line
              <a 
                style={{ fontWeight: "bold" }}
                // eslint-disable-next-line
                onClick={() => {
                  switchChain(sourceChain?.chainid, "", targetChainId => {
                    console.debug(`switched chain to ${targetChainId}`);
                    routeHistory.push("nft");
                  });
                }}
              >
                {sourceChain?.name}{" "}
              </a>
            )}
            to bridge your NFT.
          </span>
        </div>
      );
    }
    return null;
  };

  const renderBtn = () => {
    if (!signer) {
      return (
        <Button type="primary" onClick={onShowProviderModal} className={classes.nftBtn}>
          Connect Wallet
        </Button>
      );
    }
    return (
      <div className={classes.bottomButtonContainer}>
        {isAllowShowApprovalButton && isNFTOverviewLoading && nftBridgeMode !== NFTBridgeMode.NATIVE && (
          <Button
            type="primary"
            onClick={() => approve(sourceChain, selectedNFT, nftTokenContract, nftApproved)}
            className={classes.nftBtn}
            disabled={!isNFTOverviewLoading || !selectedNFT || nftApproved}
            loading={approveLoading}
          >
            <div>
              <Tooltip
                overlayClassName={isMobile ? classes.mobileTooltipOverlayStyle : undefined}
                title={
                  <div className={classes.tooltipContent} style={{ whiteSpace: "pre-line" }}>
                    {`You must give smart contracts permission to use your ${selectedNFT?.tokenName}, which is an on-chain tx that consumes gas. `}
                  </div>
                }
                placement="bottom"
                arrowPointAtCenter
                color="#fff"
                overlayInnerStyle={{ color: "#000", width: 265 }}
              >
                <InfoCircleOutlined style={{ fontSize: 13, marginLeft: 6 }} />
              </Tooltip>
              <span> Approve NFT</span>
            </div>
          </Button>
        )}

        <Button
          type="primary"
          onClick={() =>
            onBridgeNFT(
              sourceChain,
              dstChain,
              nftBridgeMode,
              nftApproved,
              brigeContract,
              nftTokenContract,
              nativeTokenContract,
              selectedNFT,
              dstNFT,
              totalFee,
            )
          }
          className={classes.nftBtn}
          disabled={!selectedNFT || !isNFTOverviewLoading || !nftApproved}
          loading={buttonLoading}
        >
          Bridge NFT
        </Button>
      </div>
    );
  };

  const renderApproveCheckBox = () => {
    if (!selectedNFT || nftApproved) {
      return <div />;
    }
    return (
      <div style={{ marginTop: "20px" }}>
        <Checkbox
          checked={isAllApproveChecked}
          onChange={() => {
            setAllApproveChecked(!isAllApproveChecked);
          }}
        >
          <div className={classes.approveCheckBoxLabel}>
            Approve all NFTs in the collection
            <Tooltip
              overlayClassName={isMobile ? classes.mobileTooltipOverlayStyle : undefined}
              title={
                <div className={classes.tooltipContent} style={{ whiteSpace: "pre-line" }}>
                  {`By checking this box, you will give the smart contract permission to bridge all your NFTs in the ${selectedNFT.tokenName} collection so that you don't need to approve again next time.`}
                </div>
              }
              placement="bottom"
              arrowPointAtCenter
              color="#fff"
              overlayInnerStyle={{ color: "#000", width: 265 }}
            >
              <InfoCircleOutlined style={{ fontSize: 13, marginLeft: 6 }} />
            </Tooltip>
          </div>
        </Checkbox>
      </div>
    );
  };

  const clearData = () => {
    setSelectedNFT(undefined);
    setDstNFT(undefined);
    setTotalFee(undefined);
    setBridgeFee(undefined);
    setNftMintFee(undefined);
    setNFTApproved(false);
    setAllApproveChecked(false);
  };

  const onSuccess = () => {
    clearData();
    dispatch(setRefreshHistory(true));
  };

  let chainList: NFTChain[] = [];

  if (nftChainType === "sourceChain") {
    chainList = nftChains;
  } else {
    nftChains.forEach(item => {
      if (item.chainid !== sourceChain?.chainid) {
        chainList.push(item);
      }
    });
  }

  const openDstNFTURL = e => {
    e.stopPropagation();
    let explorerUrl = getNetworkById(dstChain?.chainid ?? 0).blockExplorerUrl;
    const index = explorerUrl.lastIndexOf("\\/");
    if (index > 0) {
      explorerUrl = explorerUrl.substring(0, index);
    }
    if (dstNFT) {
      window.open(`${explorerUrl}/token/${dstNFT.addr}`, "_blank");
    }
  };

  const srcChainInfo = getNetworkById(sourceChain?.chainid ?? 5);
  const formattedTotalFee = totalFee ? formatUnits(totalFee, 18) : undefined;
  const formattedMintFee = mintNftFee ? formatUnits(mintNftFee, 18) : undefined;
  const fomarttedBridgeFee = bridgeFee ? formatUnits(bridgeFee, 18) : undefined;

  return (
    <div className={classes.nft}>
      <Card className={classes.nftCard} bordered={false}>
        <div className={classes.cardContent}>
          {sourceChain && isApeChain(sourceChain.chainid) && isMobile ? <ApeTip /> : <></>}

          {isMobile ? <></> : <div className={classes.cardTitle}>NFT Bridge</div>}

          <div className={classes.cardSourceChain}>
            <div className={classes.sourceChainTitle}>Source Chain</div>
            <div className={classes.sourceChainSelector} onClick={() => openChainSeletor(SOURCE_CHAIN)}>
              <div className={classes.sourceChainSelectorDesc}>
                <Avatar size={40} src={sourceChain?.icon} style={{ marginRight: 12, color: "red" }} />
                <span className={classes.sourceChainSelectorText}>{sourceChain?.name}</span>
              </div>
              <div className={classes.sourceChainSelectorMore}>
                <img src={arrowDowm} alt="more source chain" />
              </div>
            </div>
            {renderNTFInfo()}
          </div>
          <div className={classes.cardDestinationChain}>
            <div className={classes.destinationChainTitle}>Destination Chain</div>
            <div className={classes.destinationChainSelector} onClick={() => openChainSeletor(DESTINATION_CHAIN)}>
              <div className={classes.destinationChainSelectorDesc}>
                <Avatar size={40} src={dstChain?.icon} style={{ marginRight: 12, color: "red" }} />
                <span className={classes.destinationChainSelectorText}>{dstChain?.name}</span>
              </div>
              <div className={classes.destinationChainSelectorMore}>
                <img src={arrowDowm} alt="more destination chain" />
              </div>
            </div>
          </div>
          {/* bridge overview */}
          {formattedMintFee && fomarttedBridgeFee && formattedTotalFee && dstNFT ? (
            <div className={classes.cardNftBridgeOverview}>
              <div className={classes.nftOverviewRow} style={{ marginBottom: 6 }}>
                <div className={classes.nftFeeTitle}>
                  Fee
                  <Tooltip
                    overlayClassName={isMobile ? classes.mobileTooltipOverlayStyle : undefined}
                    title={
                      <div className={classes.tooltipContent} style={{ whiteSpace: "pre-line" }}>
                        <span style={{ fontWeight: 700 }}>NFT mint fee</span>
                        {`: ${formatDecimalPart(formattedMintFee || "0", 8, "round", true)} ${srcChainInfo.symbol}
                      `}
                        <span style={{ fontWeight: 700 }}>NFT bridge fee</span>
                        {`: ${formatDecimalPart(fomarttedBridgeFee || "0", 8, "round", true)} ${srcChainInfo.symbol}\n
                      `}
                        {`The NFT mint fee is used to cover the gas cost on ${dstChain?.name}.\n`}
                        The NFT bridge fee is paid to SGN for securing the bridge service.
                      </div>
                    }
                    placement="bottom"
                    arrowPointAtCenter
                    color="#fff"
                    overlayInnerStyle={{ color: "#000", width: 265 }}
                  >
                    <InfoCircleOutlined style={{ fontSize: 13, marginLeft: 6 }} />
                  </Tooltip>
                </div>
                <span className={classes.nftFeeText}>
                  {formatDecimalPart(formattedTotalFee || "0", 8, "round", true)} {srcChainInfo.symbol}
                </span>
              </div>

              <div className={classes.nftOverviewRow} style={{ marginBottom: 6 }}>
                <div className={classes.nftFeeTitle}>Estimated Time of Arrival</div>
                <span className={classes.nftFeeText}>5-20 minutes</span>
              </div>

              <div className={classes.nftOverviewRow}>
                <div className={classes.nftFeeTitle}>Destination Token Address</div>
                <div onClick={openDstNFTURL} className={classes.nftFeeText}>
                  <Typography.Text className={classes.addressText} ellipsis={{ suffix: dstNFT.addr.slice(-4) }}>
                    {dstNFT.addr.substr(0, 6) + "..."}
                  </Typography.Text>
                  <LinkOutlined className={classes.linkIcon} />
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>

        <div>{renderErrorMsg()}</div>
        <div>{renderApproveCheckBox()}</div>
        <div className={classes.btn}>{renderBtn()}</div>
      </Card>
      <NFTChainSelector
        nftChainType={nftChainType}
        nftChains={chainList}
        visible={nftChainSelectorVisible}
        sourceChain = {sourceChain}
        nftList = {nftList}
        onCancel={() => {
          setNftChainSelectorVisible(false);
        }}
        onSelectChain={selectChain}
      />
      <NFTSelector
        s3ConfigNFTs={nftList}
        visible={nftSelectorVisible}
        onCancel={() => {
          setNftSelectorVisible(false);
        }}
        onNFTSelected={onNFTSelected}
      />

      <Modal
        title=""
        onCancel={() => {}}
        visible={showTransferModal}
        footer={null}
        className={classes.transferModal}
        maskClosable={false}
      >
        <div>
          <div className={classes.modalTopIcon} style={{ marginTop: 80 }}>
            <img src={themeType === "dark" ? arrTop : arrTopLightIcon} height="120" alt="" />
          </div>
          <div className={classes.modalToptext2}>Transfer Submitted.</div>
          <div className={classes.modaldes}>
            Please allow 5-20 minutes for the NFT to arrive at your wallet on {dstChain?.name}.
          </div>
          <Button
            type="primary"
            size="large"
            block
            // loading={loading}
            onClick={() => {
              setShowTransferModal(false);
              onSuccess();
            }}
            className={classes.button}
          >
            Done
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default NFTBridgeTab;
