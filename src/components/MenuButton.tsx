import { Button, Dropdown, Menu, Typography } from "antd";
import { useCallback } from "react";
import { createUseStyles } from "react-jss";
import { useWeb3Context } from "../providers/Web3ContextProvider";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { ModalName, openModal } from "../redux/modalSlice";
import { Theme } from "../theme/theme";
import { alpha2Hex } from "../helpers/alpha2Hex";

const useStyles = createUseStyles<string, { isMobile: boolean }, Theme>((theme: Theme) => ({
  buttonText: {
    position: "relative",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },

  connectBtn: {
    height: 40,
    background: theme.primaryBrand,
    backdropFilter: "blur(20px)",
    border: "none",
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 700,
    lineHeight: "16px",
  },
  dropDownMenu: {
    background: theme.secondBackground,
    opacity: 1,
    border: `1px solid ${theme.primaryBorder}`,
    borderRadius: "12px",
    padding: 16,
    textAlign: "center",
    color: theme.surfacePrimary,
    fontWeight: 600,

    "& .ant-dropdown-menu-item-active": {
      color: theme.surfacePrimary + alpha2Hex(70),
      background: theme.primaryUnable,
    },
    "& .ant-dropdown-menu-item-selected": {
      color: theme.surfacePrimary + alpha2Hex(70),
      background: theme.primaryUnable,
    },
    "& .ant-dropdown-menu-item": {
      color: theme.surfacePrimary,
      borderRadius: "4px",
      padding: "9px 8px",
      fontSize: "12px",
      fontWeight: 600,
    },
    "& .ant-typography": {
      width: 86,
      color: theme.surfacePrimary,
    },
  },
  logoutBtn: {
    color: theme.surfacePrimary,
    textAlign: "center",
    fontSize: 14,
    fontWeight: 700,
    padding: "10px",
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 24,
    display: "inline-block",
    marginLeft: 8,
    background: theme.infoSuccess,
  },
  menuBtn: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: props => (props.isMobile ? 22 : 44),
    width: 44,
    marginLeft: props => (props.isMobile ? 0 : 8),
    padding: props => (props.isMobile ? "0px 8px" : "0"),
    borderRadius: 12,
    background: props => (props.isMobile ? theme.primaryBackground : theme.secondBackground),
    position: "relative",
    cursor: "pointer",
  },
  menuDot: {
    position: "absolute",
    top: -10,
    fontSize: 30,
    color: theme.surfacePrimary,
    fontWeight: props => (props.isMobile ? 400 : 700),
  },
}));

export default function MenuButton(): JSX.Element {
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const classes = useStyles({ isMobile });
  const { address, signer, logoutOfWeb3Modal } = useWeb3Context();
  const dispatch = useAppDispatch();

  const showProviderModal = useCallback(() => {
    dispatch(openModal(ModalName.provider));
  }, [dispatch]);
  const openSite = key => {
    let site = "";
    switch (key) {
      case "Docs":
        site = "https://cbridge-docs.celer.network";
        break;
      case "Tutorial":
        site = "https://cbridge-docs.celer.network/tutorial";
        break;
      case "FAQ":
        site = "https://cbridge-docs.celer.network/faq";
        break;
      case "AuditReports":
        site = "https://cbridge-docs.celer.network/reference/audit-reports";
        break;
      case "SDK":
        site = "https://cbridge-docs.celer.network/developer";
        break;
      case "ContactSupport":
        site = "https://form.typeform.com/to/Q4LMjUaK";
        break;
      case "TokenAddresses":
        site = "https://cbridge-docs.celer.network/reference/token-addresses";
        break;
      case "BugBounty":
        site = "https://immunefi.com/bounty/celer/";
        break;
      default:
        break;
    }
    window.open(site, "_blank");
  };
  const menu = (
    <Menu className={classes.dropDownMenu}>
      <Menu.Item key="Docs" onClick={() => openSite("Docs")}>
        Docs
      </Menu.Item>
      <Menu.Item key="Tutorial" onClick={() => openSite("Tutorial")}>
        Tutorial
      </Menu.Item>
      <Menu.Item key="FAQ" onClick={() => openSite("FAQ")}>
        FAQ
      </Menu.Item>
      <Menu.Item key="AuditReports" onClick={() => openSite("AuditReports")}>
        Audit Reports
      </Menu.Item>
      <Menu.Item key="SDK" onClick={() => openSite("SDK")}>
        SDK
      </Menu.Item>
      <Menu.Item key="ContactSupport" onClick={() => openSite("ContactSupport")}>
        Contact Support
      </Menu.Item>
      <Menu.Item key="TokenAddresses" onClick={() => openSite("TokenAddresses")}>
        Contract Addresses
      </Menu.Item>
      <Menu.Item key="BugBounty" onClick={() => openSite("BugBounty")}>
        Bug Bounty
      </Menu.Item>
      {signer ? (
        <Menu.Item key="addr" className="menuAddress">
          <Typography.Text ellipsis={{ suffix: address.slice(-4) }}>{address.substr(0, 6) + "..."}</Typography.Text>
          <div className={classes.indicator} />
        </Menu.Item>
      ) : (
        <Menu.Item key="addr" className="menuAddress" onClick={showProviderModal}>
          <Button type="primary" className={classes.connectBtn}>
            Connect Wallet
          </Button>
        </Menu.Item>
      )}
      {signer && (
        <Menu.Item key="Logout" className="menuAddress" onClick={logoutOfWeb3Modal}>
          Logout
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={["click", "hover"]}>
      <div className={classes.menuBtn}>
        <div className={classes.menuDot}>...</div>
      </div>
    </Dropdown>
  );
}
