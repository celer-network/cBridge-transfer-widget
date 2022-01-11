import { useEffect, useMemo } from "react";
import _ from "lodash";
import { useAppDispatch } from "../redux/store";
import { saveWidth } from "../redux/windowWidthSlice";

export default function useWindowWidth() {
  const dispatch = useAppDispatch();
  const onResize = useMemo(
    () => _.throttle(() => dispatch(saveWidth({ winWidth: document.documentElement.clientWidth })), 400),
    [dispatch],
  );
  useEffect(() => {
    onResize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [onResize]);
}
