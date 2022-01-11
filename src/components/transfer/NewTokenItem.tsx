import { Avatar } from "antd";
import { createUseStyles } from "react-jss";
import { useNativeETHToken } from "../../hooks";
import { useWeb3Context } from "../../providers/Web3ContextProvider";
import { useAppSelector } from "../../redux/store";
import { Theme } from "../../theme";
import { alpha2Hex } from "../../helpers/alpha2Hex";
import { getTokenListSymbol } from "../../redux/assetSlice";

/* eslint-disable*/
/* eslint-disable camelcase */
const useStyles = createUseStyles((theme: Theme) => ({
  card: {
    // background: theme.primaryBackground,
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
      border: "none",
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
    color: theme.secondBrand,
    margin: "10px 20px",
    borderRadius: 16,
    background: theme.surfacePrimary + alpha2Hex(10),
  },
  activeItem: {
    composes: ["item"],
    color: theme.surfacePrimary,
    margin: "10px 20px",
    transition: "ease 0.2s",
    borderRadius: 16,
    background: theme.surfacePrimary + alpha2Hex(10),
    border: `1px solid ${theme.primaryBrand}`,
  },
  litem: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 16px",
  },
  itemLeft: {
    display: "flex",
    alignItems: "center",
  },
  tokenName: {
    fontSize: 16,
    textAlign: "left",
  },
  tokenSymbol: {
    fontSize: 12,
    textAlign: "left",
  },
}));

const TokenItem = ({ onSelectToken, tokenInfo }) => {
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const classes = useStyles();
  const { chainId } = useWeb3Context();
  const { fromChain, selectedTokenSymbol } = useAppSelector(state => state.transferInfo);
  const { icon, token } = tokenInfo;
  const { symbol, display_symbol } = token;
  const tokenBalance = tokenInfo.balance;

  const { tokenDisplayName } = useNativeETHToken(fromChain, tokenInfo);

  return (
    <div
      className={selectedTokenSymbol === (display_symbol ?? symbol) ? classes.activeItem : classes.item}
      onClick={() => {
        onSelectToken(display_symbol ?? getTokenListSymbol(symbol, chainId));
      }}
    >
      <div className={classes.litem}>
        <div className={classes.itemLeft}>
          <Avatar size="large" src={icon} />
          <div style={{ marginLeft: 8 }}>
            <div className={classes.tokenName}>{tokenDisplayName}</div>
          </div>
        </div>
        <div className={classes.tokenName} style={{ textAlign: isMobile ? "right" : "left" }}>
          {tokenBalance}{" "}
          <span style={{ marginLeft: 5 }}>{display_symbol ?? getTokenListSymbol(symbol, fromChain?.id)}</span>
        </div>
      </div>
    </div>
  );
};

export default TokenItem;
