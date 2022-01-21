import { Typography } from "antd";
import { FC } from "react";
import { createUseStyles } from "react-jss";
import { Theme } from "../../theme";

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
}

const ActionTitle: FC<IProps> = ({ title }): JSX.Element => {
  const classes = useStyles();

  return (
    <div className={classes.title}>
      <Typography.Title level={5}>{title}</Typography.Title>
    </div>
  );
};

export default ActionTitle;
