import { TruncateFrom, useTruncate } from "localboast/hooks/useTruncate"

const SomeComponent = () => {
  const [middleTruncatedText, ref] = useTruncate(
    "This is my string that will be truncated",
    { from: TruncateFrom.middle },
  )

  return <div ref={ref}>{middleTruncatedText}</div>
}
