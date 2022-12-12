import { Input, List, Modal, Typography } from "antd";
import { FC, useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { BigNumber } from "ethers";
import { LinkOutlined } from "@ant-design/icons";
import { getAddress } from "ethers/lib/utils";
import { useConfigContext } from "../../providers/ConfigContextProvider";
import { useWeb3Context } from "../../providers/Web3ContextProvider";
import { Theme } from "../../theme";
import ringBell from "../../images/ringBell.svg";
import ActionTitle from "../../components/common/ActionTitle";
import { NFTItem, S3NFTConfig } from "../../constants/type";
import { OrigNFT } from "../../typechain/typechain/OrigNFT";
import { readOnlyContract } from "../../hooks/customReadyOnlyContractLoader";
import { OrigNFT__factory } from "../../typechain/typechain/factories/OrigNFT__factory";
import { getNetworkById } from "../../constants/network";
import { MCNNFT__factory } from "../../typechain/typechain/factories/MCNNFT__factory";
import { MCNNFT } from "../../typechain/typechain/MCNNFT";
import { getNFTList, getTokenUriMetaDataJson } from "../../redux/gateway";
import { getNFTHttpUri } from "../../hooks/useNFTTokenUri";
import { useAppSelector } from "../../redux/store";

const useStyles = createUseStyles<string, { isMobile: boolean }, Theme>((theme: Theme) => ({
  listItem: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    padding: "10px 0",
    color: theme.secondBrand,
  },
  itemContainer: {
    cursor: "pointer",
    overflow: "hidden",
    borderRadius: 16,
    background: theme.chainBg,
    "&:hover": {
      background: theme.primaryBorder,
      transition: "ease 0.2s",
    },
  },
  activeItemContainer: {
    composes: ["item"],
    background: theme.chainBg,
    border: `1px solid ${theme.primaryBrand} !important`,
    transition: "ease 0.2s",
    borderRadius: 16,
    "& div": {
      color: theme.surfacePrimary,
    },
  },
  nftInfo: {
    display: "flex",
    alignItems: "left",
    flexDirection: "column",
    marginLeft: 8,
  },
  nftInfoText: {
    fontSize: 13,
    color: theme.nftTextColor,
    opacity: 0.6,
  },
  nftModal: {
    width: "100%",
    minWidth: props => (props.isMobile ? "100%" : 624),
    background: theme.secondBackground,
    border: props => (props.isMobile ? 0 : `1px solid ${theme.selectChainBorder}`),
    "& .ant-modal-content": {
      background: theme.secondBackground,
      boxShadow: props => (props.isMobile ? "none" : ""),
    },
    "& .ant-modal-body": {
      padding: "0 !important",
    },
    "& .ant-modal": {
      background: theme.secondBackground,
    },
    "& .ant-modal-header": {
      background: `${theme.secondBackground} !important`,
    },
  },
  card: {
    background: theme.secondBackground,
    width: "100%",
    paddingBottom: 15,
    "@global": {
      ".ant-list-item": {
        padding: "10px 12px",
      },
      ".ant-list-item-meta-title": {
        fontSize: 16,
        marginBottom: 0,
      },
      ".ant-list-item-meta-description": {
        fontSize: 12,
      },
    },
    "&.ant-card": {
      height: "100%",
    },
    "& .ant-card-body": {
      padding: 0,
      overflow: "hidden",
    },

    "& .ant-list-item": {
      border: `1px solid ${theme.primaryBorder} `,
      borderWidth: "1px !important",
    },
    "& .ant-list-split .ant-list-item:last-child": {
      border: `1px solid ${theme.primaryBorder} `,
    },

    "& .ant-list-item-meta": {
      alignItems: "center",
    },
    "& .ant-card-head-title": {
      padding: "24px 0",
    },
  },

  nftModalWrap: {
    zIndex: 1001,
  },

  search: {
    margin: 16,
    "& .ant-input": {
      fontSize: 14,
      background: theme.secondBackground,
      color: theme.secondBrand,
    },
    "& .ant-input-affix-wrapper:not(.ant-input-affix-wrapper-disabled):hover": {
      borderColor: "#1890ff",
    },
    "& .ant-input-affix-wrapper:focus, .ant-input-affix-wrapper-focused": {
      borderColor: "#1890ff",
    },
  },
  searchinput: {
    width: "100%",
    height: 48,
    borderRadius: 100,
    border: "1px solid #4e4c4c",
    background: theme.secondBackground,
  },
  moreOptionNote: {
    margin: 16,
    minHeight: 56,
    borderRadius: 16,
    padding: "8px, 12px, 8px, 12px",
    background: theme.chainBg,
    boxShadow: "0px 6px 12px -6px rgba(24, 39, 75, 0.12), 0px 8px 24px -4px rgba(24, 39, 75, 0.08)",
    display: "flex",
    alignItems: "center",
  },
  moreOptionIcon: {
    margin: 17,
  },
  content: {
    maxHeight: 485,
    overflowY: "auto",
    padding: "0 16px",

    "& .ant-list, .ant-spin-nested-loading, .ant-spin-container, .ant-list-empty-text": {
      color: theme.unityWhite,
    },
  },
  nftImg: {
    borderRadius: 8,
    height: 84,
    width: 84,
  },
  linkIcon: {
    fontSize: 14,
    marginLeft: 5,
  },
  addressText: {
    color: theme.nftTextColor,
    cursor: "pointer",
    opacity: 0.75,
    fontSize: 13,
    "&:focus, &:hover": {
      color: "#1890ff",
      opacity: 1,
    },
  },
  nftTitle: {
    fontSize: 13,
    color: theme.nftTextColor,
  },
}));

