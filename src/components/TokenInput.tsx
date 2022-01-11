import { Input } from "antd";
import { ChangeEvent, FC } from "react";
import { createUseStyles } from "react-jss";
import { Theme } from "../theme";
import { useAppSelector } from "../redux/store";

export interface ITokenInputChangeEvent {
  value: string;
  error?: string;
}

interface IProps {
  value: string;
  disabled: boolean;
  onChange: (e: ITokenInputChangeEvent) => void;
}

const validFloatRegex = /([0-9]*[.])?[0-9]/;
const useStyles = createUseStyles((theme: Theme) => ({
  actionInput: {
    fontSize: "20px",
    width: "300px",
    color: theme.surfacePrimary,
  },
  mobileActionInput: {
    fontSize: "20px",
    width: "auto",
    color: theme.surfacePrimary,
  },
}));
const TokenInput: FC<IProps> = props => {
  const classes = useStyles();
  const { value, onChange } = props;
  const { windowWidth } = useAppSelector(state => state);
  const { isMobile } = windowWidth;
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    onChange({
      value: val,
      error: !validFloatRegex.test(val) || Number(val) < 0 ? "Please enter a valid transfer amount." : "",
    });
  };

  return (
    <Input
      className={isMobile ? classes.mobileActionInput : classes.actionInput}
      type="text"
      bordered={false}
      size="small"
      value={value}
      onChange={handleChange}
      placeholder="0.0"
      disabled={props?.disabled}
      style={{ paddingLeft: 0 }}
    />
  );
};

export default TokenInput;
