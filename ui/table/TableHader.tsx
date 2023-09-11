import clsx from "clsx";

import { css } from "@/panda/css";

export function TableHeader(props: React.ComponentProps<'div'>) {
  return (
    <div {...props} className={clsx(css({
      display: "flex",
      borderBottomWidth: "1px",
      borderColor: "gray.300",
      pb: "2",
      mb: "2",
    }), props.className)} />
  )
}
