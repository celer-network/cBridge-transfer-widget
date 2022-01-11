import { RightOutlined } from "@ant-design/icons";
import { parseEther } from "@ethersproject/units";
import { message, Result, Space, Spin } from "antd";
import Modal from "antd/lib/modal/Modal";
import Text from "antd/lib/typography/Text";
import { useState } from "react";
import { createUseStyles } from "react-jss";
import { useEthBalance } from "../../hooks";
import { useContractsContext } from "../../providers/ContractsContextProvider";
import { useWeb3Context } from "../../providers/Web3ContextProvider";

import ActionTitle from "../common/ActionTitle";
import { Theme } from "../../theme";
import { getNetworkById } from "../../constants/network";
import { useAppSelector } from "../../redux/store";

export interface FaucetTokenInfo {
  address: string;
  symbol: string;
}

const useStyles = createUseStyles<string, { isMobile: boolean }, Theme>((theme: Theme) => ({
  modal: {
    minWidth: props => (props.isMobile ? "100%" : 448),
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
      "& .ant-modal-footer": {
        border: "none",
        "& .ant-btn-link": {
          color: theme.primaryBrand,
        },
      },
    },
    "& .ant-typography": {
      color: theme.surfacePrimary,
    },
  },
  entry: {
    border: "0.5px solid #C4C4C4",
    borderRadius: 12,
    width: "100%",
    height: 60,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  entryInfo: {
    marginLeft: 15,
  },
  arrow: {
    marginRight: 15,
    color: "#A0A0A0",
  },
  link: {
    color: ["#CA9979", "!important"],
  },
  result: {
    "& .ant-result-title": {
      color: theme.surfacePrimary,
    },
  },
}));

interface FaucetModalProps {
  tokenInfos: FaucetTokenInfo[];
  onClose: () => void;
}
const FAUCET_URL = {
  3: "https://faucet.ropsten.be",
  5: "https://faucet.goerli.mudit.blog",
  69: "https://faucet.paradigm.xyz  ",
  97: "https://testnet.binance.org/faucet-smart",
  4002: "https://faucet.fantom.network",
  43113: "https://faucet.avax-test.network",
  44787: "https://celo.org/developers/faucet",
};
function Entry({ text, onClick }) {
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const classes = useStyles({ isMobile });

  return (
    <div className={classes.entry} onClick={onClick}>
      <Space className={classes.entryInfo}>
        <Text>{text}</Text>
      </Space>
      <RightOutlined className={classes.arrow} />
    </div>
  );
}

function FaucetResultModal({ resultText, onCancel }) {
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const classes = useStyles({ isMobile });
  return (
    <Modal
      className={classes.modal}
      closable
      maskClosable={false}
      visible
      width={360}
      onCancel={onCancel}
      footer={null}
    >
      <Result className={classes.result} status="success" title={resultText} />
    </Modal>
  );
}

export default function FaucetModal({ tokenInfos, onClose }: FaucetModalProps): JSX.Element {
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const classes = useStyles({ isMobile });
  const {
    contracts: { faucet },
    transactor,
  } = useContractsContext();
  const { provider, address, chainId } = useWeb3Context();
  const [ethBalance] = useEthBalance(provider, address);

  const [resultMsg, setResultMsg] = useState("");
  const [loading, setLoadig] = useState(false);
  const tokenAddresses = tokenInfos.map(info => info.address);

  const drip = async () => {
    if (!transactor || !faucet || !tokenInfos || tokenInfos.length === 0) {
      message.error("It looks like something went wrong");
      return;
    }
    setLoadig(true);
    const tokenSymbolName = getNetworkById(chainId).symbol;

    if (!ethBalance || parseEther(ethBalance.toString()).eq(0)) {
      message.error(`Insufficient ${tokenSymbolName}. Please get some test ${tokenSymbolName} first.`);
      setLoadig(false);
      return;
    }

    try {
      const dripTx = await transactor(faucet.drip(tokenAddresses));
      await dripTx.wait();
      setResultMsg("Received Tokens");
      setLoadig(false);
    } catch (e) {
      setLoadig(false);
      // Handled by transactor
    }
  };

  if (resultMsg) {
    return <FaucetResultModal resultText={resultMsg} onCancel={onClose} />;
  }

  const tokenSymbols = tokenInfos.map(info => info.symbol);
  const tokensText = "Test Tokens (" + tokenSymbols.join(", ") + ")";
  const tokenSymbolName = getNetworkById(chainId).symbol;
  return (
    <Modal
      closable
      visible
      width={500}
      title={<ActionTitle title="Get From Faucets" token={undefined} />}
      onCancel={onClose}
      footer={null}
      className={classes.modal}
    >
      <Spin spinning={loading}>
        <Entry
          text={`Test ${tokenSymbolName}`}
          onClick={(e: Event) => {
            e.preventDefault();
            const faucetUrl = FAUCET_URL[chainId];
            if (faucetUrl) {
              window.open(faucetUrl, "_blank");
            }
          }}
        />
        <Entry text={tokensText} onClick={() => drip()} />
      </Spin>
    </Modal>
  );
}
