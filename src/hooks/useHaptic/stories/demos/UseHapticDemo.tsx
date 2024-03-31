import { ActionIcon, Button, Group } from "@mantine/core"
import { IconRocket } from "@tabler/icons-react"
import useHaptic, {
  USE_HAPTIC_DEFAULT_OPTIONS,
  UseHapticOptions,
} from "localboast/hooks/useHaptic"

const UseHapticDemo = (props: UseHapticOptions) => {
  const [hapticProps1] = useHaptic(props)

  const [hapticProps2] = useHaptic({
    ...props,
    events: { focus: true, click: false },
  })

  const [hapticProps3] = useHaptic({
    ...props,
    events: { focus: false, click: true },
  })

  return (
    <Group>
      <div
        {...hapticProps1}
        style={{ cursor: "pointer", ...hapticProps1.style }}
      >
        <ActionIcon size="lg" style={{ pointerEvents: "none" }}>
          <IconRocket />
        </ActionIcon>
      </div>

      <div
        {...hapticProps2}
        style={{ cursor: "pointer", ...hapticProps2.style }}
      >
        <Button style={{ pointerEvents: "none" }}>
          Haptic on focus but not click
        </Button>
      </div>

      <div
        {...hapticProps3}
        style={{ cursor: "pointer", ...hapticProps3.style }}
      >
        <Button style={{ pointerEvents: "none" }}>
          Haptic on click but not focus
        </Button>
      </div>
    </Group>
  )
}

UseHapticDemo.defaultProps = USE_HAPTIC_DEFAULT_OPTIONS

export default UseHapticDemo
