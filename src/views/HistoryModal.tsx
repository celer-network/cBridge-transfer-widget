import { Modal } from "antd";
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
}));

const HistoryModal = ({ visible, onCancel }) => {
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const styles = mobileStyles();
  if (isMobile) {
    return (
      <Modal
        className={styles.modal}
        title=""
        visible={visible}
        onCancel={onCancel}
        closable
        footer={null}
        destroyOnClose
      >
        <div id="modalpop">
          <History />
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
        <History />
      </div>
    </Modal>
  );
};

export default HistoryModal;
