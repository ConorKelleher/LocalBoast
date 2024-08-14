import { PropsWithChildren } from "react"

const PortalDemoBackground = ({ children }: PropsWithChildren) => (
  <div
    style={{
      position: "fixed",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      inset: 0,
      backgroundColor: "rgba(0, 0, 0, 0.3",
    }}
  >
    {children}
  </div>
)

export default PortalDemoBackground
