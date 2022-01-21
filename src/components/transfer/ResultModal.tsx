import { Button, Modal } from "antd";

interface ResultModalProps {
  resultText: JSX.Element | string;
  buttonText: string;
  titleText?: string;
  onCancel: () => void;
  onAction?: () => void;
}

export default function ResultModal({
  resultText,
  buttonText,
  titleText,
  onCancel,
  onAction,
}: ResultModalProps): JSX.Element {
  return (
    <Modal closable maskClosable={false} visible width={360} onCancel={onCancel} footer={null} title={titleText}>
      <div
        style={
          titleText ? { fontSize: 14, padding: "10px 20px 20px 20px" } : { fontSize: 14, marginTop: 15, padding: 20 }
        }
      >
        <div>{resultText}</div>
      </div>
      <Button type="primary" style={{ width: "100%", marginTop: 10, height: 40 }} onClick={onAction}>
        {buttonText}
      </Button>
    </Modal>
  );
}
