import TruncateTextWrapper from "components/Truncate/stories/TruncateTextWrapper"
import useTruncate, { TruncateFrom, UseTruncateOptions } from "../.."

interface UseTruncateDemoProps {
  /**
   * Raw un-truncated string. Will render in full if small enough for the container. Will be truncated otherwise
   */
  originalString: string
  /**
   * Controls behavior of truncation. See Truncate component stories for descriptions of each option
   */
  options?: UseTruncateOptions
}

const UseTruncateDemo = ({
  originalString,
  options = {
    from: TruncateFrom.End,
    startOffset: 0,
    endOffset: 0,
    disableWarnings: false,
  },
}: UseTruncateDemoProps) => {
  const [text, ref] = useTruncate(originalString, options)
  return <TruncateTextWrapper ref={ref}>{text}</TruncateTextWrapper>
}

export const renderDemoArgs = (args: UseTruncateDemoProps) => {
  const optionsString = args.options
    ? JSON.stringify(args.options, null, 2).replace(/\n/g, "\n    ")
    : ""
  return `
const SomeComponent = () => {
  const [text, ref] = useTruncate(${optionsString ? "\n    " : ""}"${
    args.originalString
  }"${optionsString ? "," : ")"}
    ${optionsString}${optionsString ? "\n  )" : ""}
  return <div ref={ref}>{text}</div>
}
`
}

export default UseTruncateDemo
