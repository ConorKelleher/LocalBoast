import { Button, Stack, Text } from "@mantine/core"
import useDelayedValue, {
  USE_DELAYED_VALUE_DEFAULT_OPTIONS,
  UseDelayedValueOptions,
} from "../../useDelayedValue"

interface UseDelayedValueDemoProps extends UseDelayedValueOptions {
  value: any
}

const UseDelayedValueDemo = ({
  value,
  ...options
}: UseDelayedValueDemoProps) => {
  const [delayedValue, setImmediate] = useDelayedValue(value, options)

  return (
    <Stack justify="center" align="center">
      <Text>
        Update the value in the controls section, and notice it doesn't update
        here until a delay.
      </Text>
      <Text>
        Value is: <strong>{value}</strong>
      </Text>
      <Text>
        Delayed value is: <strong>{delayedValue}</strong>
      </Text>
      <Button onClick={setImmediate}>Sync immediate</Button>
    </Stack>
  )
}

UseDelayedValueDemo.defaultProps = {
  ...USE_DELAYED_VALUE_DEFAULT_OPTIONS,
}

export default UseDelayedValueDemo
