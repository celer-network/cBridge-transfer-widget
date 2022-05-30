import { createUseStyles } from "react-jss";
import tipIcon from "../../images/bell.svg";
import { useAppSelector } from "../../redux/store";
import { Theme } from "../../theme";

const useStyles = createUseStyles<string, { isMobile: boolean }, Theme>(() => ({
  tipContainer: {
    display: "flex",
    flex: 1,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 24,
    background: "#FFF",
  },

  tipContent: {
    margin: "14px 8px",
    fontSize: 13,
    fontWeight: 600,
  },
  tipDr: {
    fontWeight: 800,
  },
}));

export function ApeTip() {
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const classes = useStyles({ isMobile });

  return (
    <div className={classes.tipContainer}>
      <img src={tipIcon} alt="tooltip icon" style={{ marginLeft: 12 }} />
      <span className={classes.tipContent}>
        Sending tx on Ape Chain is free. If you are using Metamask mobile app, please{" "}
        <span className={classes.tipDr}>manually set the gas price to 0 GWEI</span> to send tx on Ape Chain, or use
        Metamask web extension.{" "}
        <a href="https://cbridge-docs.celer.network/tutorial/ape-chain-bridge-guides" target="_blank" rel="noreferrer">
          View Guides
        </a>
      </span>
    </div>
  );
}
