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
  return <TruncateDemo ref={ref}>{text}</TruncateDemo>
}

UseTruncateDemo.defaultProps = USE_TRUNCATE_DEFAULT_OPTIONS

export default UseTruncateDemo
