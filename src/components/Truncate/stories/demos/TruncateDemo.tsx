import { forwardRef } from "react"
import {
  TruncateProps,
  TRUNCATE_DEFAULT_PROPS,
} from "localboast/components/Truncate"

const TruncateDemo = forwardRef<HTMLHeadingElement, TruncateProps>(
  (props, ref) => {
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
  },
)

TruncateDemo.defaultProps = TRUNCATE_DEFAULT_PROPS

export default TruncateDemo
