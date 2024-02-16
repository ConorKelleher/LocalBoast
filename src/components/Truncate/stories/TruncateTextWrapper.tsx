import React, { forwardRef } from "react"

const TruncateTextWrapper = forwardRef<
  HTMLHeadingElement,
  React.PropsWithChildren
>((props, ref) => {
  return (
    <h3
      ref={ref}
      style={{
        resize: "both",
        height: 30,
        width: 500,
        overflow: "hidden",
        border: "solid 1px",
        borderRadius: "4px",
      }}
    >
      {props.children}
    </h3>
  )
})

export default TruncateTextWrapper
