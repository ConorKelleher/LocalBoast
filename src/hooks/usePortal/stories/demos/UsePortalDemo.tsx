import usePortal, {
  USE_PORTAL_DEFAULT_OPTIONS,
  UsePortalOptions,
} from "localboast/hooks/usePortal"
import { useState } from "react"
import PortalDemoBackground from "./PortalDemoBackground"

const UsePortalDemo = (portalOptions: UsePortalOptions) => {
  const renderPortal = usePortal(portalOptions)
  const [portalOpen, setPortalOpen] = useState(false)
  return (
    <>
      <button onClick={() => setPortalOpen(true)}>Open Portal</button>

      {renderPortal(
        portalOpen && (
          <PortalDemoBackground>
            Portal Now Open.
            <button onClick={() => setPortalOpen(false)}>
              Click here to close it
            </button>
          </PortalDemoBackground>
        ),
      )}
    </>
  )
}

export default UsePortalDemo

UsePortalDemo.defaultProps = {
  ...USE_PORTAL_DEFAULT_OPTIONS,
  containerEl: document.body,
}
