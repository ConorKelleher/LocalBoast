import { ActionIcon, Button, Group } from "@mantine/core"
import { IconRocket } from "@tabler/icons-react"
import Haptic, {
  HAPTIC_DEFAULT_PROPS,
  HapticProps,
} from "localboast/components/Haptic"

const HapticDemo = (props: HapticProps) => {
  return (
    <Group>
      <Haptic style={{ cursor: "pointer" }} {...props}>
        <ActionIcon size="lg" style={{ pointerEvents: "none" }}>
          <IconRocket />
        </ActionIcon>
      </Haptic>

      <Haptic
        {...props}
        events={{ focus: true, click: false }}
        style={{ cursor: "pointer" }}
      >
        <Button style={{ pointerEvents: "none" }}>
          Haptic on focus but not click
        </Button>
      </Haptic>

      <Haptic
        {...props}
        events={{ focus: false, click: true }}
        style={{ cursor: "pointer" }}
      >
        <Button style={{ pointerEvents: "none" }}>
          Haptic on click but not focus
        </Button>
      </Haptic>
    </Group>
  )
}

HapticDemo.defaultProps = HAPTIC_DEFAULT_PROPS

export default HapticDemo
