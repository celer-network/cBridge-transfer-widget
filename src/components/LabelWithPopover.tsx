import { InfoCircleOutlined } from "@ant-design/icons";
import { Popover } from "antd";
import { TooltipPlacement } from "antd/lib/tooltip";
import classNames from "classnames";
import { FC, ReactNode } from "react";
import { createUseStyles } from "react-jss";
import { Theme } from "../theme";

interface IProps {
  label?: string | ReactNode;
  subtitle?: string;
  padding?: number; // amount of paading in popover
  placement?: TooltipPlacement;
  className?: string;
  iconOnLeft?: boolean;
  centerLabel?: boolean;
}

const useStyles = createUseStyles((theme: Theme) => ({
  overlay: {
    zIndex: 10000,
    "@global": {
      ".ant-popover-inner": {
        borderRadius: 8,
      },
      ".ant-popover-arrow": {
        background: "white",
        border: "none",
      },
    },
  },
  label: {
    textAlign: "left",
    display: "inline",
  },
  subtitle: {
    // color: theme.fontColorSecondary,
  },
  popoverContent: {
    margin: 0,
    maxWidth: 300,
    // color: theme.inverseFontColorPrimary,
  },
  iconWrapper: {
    position: "relative",
    display: "inline-block",
    marginRight: 6,
    marginLeft: 6,
  },
  labelInfoIcon: {
    // color: theme.fontColorSecondary,
    "&:hover": {
      // color: theme.fontColorPrimary,
    },
  },
  offCenterIcon: {
    position: "absolute",
    top: -12,
  },
}));

const LabelWithPopover: FC<IProps> = props => {
  const {
    label,
    children,
    subtitle,
    padding,
    placement = "top",
    className,
    iconOnLeft = false,
    centerLabel = false,
  } = props;
  const classes = useStyles();

  return (
    <div className={classes.label}>
      <Popover
        arrowPointAtCenter
        color="white"
        placement={placement}
        overlayClassName={classNames(classes.overlay, className)}
        content={
          <div className={classes.popoverContent} style={{ padding: padding ?? "" }}>
            {children}
          </div>
        }
      >
        {!iconOnLeft && label}
        <div className={classes.iconWrapper}>
          <InfoCircleOutlined className={classNames(classes.labelInfoIcon, centerLabel && classes.offCenterIcon)} />
        </div>
        {iconOnLeft && label}
      </Popover>
      {subtitle ? <div className={classes.subtitle}>{subtitle}</div> : null}
    </div>
  );
};

export default LabelWithPopover;
