import Portal, {
  PORTAL_DEFAULT_PROPS,
  PortalProps,
} from "localboast/components/Portal"
import PortalDemoBackground from "localboast/hooks/usePortal/stories/demos/PortalDemoBackground"
import { useState } from "react"

const PortalDemo = (props: PortalProps) => {
  const [portalOpen, setPortalOpen] = useState(false)
  return (
    <>
      <button onClick={() => setPortalOpen(true)}>Open Portal</button>

      <Portal {...props}>
        {portalOpen && (
          <PortalDemoBackground>
            Portal Now Open.
            <button onClick={() => setPortalOpen(false)}>
              Click here to close it
            </button>
          </PortalDemoBackground>
        )}
      </Portal>
    </>
  )
}

export default PortalDemo

PortalDemo.defaultProps = {
  ...PORTAL_DEFAULT_PROPS,
  containerEl: document.body,
}
