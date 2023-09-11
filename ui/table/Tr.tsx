import clsx from "clsx";

import { css } from "@/panda/css";

export function Tr(props: React.ComponentProps<'div'>) {
  return (
    <div {...props} className={clsx(css({
      display: "flex",
    }), props.className)} />
  )
}
