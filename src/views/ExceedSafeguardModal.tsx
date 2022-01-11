import { Button, Modal } from "antd";
import { createUseStyles } from "react-jss";
import { Theme } from "../theme";

const useStyles = createUseStyles((theme: Theme) => ({
  box: {
    display: "flex",
    flexFlow: "column",
    gap: 40,
    background: theme.primaryBackground,
    padding: "40px 16px 32px 16px",
  },
  text: {
    marginTop: 40,
    fontSize: 14,
    color: theme.surfacePrimary,
    textAlign: "center",
  },
  btn: {
    width: "100%",
    margin: "0",
    height: 56,
    fontSize: 16,
    fontWeight: 700,
    borderRadius: 16,
    background: theme.primaryBrand,
    border: 0,
  },
}));

function ExceedSafeguardModal({ visible, onCancel }) {
  const styles = useStyles();
  return (
    <Modal bodyStyle={{ padding: 0 }} closable visible={visible} onCancel={onCancel} footer={null}>
      <div className={styles.box}>
        <span className={styles.text}>
          The transaction cannot be submitted due to the heavy traffic at this moment. Please resubmit the transaction
          again 1 hour later in the “History” page.
        </span>
        <Button type="primary" className={styles.btn} onClick={() => onCancel()}>
          OK
        </Button>
      </div>
    </Modal>
  );
}

export default ExceedSafeguardModal;
