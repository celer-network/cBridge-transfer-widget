import { useContext } from "react";
import { Button, Modal } from "antd";
import { createUseStyles } from "react-jss";
import { ColorThemeContext } from "../providers/ThemeProvider";
import { Theme } from "../theme";
import themeLightIcon from "../images/light.svg";
import themeDarkIcon from "../images/dark.svg";
import faucetIcon from "../images/faucet.png";
import { useWeb3Context } from "../providers/Web3ContextProvider";
import analytics from "../images/analytics.svg";
import analyticsLight from "../images/analyticsLight.svg";

const useStyles = createUseStyles((theme: Theme) => ({
  modal: {
    width: "100%",
    minWidth: "100%",
    height: "100%",
    border: "0",
    top: 0,
    borderRadius: 0,
    margin: 0,
    "& .ant-modal-content": {
      background: theme.globalBg,
      height: "100%",
      borderRadius: 0,
      "& .ant-modal-header": {
        background: "transparent",
        borderRadius: 0,
      },
      "& .ant-modal-body": {
        height: "100%",
        padding: 0,
        background: "transparent",
      },
    },
  },
  content: {
    paddingTop: 50,
    display: "grid",
    gridTemplateColumns: "auto",
    rowGap: 16,
    justifyContent: "center",
    background: "transparent",
  },
  whiteText: {
    fontSize: 16,
    color: theme.surfacePrimary,
    fontWeight: 700,
    textAlign: "center",
  },
  grayText: {
    fontSize: 13,
    color: theme.secondBrand,
    fontWeight: 600,
    textAlign: "center",
    "&:focus, &:hover": {
      color: theme.secondBrand,
    },
  },
  bottomContent: {
    display: "flex",
    flexFlow: "column",
    alignItems: "center",
    position: "absolute",
    width: "100%",
    bottom: 66,
  },
  iconWrapper: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 24px)",
    columnGap: 24,
    height: 24,
    marginTop: 22,
    fontSize: 24,
    color: theme.secondBrand,
  },
  flexBtn: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  flexBtnContent: {
    borderRadius: 12,
    background: theme.secondBackground,
    gap: 7,
    fontWeight: 700,
    fontSize: 16,
    color: theme.surfacePrimary,
    padding: 7,
  },
  flexBtnIcon: {
    fontSize: 26,
    color: theme.surfacePrimary,
    marginRight: 7,
    width: 26,
    height: 26,
    pointerEvents: "none",
  },
  themeBtn: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 48,
    height: 48,
    borderRadius: 12,
    background: theme.secondBackground,
    "&:hover": {
      background: theme.primaryBackground,
    },
  },
}));

type MenuModalProps = {
  visible: boolean;
  onCancel: () => void;
};

function MenuModal({ visible, onCancel }: MenuModalProps) {
  const styles = useStyles();
  const { themeType, toggleTheme } = useContext(ColorThemeContext);
  const { chainId } = useWeb3Context();
  const toggleIconUrl = themeType === "dark" ? themeLightIcon : themeDarkIcon;

  // const closeFaucet = () => {
  //   toggleFaucet();
  // };

  // const bottomContent = () => {
  //   return (
  //     <div className={styles.bottomContent}>
  //       <span className={styles.whiteText}>Follow Us</span>
  //       <div className={styles.iconWrapper}>
  //         <DiscordCircleFilled onClick={() => window.open("https://discord.gg/uGx4fjQ", "_blank")} />
  //         <TelegramCircleFilled onClick={() => window.open("https://t.me/celernetwork", "_blank")} />
  //         <TwitterCircleFilled onClick={() => window.open("https://twitter.com/CelerNetwork", "_blank")} />
  //         <GithubFilled onClick={() => window.open("https://github.com/celer-network/cbridge-node", "_blank")} />
  //       </div>
  //     </div>
  //   );
  // };

  return (
    <Modal className={styles.modal} title="" closable visible={visible} onCancel={onCancel} footer={null}>
      <div className={styles.content}>
        <Button
          className={styles.grayText}
          type="text"
          onClick={() => window.open("https://cbridge-docs.celer.network", "_blank")}
        >
          Docs
        </Button>
        <Button
          className={styles.grayText}
          type="text"
          onClick={() => window.open("https://cbridge-docs.celer.network/tutorial", "_blank")}
        >
          Tutorial
        </Button>
        <Button
          className={styles.grayText}
          type="text"
          onClick={() => window.open("https://cbridge-docs.celer.network/faq", "_blank")}
        >
          FAQ
        </Button>
        <Button
          className={styles.grayText}
          type="text"
          onClick={() => window.open("https://cbridge-docs.celer.network/reference/audit-reports", "_blank")}
        >
          Audit Reports
        </Button>
        <Button
          className={styles.grayText}
          type="text"
          onClick={() => window.open("https://cbridge-docs.celer.network/developer", "_blank")}
        >
          SDK
        </Button>
        <Button
          className={styles.grayText}
          type="text"
          onClick={() => window.open("https://form.typeform.com/to/Q4LMjUaK", "_blank")}
        >
          Contact Support
        </Button>
        <Button
          className={styles.grayText}
          type="text"
          onClick={() => window.open("https://cbridge-docs.celer.network/reference/token-addresses", "_blank")}
        >
          Contract Addresses
        </Button>
        <Button
          className={styles.grayText}
          type="text"
          onClick={() => window.open("https://immunefi.com/bounty/celer", "_blank")}
        >
          Bug Bounty
        </Button>

        {chainId !== 1 && (process.env.REACT_APP_ENV === "TEST" || process.env.REACT_APP_ENV === "DEV") && (
          <div
            className={styles.flexBtn}
            onClick={() => {
              // toggleFaucet();
            }}
          >
            <div className={styles.flexBtnContent}>
              <img src={faucetIcon} className={styles.flexBtnIcon} alt="" />
              Faucet
            </div>
          </div>
        )}
        <div
          className={styles.flexBtn}
          onClick={() => window.open("https://cbridge-analytics.celer.network/", "_blank")}
        >
          <div className={styles.flexBtnContent}>
            <img src={themeType === "dark" ? analytics : analyticsLight} className={styles.flexBtnIcon} alt="" />
            Analytics
          </div>
        </div>

        {/* <div className={styles.flexBtn} onClick={() => window.open("https://cbridge-campaign.netlify.app/")}>
          <div className={styles.flexBtnContent} style={{ padding: "10px 8px" }}>
            <img src={leaderboardIcon} className={styles.flexBtnIcon} alt="" />
            Leaderboard
          </div>
        </div> */}
        {/* {!isMobile&&(
          <div className={styles.flexBtn} onClick={() => window.open("https://test-sgn.celer.network/")}>
            <div className={styles.flexBtnContent} style={{ padding: "10px 8px" }}>
              <img src={sgnIcon} className={styles.flexBtnIcon} alt="" />
              SGN
            </div>
          </div>
        )} */}
        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <Button className={styles.themeBtn} type="text" size="large" onClick={toggleTheme}>
            <img src={toggleIconUrl} width={27} height={27} alt="protocol icon" />
          </Button>
        </div>
        {/* {bottomContent()} */}
      </div>
      {/* {showFaucet && <FaucetModal tokenInfos={tokenInfo} onClose={closeFaucet} />} */}
    </Modal>
  );
}

export default MenuModal;