/* eslint-disable no-debugger */

interface IProps {
  visible: boolean;
  //   onSelectChain: (tokenId: number) => void;
  onCancel: () => void;
  s3ConfigNFTs: S3NFTConfig[];
  onNFTSelected: (nftItem) => void;
}

const NFTSelector: FC<IProps> = ({ visible, onCancel, s3ConfigNFTs, onNFTSelected }) => {
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const classes = useStyles({ isMobile });
  const [NFTList, setNFTList] = useState<NFTItem[]>([]);
  const { getRpcUrlByChainId } = useConfigContext();
  const [listLoading, setListLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterNFTList, setFilterNFTList] = useState<NFTItem[]>([]);
  const { provider, chainId, address } = useWeb3Context();
  const [nftAddresses, setNftAddress] = useState<string[]>();
  const [userAllNftIds, setUserAllNftIds] = useState<Array<{ addr: string; ids: Array<number> } | undefined>>([]);

  const onInputChange = e => {
    setSearchText(e.target.value?.toLowerCase());
  };

  useEffect(() => {
    if (NFTList.length > 0 && searchText.length > 0) {
      const list = NFTList.filter(nftItem => {
        return (
          nftItem.name.toLocaleLowerCase().indexOf(searchText) > -1 ||
          nftItem.nftId.toString().toLowerCase().indexOf(searchText) > -1 ||
          nftItem.address.toLowerCase().indexOf(searchText) > -1
        );
      });
      setFilterNFTList(list);
    }
  }, [NFTList, searchText]);

  // get all corrresponding chain id nft address
  useEffect(() => {
    if (!s3ConfigNFTs || s3ConfigNFTs.length === 0 || !chainId || !address) {
      return;
    }

    if (s3ConfigNFTs.length === 0) {
      return;
    }

    const selectedNftAddresses: Array<string> = [];
    s3ConfigNFTs.forEach(s3NFTConfigItem => {
      if (s3NFTConfigItem?.orig && s3NFTConfigItem.orig.chainid === chainId) {
        selectedNftAddresses.push(getAddress(s3NFTConfigItem.orig.addr));
      }

      if (s3NFTConfigItem?.pegs) {
        const pegAddress = s3NFTConfigItem.pegs
          .filter(item => item.chainid === chainId)
          ?.map(filteredItem => getAddress(filteredItem.addr));

        if (pegAddress && pegAddress.length > 0) {
          selectedNftAddresses.push(...pegAddress);
        }
      }
    });

    setNftAddress(selectedNftAddresses);
  }, [s3ConfigNFTs, chainId, address]);

  // get owner ids from api
  useEffect(() => {
    if (!chainId || !address || !nftAddresses || nftAddresses.length === 0) {
      return;
    }

    // eslint-disable-next-line
    const idsPromiseList: Array<Promise<any>> = [];

    nftAddresses.forEach(nftAddr => {
      idsPromiseList.push(getNFTList(nftAddr, chainId, address));
    });

    const tempUserNftIds: Array<{ addr: string; ids: Array<number> } | undefined> = [];

    if (idsPromiseList.length > 0) {
      Promise.all(idsPromiseList).then(results => {
        if (results && results.length > 0) {
          results.forEach(result => {
            if (result) {
              const ids = result.data as Array<number>;
              tempUserNftIds.push({ addr: result.addr, ids: ids?.sort((a, b) => a - b) });
            }
          });
        }
        setUserAllNftIds(tempUserNftIds);
      });
    }
  }, [nftAddresses, chainId, address]);

  // construct NFT info
  useEffect(() => {
    if (
      !s3ConfigNFTs ||
      s3ConfigNFTs.length === 0 ||
      !chainId ||
      !address ||
      !userAllNftIds ||
      userAllNftIds.length === 0
    ) {
      return;
    }

    // const userNftIds = {};
    if (s3ConfigNFTs.length === 0) {
      return;
    }

    const constructNFT = async (nftName: string, nftSymbol: string, nftAddress, id: number, nativeNft = false) => {
      try {
        let tokenUri = "";
        let ownerOf;
        if (nativeNft) {
          const mcnNFTContract = (await readOnlyContract(provider, nftAddress, MCNNFT__factory)) as MCNNFT;
          tokenUri = await mcnNFTContract.tokenURI(BigNumber.from(id));
          ownerOf = await mcnNFTContract.ownerOf(BigNumber.from(id));
        } else {
          const origNFTContract = (await readOnlyContract(provider, nftAddress, OrigNFT__factory)) as OrigNFT;
          tokenUri = await origNFTContract.tokenURI(BigNumber.from(id));
          ownerOf = await origNFTContract.ownerOf(BigNumber.from(id));
        }

        // tokenUri = "https://metanft.ankr.com/v1/nft/metadata/0x6A92F2E354228e866C44419860233Cc23bec0d8A/2027396";
        // tokenUri = "https://ipfs.io/ipfs/QmeA7ysCVKuMTBuqtmbeELSUHDWyoqQ4eUUAUaf6Kjq6aU/3.jpg";

        let imageUrl: string;
        const tokenUriMetaData = await getTokenUriMetaDataJson(getNFTHttpUri(tokenUri));
        imageUrl = tokenUriMetaData?.image ?? "";

        if (!imageUrl) {
          imageUrl = getNFTHttpUri(tokenUri);
        }

        if (getAddress(ownerOf) === getAddress(address)) {
          const nftItem: NFTItem = {
            name: nftName,
            tokenName: nftSymbol,
            nftId: id,
            img: imageUrl,
            address: nftAddress,
            isNativeNft: nativeNft,
          };
          return nftItem;
        }
        return undefined;
      } catch (e) {
        // console.error(e);
        return undefined;
      }
    };

    const nftConstructPromises: Promise<NFTItem | undefined>[] = [];

    // native nft which hasn't orig vault
    const nativeNftOnSrcChains = s3ConfigNFTs.filter(item => !item.orig && item.pegs.filter(it => it.chainid === chainId));
    nativeNftOnSrcChains.forEach(nativeNftOnSrcChain => {
      const nativeToken = nativeNftOnSrcChain?.pegs.find(it => it.chainid === chainId);
      if (nativeToken) {
        const nftIds = userAllNftIds.find(idConfigItem => nativeToken.addr === idConfigItem?.addr)?.ids;
        nftIds?.forEach(id => {
          nftConstructPromises.push(
            constructNFT(nativeNftOnSrcChain.name, nativeNftOnSrcChain.symbol, nativeToken.addr, id, true)
          );
        });
      }
    })


    // peg nfts
    const origNFTConfigs = s3ConfigNFTs.filter(item => item.orig && item.orig.chainid === chainId);
    // eslint-disable-next-line no-extra-boolean-cast
    if(!!origNFTConfigs.length) {
      origNFTConfigs.forEach(origNFTConfig => {
          const nftIds = userAllNftIds.find(idConfigItem => origNFTConfig.orig.addr === idConfigItem?.addr)?.ids;
          if (nftIds && nftIds.length > 0) {
            nftIds.forEach(id => {
              nftConstructPromises.push(
                constructNFT(origNFTConfig.name, origNFTConfig.symbol, origNFTConfig.orig.addr, id),
              );
            });
          }
      })
    }
    
    
    const pegNFTConfigs = s3ConfigNFTs.filter(item => item.orig && item.pegs.find(it => it.chainid === chainId));
    if(pegNFTConfigs.length > 0) {
      pegNFTConfigs.forEach(pegNFTConfig => {
        const pegToken = pegNFTConfig?.pegs.find(it => it.chainid === chainId);
        if (pegNFTConfig && pegToken) {
          const ids = userAllNftIds.find(idConfigItem => idConfigItem?.addr === pegToken.addr)?.ids;
          ids?.forEach(nftId => {
            nftConstructPromises.push(constructNFT(pegNFTConfig.name, pegNFTConfig.symbol, pegToken?.addr, nftId));
          });
        }
      })
    }
   

    setListLoading(true);
    Promise.all(nftConstructPromises)
      .then(nfts => {
        const result = nfts.filter(it => it !== undefined);
        if (result) {
          nfts.push(...result);
          setNFTList(result as NFTItem[]);
          setFilterNFTList(result as NFTItem[]);
        }
        setListLoading(false);
      })
      .catch(e => {
        console.error(e);
        setListLoading(false);
      });
  }, [s3ConfigNFTs, chainId, address, getRpcUrlByChainId, userAllNftIds, provider]);

  const renderNFTItem = (NFT: NFTItem) => {
    let explorerUrl = getNetworkById(chainId).blockExplorerUrl;
    const index = explorerUrl.lastIndexOf("\\/");
    if (index > 0) {
      explorerUrl = explorerUrl.substring(0, index);
    }

    const openNFTURL = e => {
      e.stopPropagation();
      window.open(`${explorerUrl}/token/${NFT.address}`, "_blank");
    };
    return (
      <List.Item className={classes.itemContainer} onClick={() => onNFTSelected(NFT)}>
        <div className={classes.listItem}>
          <img src={NFT.img} alt="nftAvatar" className={classes.nftImg} />
          <div className={classes.nftInfo}>
            <span className={classes.nftTitle}>{NFT.name}</span>
            <span className={classes.nftInfoText}>{NFT.tokenName}</span>
            <span className={classes.nftInfoText}>ID: {NFT.nftId}</span>
            <div onClick={openNFTURL} className={classes.addressText}>
              <Typography.Text className={classes.addressText} ellipsis={{ suffix: NFT.address.slice(-4) }}>
                {NFT.address.substr(0, 6) + "..."}
              </Typography.Text>
              <LinkOutlined className={classes.linkIcon} />
            </div>
          </div>
        </div>
      </List.Item>
    );
  };

  return (
    <Modal
      maskStyle={{ zIndex: 1001 }}
      className={classes.nftModal}
      wrapClassName={classes.nftModalWrap}
      onCancel={() => onCancel()}
      title={<ActionTitle title="Select an NFT" />}
      visible={visible}
      footer={null}
      maskClosable={false}
    >
      <div className={classes.card}>
        <div className={classes.search}>
          <Input
            className={classes.searchinput}
            placeholder="Search by NFT name, token name, token ID or token address"
            onChange={onInputChange}
            onPressEnter={() => {}}
            allowClear
          />
        </div>
        <div className={classes.moreOptionNote}>
          <img src={ringBell} className={classes.moreOptionIcon} alt="moreOptionIcon" />
          <span style={{ color: "#8F9BB3", fontSize: 14, paddingLeft: 4, paddingRight: 4 }}>
            Only NFTs in the supported list are displayed below.
          </span>
        </div>

        <div className={classes.content}>
          <List
            itemLayout="horizontal"
            grid={{
              gutter: 16,
              column: isMobile ? 1 : 2,
            }}
            size="small"
            renderItem={renderNFTItem}
            dataSource={filterNFTList}
            loading={listLoading}
            locale={{ emptyText: "You don’t have any NFTs on this chain" }}
          />
        </div>
      </div>
    </Modal>
  );
};

export default NFTSelector;
