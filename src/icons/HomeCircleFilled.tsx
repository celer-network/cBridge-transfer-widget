import * as React from "react";

import AntdIcon, { AntdIconProps } from "@ant-design/icons/lib/components/AntdIcon";

const HomeCircleFilledSvg = {
  icon: {
    tag: "svg",
    attrs: {
      width: "48",
      height: "48",
      viewBox: "0 0 24 24",
      focusable: "false",
      fill: "currentColor",
      fillRule: "evenodd",
      clipRule: "evenodd",
    },
    children: [
      {
        tag: "path",
        attrs: {
          d: "M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24ZM12.3313 5.14069L18.842 11.6498C19.1437 11.9515 18.9295 12.4705 18.4997 12.4705H17.4398V17.9996C17.4398 18.5514 16.9912 19 16.4394 19H13.9914V17.0022C13.9914 16.4504 13.5428 16.0018 12.9909 16.0018H10.9901C10.4382 16.0018 9.98961 16.4504 9.98961 17.0022V19H7.52601C6.9742 19 6.52556 18.5514 6.52556 17.9996V12.4705H5.48135C5.05303 12.4705 4.83887 11.9531 5.14213 11.6498L11.6513 5.14069C11.8389 4.9531 12.1437 4.9531 12.3313 5.14069Z",
        },
      },
    ],
  },
  name: "home-circle",
  theme: "filled" as const,
};

const HomeCircleFilled = (props: AntdIconProps, ref: React.MutableRefObject<HTMLSpanElement>) => (
  /* eslint-disable-next-line react/jsx-props-no-spreading */
  <AntdIcon {...props} ref={ref} icon={HomeCircleFilledSvg} />
);

HomeCircleFilled.displayName = "HomeCircleFilled";
export default React.forwardRef<HTMLSpanElement, AntdIconProps>(
  HomeCircleFilled as React.ForwardRefRenderFunction<HTMLSpanElement, AntdIconProps>,
);
