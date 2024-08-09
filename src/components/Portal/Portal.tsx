import usePortal, {
  USE_PORTAL_DEFAULT_OPTIONS,
  UsePortalOptions,
} from "localboast/hooks/usePortal"
import { PropsWithChildren } from "react"

export interface PortalProps extends PropsWithChildren, UsePortalOptions {}

export const PORTAL_DEFAULT_PROPS = {
  ...USE_PORTAL_DEFAULT_OPTIONS,
}

export const Portal = ({ children, ...portalOptions }: PortalProps) => {
  const renderPortal = usePortal(portalOptions)

  return renderPortal(children)
}

export default Portal
