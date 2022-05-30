import { ReloadOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import { useState } from "react";
import { createUseStyles } from "react-jss";
import { useAppSelector } from "../redux/store";
import { Theme } from "../theme";
import History from "./History";

const mobileStyles = createUseStyles((theme: Theme) => ({
  modal: {
    width: "100vw",
    minWidth: "100vw",
    height: "auto",
    border: "0",
    top: 0,
    borderRadius: 0,
    margin: 0,
    "& .ant-modal-content": {
      background: theme.globalBg,
      borderRadius: 0,
      height: "100%",
      "& .ant-modal-header": {
        borderRadius: 0,
        background: "transparent",
      },
      "& .ant-modal-body": {
        height: "100%",
        padding: "27px 0 0 0",
        background: "transparent",
      },
    },
  },
  content: {
    marginTop: 40,
    display: "grid",
    gridTemplateColumns: "auto",
    rowGap: 16,
    justifyContent: "center",
    background: "transparent",
  },
  rebutton: {
    position: "absolute",
    top: 12,
    right: 44,
    zIndex: 10,
    "&.ant-btn": {
      boxShadow: "none",
      border: "none",
      background: "transparent",
      color: theme.secondBrand,
      opacity: 0.7,
      "&:focus, &:hover": {
        border: "none",
        color: theme.surfacePrimary,
        opacity: 0.9,
      },
    },
  },
}));

const HistoryModal = ({ visible, onCancel }) => {
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const styles = mobileStyles();
  const [refreshHistory, setRefreshHistory] = useState(false);
  if (isMobile) {
    return (
      <Modal
        className={styles.modal}
        title={
          <Button
            type="primary"
            className={styles.rebutton}
            onClick={() => {
              setRefreshHistory(!refreshHistory);
            }}
            icon={<ReloadOutlined style={{ fontSize: 20 }} />}
          />
        }
        visible={visible}
        onCancel={onCancel}
        closable
        footer={null}
        destroyOnClose
      >
        <div id="modalpop">
          <History refreshChanged={refreshHistory} />
        </div>
      </Modal>
    );
  }
  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      bodyStyle={{ padding: 0 }}
      maskStyle={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
      footer={null}
      width={786}
      destroyOnClose
    >
      <div id="modalpop">
        <History refreshChanged={refreshHistory} />
      </div>
    </Modal>
  );
};

export default HistoryModal;
