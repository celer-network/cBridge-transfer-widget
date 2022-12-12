/* eslint-disable */
import { Avatar, List, Modal, Input } from "antd";
import { FC, useState, useEffect } from "react";
import { createUseStyles } from "react-jss";
import { useWeb3Context } from "../../providers/Web3ContextProvider";
import { useAppSelector } from "../../redux/store";
import { Theme } from "../../theme";
import ActionTitle from "../../components/common/ActionTitle";
import { NFTChain, S3NFTConfig } from "../../constants/type";
import ringBell from "../../images/ringBell.svg";
import { NFT_CHAIN_TYPE } from "./NFTBridgeTab";

const useStyles = createUseStyles<string, { isMobile: boolean }, Theme>((theme: Theme) => ({
  chainModal: {
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
  chainModalWrap: {
    zIndex: 1001,
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
  item: {
    cursor: "pointer",
    overflow: "hidden",
    borderRadius: 16,
    background: theme.chainBg,
    "&:hover": {
      background: theme.primaryBorder,
      transition: "ease 0.2s",
    },
  },
  activeItem: {
    composes: ["item"],
    background: theme.chainBg,
    border: `1px solid ${theme.primaryBrand} !important`,
    transition: "ease 0.2s",
    borderRadius: 16,
    "& div": {
      color: theme.surfacePrimary,
    },
  },
  litem: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 0",
    color: theme.secondBrand,
  },
  itemLeft: {
    display: "flex",
    alignItems: "center",
  },
  tokenName: {
    fontSize: 16,
    color: theme.secondBrand,
  },
  tokenSymbol: {
    fontSize: 12,
    color: theme.secondBrand,
  },
  itemRight: {
    display: "flex",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: theme.infoSuccess,
  },
  text: {
    color: "#00D395",
    fontSize: 16,
    marginLeft: 7,
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
  },
}));

interface IProps {
  nftChainType: NFT_CHAIN_TYPE;
  nftChains: NFTChain[];
  visible: boolean;
  sourceChain: NFTChain | undefined;
  nftList: S3NFTConfig[];
  onSelectChain: (chainInfo: any) => void;
  onCancel: () => void;
}

const NFTChainSelector: FC<IProps> = ({ nftChainType, nftChains, visible, sourceChain, nftList, onSelectChain, onCancel }) => {
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const classes = useStyles({ isMobile });
  const { chainId } = useWeb3Context();
  const { transferInfo } = useAppSelector(state => state);
  const { chainSource, fromChain, toChain } = transferInfo;
  const [searchText, setSearchText] = useState("");
  const [filterList, setFilterList] = useState<NFTChain[]>(nftChains);


  const getTitle = () => {
    let title;
    switch (nftChainType) {
      case "sourceChain":
        title = "Select Source Chain";
        break;
      case "destinationChain":
        title = "Select Destination Chain";
        break;
      default:
        break;
    }
    return title;
  };

  const getChainId = () => {
    let chainModalId;
    switch (chainSource) {
      case "from":
        chainModalId = fromChain?.id;
        break;
      case "to":
        chainModalId = toChain?.id;
        break;
      case "wallet":
        chainModalId = chainId;
        break;
      default:
        break;
    }
    return chainModalId;
  };

  const onInputChange = e => {
    setSearchText(e.target.value?.toLowerCase());
  };

  const onEnter = e => {
    setSearchText(e.target.value?.toLowerCase());
  };

  useEffect(() => {
    const list = nftChains.filter(chain => {
      return (
        chain.name.toLocaleLowerCase().indexOf(searchText) > -1 ||
        chain.chainid.toString().toLowerCase().indexOf(searchText) > -1
      );
    });

    if (nftChainType === "destinationChain" && sourceChain !== undefined) {
      const targetDestinationChainIds = new Set<number>()
      targetDestinationChainIds.add(sourceChain.chainid)

      nftList.forEach(nftConfig => {
        let ids: number[] = []

        if (nftConfig.orig) {
          ids.push(nftConfig.orig.chainid)
        } 

        ids = ids.concat(nftConfig.pegs.map(item => {
          return item.chainid
        }))

        if (ids.includes(sourceChain.chainid)) {
          ids.forEach(id => {
            targetDestinationChainIds.add(id)
          })
        }
      })

      targetDestinationChainIds.delete(sourceChain.chainid)
      
      setFilterList(list.filter(item => {
        return targetDestinationChainIds.has(item.chainid)
      }));
      return 
    }
    setFilterList(list);
  }, [nftChains, searchText, nftChainType, nftList, sourceChain]);

  const renderChainItem = (chain: NFTChain) => {
    return (
      <List.Item
        className={getChainId() === chain.chainid ? classes.activeItem : classes.item}
        onClick={() => onSelectChain(chain)}
      >
        <div className={classes.litem}>
          <div className={classes.itemLeft}>
            <Avatar size="large" src={chain.icon} />
            <div style={{ marginLeft: 8 }}>
              <div className={classes.tokenName}>{chain.name}</div>
            </div>
          </div>
        </div>
      </List.Item>
    );
  };

  return (
    <Modal
      onCancel={() => onCancel()}
      visible={visible}
      footer={null}
      className={classes.chainModal}
      maskStyle={{ zIndex: 1001 }}
      wrapClassName={classes.chainModalWrap}
      maskClosable={false}
      title={<ActionTitle title={getTitle()} />}
    >
      <div className={classes.card}>
        <div className={classes.search}>
          <Input
            className={classes.searchinput}
            placeholder="Search chain by name or chain ID"
            onChange={onInputChange}
            onPressEnter={onEnter}
            allowClear
            autoFocus={!isMobile}
          />
        </div>
        <div className={classes.moreOptionNote} hidden={nftChainType !== "destinationChain"}>
          <img src={ringBell} className={classes.moreOptionIcon} alt="moreOptionIcon" />
          <span style={{ color: "#8F9BB3", fontSize: 14, paddingLeft: 4, paddingRight: 4 }}>
            Below only shows the chains where the bridge of your selected NFT is supported. More chains can be found if
            you select other source chains or NFTs.{" "}
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
            dataSource={filterList}
            renderItem={renderChainItem}
            locale={{ emptyText: "No results found." }}
          />
        </div>
      </div>
    </Modal>
  );
};

export default NFTChainSelector;
