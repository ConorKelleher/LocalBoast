import {
  USE_TRUNCATE_DEFAULT_OPTIONS,
  useTruncate,
  UseTruncateOptions,
} from "localboast/hooks/useTruncate"
import TruncateDemo from "localboast/components/Truncate/stories/demos/TruncateDemo"

interface UseTruncateDemoProps extends UseTruncateOptions {
  originalString: string
}

const UseTruncateDemo = ({
  originalString,
  ...useTruncateOptions
}: UseTruncateDemoProps) => {
  const [text, ref] = useTruncate(originalString, useTruncateOptions)
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
      {text}
    </h3>
  )
}

UseTruncateDemo.defaultProps = USE_TRUNCATE_DEFAULT_OPTIONS

export default UseTruncateDemo
