import { Avatar, Typography } from "antd";
import { FC } from "react";
import { createUseStyles } from "react-jss";
import { components } from "../../api/api";
import { Theme } from "../../theme";
import { useWeb3Context } from "../../providers/Web3ContextProvider";
import { getTokenSymbol } from "../../redux/assetSlice";

/* eslint-disable react/require-default-props */
const useStyles = createUseStyles((theme: Theme) => ({
  title: {
    textAlign: "center",
    "& .ant-typography": {
      color: theme.surfacePrimary,
    },
  },
  tokenInfo: {
    fontSize: 12,
    position: "absolute",
    left: 15,
    display: "flex",
    alignItems: "center",

    "& .ant-avatar": {
      marginRight: 4,
    },
  },
}));

interface IProps {
  title: string;
  token?: components["schemas"]["Asset"];
}

const ActionTitle: FC<IProps> = ({ title, token }): JSX.Element => {
  const classes = useStyles();
  const { chainId } = useWeb3Context();

  return (
    <div className={classes.title}>
      {token && (
        <span className={classes.tokenInfo}>
          <Avatar size={12} src={token?.icon} alt={token.symbol} />
          <Typography.Text>{getTokenSymbol(token.symbol, chainId)}</Typography.Text>
        </span>
      )}
      <Typography.Title level={5}>{title}</Typography.Title>
    </div>
  );
};

export default ActionTitle;
