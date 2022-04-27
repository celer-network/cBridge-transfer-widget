import { Button, Modal } from "antd";
import { createUseStyles } from "react-jss";
import { useWallet, ConnectType } from "@terra-money/wallet-provider";
import { Theme } from "../../theme/theme";
import { useAppSelector } from "../../redux/store";

const useStyles = createUseStyles<string, { isMobile: boolean }, Theme>((theme: Theme) => ({
  connectModal: {
    width: "100%",
    minWidth: props => (props.isMobile ? "100%" : 500),
    background: theme.secondBackground,
    border: `1px solid ${theme.primaryBackground}`,
    "& .ant-modal-content": {
      background: theme.secondBackground,
      boxShadow: props => (props.isMobile ? "none" : ""),
      "& .ant-modal-close": {
        color: theme.surfacePrimary,
      },
      "& .ant-modal-header": {
        background: theme.secondBackground,
        borderBottom: "none",
        "& .ant-modal-title": {
          color: theme.surfacePrimary,
          "& .ant-typography": {
            color: theme.surfacePrimary,
          },
        },
      },
      "& .ant-modal-body": {
        "& .ant-spin-blur": {
          border: "none",
          borderRadius: 16,
        },
        "& .ant-spin-spinning": {
          borderRadius: 16,
          opacity: 0.8,
          background: theme.primaryBackground,
        },
        "& .ant-spin-nested-loading": {
          "& .ant-spin": {
            maxHeight: "100%",
          },
        },
      },
      "& .ant-modal-footer": {
        border: "none",
        padding: props => (props.isMobile ? "8px 16px" : "10px 16px"),
        "& .ant-btn-link": {
          color: theme.primaryBrand,
        },
      },
    },
    "& .ant-typography": {
      color: theme.surfacePrimary,
    },
  },
  modalTopIcon: {
    fontSize: 16,
    fontWeight: 600,
    width: "100%",
    textAlign: "center",
    marginTop: 96,
    marginBottom: props => (props.isMobile ? 18 : 40),
    "&img": {
      width: 90,
    },
  },
  descriptionLabel: {
    fontSize: 14,
    fontWeight: 500,
    color: theme.surfacePrimary,
    width: "100%",
    textAlign: "center",
    marginTop: props => (props.isMobile ? 18 : 40),
  },
  button: {
    marginTop: props => (props.isMobile ? 16 : 40),
    height: 56,
    lineHeight: "42px",
    width: "100%",
    background: theme.primaryBrand,
    borderRadius: 16,
    fontSize: 18,
    fontWeight: 500,
    borderWidth: 0,
    "&:focus, &:hover": {
      background: theme.buttonHover,
    },
    "&::before": {
      backgroundColor: `${theme.primaryBrand} !important`,
    },
  },
  footer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 0,
    paddingBottom: props => (props.isMobile ? 0 : 16),
  },
}));

interface ProviderModalProps {
  visible: boolean;
  onCancel: () => void;
}

export default function TerraStationInstallNeededProviderModal({ visible, onCancel }: ProviderModalProps): JSX.Element {
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const classes = useStyles({ isMobile });
  const { install } = useWallet();
  const handleSelectProvider = async () => {
    install(ConnectType.EXTENSION);
    onCancel();
  };

  return (
    <>
      <Modal
        closable
        visible={visible}
        className={classes.connectModal}
        onCancel={onCancel}
        footer={null}
        maskClosable={false}
        bodyStyle={{ padding: isMobile ? "0 16px 0 16px" : 24 }}
      >
        <div className={classes.modalTopIcon} style={{ marginTop: 80 }}>
          <img src="./terraStation.png" height="72" alt="" />
        </div>
        <div className={classes.descriptionLabel}> Please install Terra Station Wallet first. </div>
        <Button type="primary" size="large" block onClick={handleSelectProvider} className={classes.button}>
          OK
        </Button>
      </Modal>
    </>
  );
}
