/* eslint-disable camelcase */
import { Tooltip, Input, Row, Col } from "antd";
import { InfoCircleOutlined, WarningFilled } from "@ant-design/icons";
import { createUseStyles } from "react-jss";
import { useState, useEffect } from "react";
import { Theme } from "../theme";
import { setRate } from "../redux/transferSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { useContractsContext } from "../providers/ContractsContextProvider";

const RateModal = ({ onCancle }) => {
  const useStyles = createUseStyles<string, { isMobile: boolean }, Theme>((theme: Theme) => ({
    ratemodal: {
      position: "relative",
    },
    mobileRateModal: {},
    ratemodalwarp: {
      position: "fixed",
      width: "100vw",
      height: "100vh",
      top: 0,
      left: 0,
      zIndex: 20,
    },
    rateBody: {
      // height: 140,
      padding: "32px 16px",
      border: `1px solid ${theme.primaryBorder}`,
      borderRadius: 16,
      zIndex: 21,
      top: 16,
      right: 0,
      position: "absolute",
      backgroundColor: theme.secondBackground,
      boxShadow: "0px 6px 12px -6px rgba(24, 39, 75, 0.12), 0px 8px 24px -4px rgba(24, 39, 75, 0.08)",
    },
    mobileRateBody: {},
    title: {
      fontSize: 12,
      fontWeight: 600,
      color: theme.surfacePrimary,
      marginBottom: 24,
    },
    unableBtn: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: "16px",
      fontSize: 14,
      fontWeight: 600,
      background: theme.primaryUnable,
      color: theme.secondBrand,
      textAlign: "center",
      cursor: "pointer",
      height: 48,
    },
    activeBtn: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: "16px",
      fontSize: 14,
      fontWeight: 600,
      background: theme.primaryBrand,
      // color: theme.surfacePrimary,
      color: "#FFFFFF",
      textAlign: "center",
      cursor: "pointer",
      height: 48,
    },
    content: {
      display: "flex",
      alignItems: "center",
    },
    rateInput: {
      backgroundColor: "transparent",
      height: 48,
      borderRadius: 16,
      fontSize: 14,
      color: theme.surfacePrimary,
      borderColor: "#d9d9d9",
      textAlign: "right",
      "& input": {
        backgroundColor: "transparent",
        textAlign: "right",
        color: theme.surfacePrimary,
      },
    },
    activeRateInput: {
      backgroundColor: "transparent",
      height: 48,
      borderRadius: 16,
      fontSize: 14,
      color: theme.surfacePrimary,
      borderColor: theme.primaryBrand,
      textAlign: "right",
      "& input": {
        backgroundColor: "transparent",
        textAlign: "right",
        color: theme.surfacePrimary,
      },
    },
    inputBtn: {
      position: "relative",
    },
    extra: {
      position: "absolute",
      top: props => (props.isMobile ? 14 : 17),
      right: 10,
      color: theme.surfacePrimary,
      fontSize: 14,
    },
    desc: {
      fontSize: 12,
      color: theme.infoWarning,
      marginTop: 10,
    },
    descError: {
      fontSize: 12,
      color: theme.infoDanger,
      marginTop: 10,
    },
    warimg: {
      position: "absolute",
      top: 13,
      left: 10,
    },
    mobileTooltipOverlayStyle: {
      "& .ant-tooltip-inner": {
        width: "calc(100vw - 40px)",
        borderRadius: 8,
      },
      "& .ant-tooltip-arrow-content": {
        width: 9,
        height: 9,
      },
    },
  }));

  const {
    contracts: { bridge },
  } = useContractsContext();
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const classes = useStyles({ isMobile });
  const dispatch = useAppDispatch();
  const { transferInfo } = useAppSelector(state => state);
  const { rate } = transferInfo;
  const [type, setType] = useState(rate !== "0.3" && rate !== "0.5" && rate !== "1" ? "num" : rate);
  const [num, setNum] = useState(rate);
  const [minnum, setMinnum] = useState(0.05);

  const setInfo = async val => {
    if (Number(val) >= minnum && Number(val) <= 10) {
      dispatch(setRate(val.toString()));
    } else {
      dispatch(setRate(rate));
    }
  };
  const getMinnum = async () => {
    try {
      if (bridge) {
        const minimalMaxSlippage = await bridge.minimalMaxSlippage();
        if (minimalMaxSlippage) {
          setMinnum(Number(minimalMaxSlippage) / 10000);
        }
      }
    } catch (error) {
      console.log("error:", error);
    }
  };
  useEffect(() => {
    getMinnum();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onTypeChange = val => {
    setType(val);
    setNum(val);
    setInfo(val);
  };
  const onInputChange = val => {
    // const reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{0,3})?$/;
    // if (val && !reg.test(val)) {
    //   return;
    // }
    setNum(val);
  };

  return (
    <div className={isMobile ? classes.mobileRateModal : classes.ratemodal}>
      <div className={isMobile ? classes.mobileRateBody : classes.rateBody}>
        <div className={classes.title}>
          Slippage Tolerance
          <Tooltip
            overlayClassName={isMobile ? classes.mobileTooltipOverlayStyle : undefined}
            title="The transfer won’t go through if the bridge rate moves unfavorably by more than this percentage when the
                transfer is executed."
            placement="bottom"
            arrowPointAtCenter
            color="#fff"
            overlayInnerStyle={{ color: "#000", width: 265 }}
          >
            <InfoCircleOutlined style={{ fontSize: 13, marginLeft: 6 }} />
          </Tooltip>
        </div>
        <Row gutter={[6, 6]} style={{ width: isMobile ? "100%" : 442 }}>
          <Col xs={8} sm={8} md={12} lg={5} xl={5}>
            <div
              className={type === "0.3" ? classes.activeBtn : classes.unableBtn}
              onClick={() => {
                onTypeChange("0.3");
              }}
            >
              0.3%
            </div>
          </Col>
          <Col xs={8} sm={8} md={12} lg={5} xl={5}>
            <div
              className={type === "0.5" ? classes.activeBtn : classes.unableBtn}
              onClick={() => {
                onTypeChange("0.5");
              }}
            >
              0.5%
            </div>
          </Col>
          <Col xs={8} sm={8} md={8} lg={5} xl={5}>
            <div
              className={type === "1" ? classes.activeBtn : classes.unableBtn}
              onClick={() => {
                onTypeChange("1");
              }}
            >
              1%
            </div>
          </Col>
          <Col xs={24} sm={24} md={16} lg={9} xl={9}>
            <div className={classes.inputBtn}>
              <Input
                // controls={false}
                className={type === "num" ? classes.activeRateInput : classes.rateInput}
                size="large"
                type="number"
                suffix="%"
                onFocus={() => {
                  setType("num");
                }}
                id="input"
                value={num || undefined}
                onChange={e => {
                  onInputChange(e.target.value);
                }}
                onBlur={() => {
                  setInfo(num);
                }}
                style={Number(num) < minnum ? { borderColor: "#FF3D71" } : { borderColor: "#1890ff" }}
              />
              {((minnum < Number(num) && Number(num) < 0.1) || Number(num) > 5) && (
                <div className={classes.warimg}>
                  <WarningFilled style={{ fontSize: 20, marginRight: 5, color: "#ff8f00" }} />
                </div>
              )}
              {Number(num) < minnum && (
                <div className={classes.warimg}>
                  <WarningFilled style={{ fontSize: 20, marginRight: 5, color: "#FF3D71" }} />
                </div>
              )}
            </div>
          </Col>
        </Row>
        {Number(num) < minnum && (
          <div className={classes.descError}>The slippage tolerance should be greater than 0.05%.</div>
        )}
        {Number(num) > 10 && <div className={classes.descError}>The slippage tolerance should be lower than 10%.</div>}
        {minnum < Number(num) && Number(num) < 0.1 && (
          <div className={classes.desc}>
            WARNING: The slippage tolerance is set very low. This transaction will have a high probability of failing.
          </div>
        )}
        {Number(num) > 5 && Number(num) <= 10 && (
          <div className={classes.desc}>
            WARNING: The slippage tolerance is set above the recommended amount. You may receive {num}% less with this
            level of slippage tolerance.
          </div>
        )}
      </div>
      {isMobile ? null : (
        <div
          className={classes.ratemodalwarp}
          onClick={e => {
            e.stopPropagation();
            onCancle();
          }}
        />
      )}
    </div>
  );
};

export default RateModal;
