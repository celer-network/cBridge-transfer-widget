import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { FC, useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { useAppSelector } from "../redux/store";
import { Theme } from "../theme";

interface IProps {
  page: number; // 0 based
  hasMore: boolean;
  onPageChange: (page: number) => void;
}

const useStyles = createUseStyles<string, { isMobile: boolean }, Theme>((theme: Theme) => ({
  container: {
    display: "flex",
    alignItems: "center",
  },
  page: {
    padding: 12,
    color: theme.surfacePrimary,
  },
  icon: {
    fontSize: 13,
    color: theme.surfacePrimary,
  },
  btn: {
    background: `${theme.primaryUnable} !important`,
    borderWidth: 0,
  },
}));

const PageFlipper: FC<IProps> = props => {
  const { isMobile } = useAppSelector(state => state.windowWidth);
  const { page, hasMore, onPageChange } = props;
  const classes = useStyles({ isMobile });

  const [lastPage, setLastPage] = useState(-1);
  useEffect(() => {
    if (!hasMore && lastPage === -1) {
      setLastPage(page);
    }
  }, [hasMore, page, lastPage]);

  const handlePageChange = (toPage: number) => {
    if (toPage < 0) {
      return;
    }
    onPageChange(toPage);
  };
  return (
    <div className={classes.container}>
      <Button
        className={classes.btn}
        icon={<LeftOutlined className={classes.icon} />}
        disabled={page === 0}
        onClick={() => handlePageChange(page - 1)}
      />
      <div className={classes.page}>{page + 1}</div>
      <Button
        className={classes.btn}
        icon={<RightOutlined className={classes.icon} />}
        onClick={() => handlePageChange(page + 1)}
        disabled={!hasMore}
      />
    </div>
  );
};

export default PageFlipper;
