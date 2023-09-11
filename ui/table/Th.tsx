import clsx from "clsx";

import { css } from "@/panda/css";
import { Shorthand } from "@/panda/types/prop-type";

type Props = React.ComponentProps<'div'> & {
  grow?: Shorthand<'minWidth'>
}

export function Th(props: Props) {
  return (
    <div {...props} className={clsx(css({
      display: "flex",
      flex: `1 0 100px`,
      overflow: "hidden",
      minWidth: props.grow ?? "100px",
      color: "gray.500"
    }), props.className)} style={{ flex: props.grow !== undefined ? `0 0 ${props.grow}` : undefined }} />
  )
}
