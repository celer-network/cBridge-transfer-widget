import { Button, Dropdown, Menu, Typography } from "antd";
import { useCallback } from "react";
import { createUseStyles } from "react-jss";
import { useWeb3Context } from "../providers/Web3ContextProvider";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { ModalName, openModal } from "../redux/modalSlice";
import { Theme } from "../theme/theme";
import { alpha2Hex } from "../helpers/alpha2Hex";

const useStyles = createUseStyles<string, { isMobile: boolean }, Theme>((theme: Theme) => ({
  addressBtn: {
    marginLeft: props => (props.isMobile ? 0 : 8),
    height: props => (props.isMobile ? 22 : 44),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: props => (props.isMobile ? theme.primaryBackground : theme.secondBackground),
    transition: "none !important",
    backdropFilter: "blur(20px)",
    border: "none",
    borderRadius: 12,
    minWidth: 50,
    fontWeight: props => (props.isMobile ? 400 : 700),
    padding: props => (props.isMobile ? "0px 8px" : ""),
    "& .ant-typography": {
      width: props => (props.isMobile ? 100 : 120),
      color: theme.surfacePrimary,
      "&:hover": {
        color: theme.unityWhite,
      },
    },
    "&:hover": {
      background: theme.primaryBrand,
      color: theme.unityWhite,
      "& .ant-typography": {
        color: theme.unityWhite,
      },
    },
  },

  buttonText: {
    position: "relative",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },

  connectBtn: {
    marginLeft: 8,
    height: 44,
    background: theme.primaryBrand,
    backdropFilter: "blur(20px)",
    border: "none",
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 700,
    lineHeight: "16px",
    "& .ant-typography": {
      width: 120,
      color: theme.surfacePrimary,
    },
    "&:hover": {
      background: theme.primaryBrand,
      color: theme.unityWhite,
    },
  },
  dropDownMenu: {
    background: theme.secondBackground,
    borderRadius: "12px",
    padding: 0,
    "& .ant-dropdown-menu-item-active": {
      color: theme.surfacePrimary + alpha2Hex(70),
      background: theme.secondBackground,
    },
  },
  logoutBtn: {
    color: theme.surfacePrimary,
    textAlign: "center",
    borderRadius: "12px",
    fontSize: 14,
    fontWeight: 700,
    padding: "10px",
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 24,
    verticalAlign: "middle",
    marginLeft: 8,
    background: theme.infoSuccess,
  },
}));

export default function Account(): JSX.Element {
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const classes = useStyles({ isMobile });
  const { address, signer, logoutOfWeb3Modal } = useWeb3Context();
  const dispatch = useAppDispatch();

  const showProviderModal = useCallback(() => {
    dispatch(openModal(ModalName.provider));
  }, [dispatch]);

  if (signer) {
    const menu = (
      <Menu className={classes.dropDownMenu}>
        <Menu.Item className={classes.logoutBtn} key="logout" onClick={logoutOfWeb3Modal}>
          Logout
        </Menu.Item>
      </Menu>
    );

    return (
      <Dropdown overlay={menu} trigger={["click", "hover"]}>
        <Button className={classes.addressBtn} type="ghost">
          <Typography.Text ellipsis={{ suffix: address.slice(-4) }}>{address.substr(0, 6) + "..."}</Typography.Text>
          <span className={classes.indicator} />
        </Button>
      </Dropdown>
    );
  }

  if (isMobile) {
    return <div />;
  }
  return (
    <>
      <Button type="primary" className={classes.connectBtn} onClick={showProviderModal}>
        Connect Wallet
      </Button>
    </>
  );
}
