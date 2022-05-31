import { FC, useState, useEffect } from "react";
import { Menu } from "antd";
import { createUseStyles } from "react-jss";
import { Link, useLocation } from "react-router-dom";
import classNames from "classnames";
import { Theme } from "../theme";
import { useAppSelector } from "../redux/store";
import { FeatureSupported, getSupportedFeatures } from "../utils/featureSupported";

const useStyles = createUseStyles<string, { isMobile: boolean }, Theme>((theme: Theme) => ({
  flexCenter: {
    display: "flex",
    flexFlow: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    position: "relative",
    zIndex: 200,
    width: props => (props.isMobile ? "" : 255),
  },
  mobileTopDeco: {
    width: "100%",
    height: 32,
    borderRadius: "8px 8px 0px 0px",
    borderTop: "1px solid #40424E",
  },
  menuLogin: {
    width: "221px !important",
    maxWidth: props => (props.isMobile ? "100%" : 221),
  },
  menuLogout: {
    width: "221px !important",
    maxWidth: props => (props.isMobile ? "100%" : 221),
  },

  menu: {
    // width: "calc(100% - 32px)",
    // maxWidth: props => (props.isMobile ? "100%" : 240),
    width: "221px",
    // maxWidth: props => (props.isMobile ? "100%" : 343),
    marginBottom: 0,
    height: props => (props.isMobile ? 40 : 44),
    background: theme.primaryUnable,
    borderRadius: 16,
    border: "none",
    display: "flex",
    "& .ant-menu-item": {
      // flex: 1,
      textAlign: "center",
      margin: "2px !important",
      fontSize: 18,
      borderRadius: 12,
      top: 0,
      lineHeight: props => (props.isMobile ? "38px" : "39px"),
      "&:hover": {
        color: theme.surfacePrimary,
      },
    },
    "& .ant-menu-item::after": {
      borderBottom: "0 !important",
    },
    "& .ant-menu-item a": {
      color: theme.secondBrand,
      fontSize: "16px",
      fontWeight: 700,
      "&:hover": {
        color: theme.primaryBrand,
      },
    },
    "& .ant-menu-item-selected": {
      background: theme.primaryBrand,
    },
    "& .ant-menu-item-selected:hover": {
      background: theme.primaryBrand,
      color: "#fff !important",
    },
    "& .ant-menu-item-selected a": {
      color: theme.unityWhite,
      "&:hover": {
        color: `${theme.unityWhite} !important`,
      },
    },
  },
}));

const ViewTab: FC = () => {
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const classes = useStyles({ isMobile });
  const location = useLocation();
  const [route, setRoute] = useState("");
  useEffect(() => {
    const segments = location.pathname.split("/").filter(p => p);
    setRoute(segments[0]);
  }, [location]);

  return (
    <div className={classes.flexCenter}>
      {isMobile ? <div className={classes.mobileTopDeco} /> : null}
      {
        (getSupportedFeatures() === FeatureSupported.BOTH && (
          <Menu className={classNames(classes.menu, classes.menuLogout)} selectedKeys={[route]} mode="horizontal">
            <Menu.Item key="transfer">
              <Link to="/transfer">Transfer</Link>
            </Menu.Item>
            <Menu.Item key="nft" style={{ width: 108 }}>
              <Link to="/nft">NFT</Link>
            </Menu.Item>
          </Menu>
        ))
      }
    </div>
  );
};

export default ViewTab;
