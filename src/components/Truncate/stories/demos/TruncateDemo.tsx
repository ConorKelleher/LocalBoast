import Truncate, {
  TruncateProps,
  TRUNCATE_DEFAULT_PROPS,
} from "localboast/components/Truncate"

const TruncateDemo = (props: TruncateProps) => {
  return (
    <Truncate
      {...props}
      tag="h3"
      style={{
        resize: "both",
        height: 30,
        width: 500,
        overflow: "hidden",
        border: "solid 1px",
        borderRadius: "4px",
      }}
    />
  )
}

TruncateDemo.defaultProps = TRUNCATE_DEFAULT_PROPS

export default TruncateDemo
