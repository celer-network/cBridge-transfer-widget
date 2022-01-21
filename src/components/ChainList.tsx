/* eslint-disable */
import { Avatar, List, Modal, Input } from "antd";
import { FC, useState, useEffect } from "react";
import { createUseStyles } from "react-jss";
import { useWeb3Context } from "../providers/Web3ContextProvider";
import { useAppSelector } from "../redux/store";
import { Theme } from "../theme";
import ActionTitle from "./common/ActionTitle";
import { Chain } from "../constants/type";
import { CHAIN_LIST } from "../constants/network";
import { sortedChainNames } from "../constants/sortedChain";
import { useTransferSupportedChainList } from "../hooks/transferSupportedInfoList";
import ringBell from "../images/ringBell.svg";

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
  visible: boolean;
  onSelectChain: (tokenId: number) => void;
  onCancel: () => void;
}

const ChainList: FC<IProps> = ({ visible, onSelectChain, onCancel }) => {
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const classes = useStyles({ isMobile });
  const { chainId } = useWeb3Context();
  const { transferInfo } = useAppSelector(state => state);
  const { chainSource, transferConfig, fromChain, toChain } = transferInfo;
  const { chains } = transferConfig;

  const transferSupportedChainList = useTransferSupportedChainList(chainSource === "to");

  // split normalChain and other chain
  const sortChainList = (chainList: Chain[]) => {
    const normalChainList: Chain[] = [];
    const otherChainList: Chain[] = [];

    chainList.forEach(chain => {
      if (sortedChainNames.find(chainName => chain.name.includes(chainName))) {
        normalChainList.push(chain);
      } else {
        otherChainList.push(chain);
      }
    });

    // sort normal chain
    const sortedNormalChainList: Chain[] = [];
    sortedChainNames.forEach(chainName => {
      const targetNormalChain = normalChainList.find(chain => chain.name.includes(chainName));
      if (targetNormalChain) {
        sortedNormalChainList.push(targetNormalChain);
      }
    });

    // sort other chain
    const sortedOtherChainList: Chain[] = otherChainList.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
    const result = sortedNormalChainList.concat(sortedOtherChainList) as Array<Chain>;
    return result;
  };

  const setChainAddrWithSort = oldChains => {
    setChainArr(sortChainList(oldChains));
  };

  const [chainArr, setChainArr] = useState(sortChainList(chains));
  const [searchText, setSearchText] = useState("");

  const getTitle = () => {
    let title;
    switch (chainSource) {
      case "from":
        title = "Select Source Chain";
        break;
      case "to":
        title = "Select Destination Chain";
        break;
      case "wallet":
        title = "Switch Your Connected Chain";
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
    const localChainIdWhiteList = CHAIN_LIST.map(networkInfo => {
      return networkInfo.chainId;
    });
    const list = transferSupportedChainList.filter(chain => {
      return (
        (chain.name.toLocaleLowerCase().indexOf(searchText) > -1 ||
          chain.id.toString().toLowerCase().indexOf(searchText) > -1) &&
        localChainIdWhiteList.includes(chain.id)
      );
    });
    setChainAddrWithSort(list);
  }, [transferSupportedChainList, searchText, visible]);

  const renderTokenItem = (chain: Chain) => {
    return (
      <List.Item
        className={getChainId() === chain.id ? classes.activeItem : classes.item}
        onClick={() => onSelectChain(chain.id)}
      >
        <div className={classes.litem}>
          <div className={classes.itemLeft}>
            <Avatar size="large" src={chain.icon} />
            <div style={{ marginLeft: 8 }}>
              <div className={classes.tokenName}>{chain.name}</div>
            </div>
          </div>
          {getChainId() === chain.id && chainSource === "wallet" && (
            <div className={classes.itemRight}>
              <div className={classes.dot} />
            </div>
          )}
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
        <div className={classes.moreOptionNote} hidden={chainSource !== "to"}>
          <img src={ringBell} className={classes.moreOptionIcon} alt="moreOptionIcon" />
          <span style={{ color: "#8F9BB3", fontSize: 14, paddingLeft: 4, paddingRight: 4 }}>
            Below shows the destination chains that enables at least one token transfer from {fromChain?.name}. More
            chains can be found if you select other source chains.{" "}
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
            dataSource={chainArr}
            renderItem={renderTokenItem}
            locale={{ emptyText: "No results found." }}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ChainList;
