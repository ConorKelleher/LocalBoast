import Transition, { TransitionProps } from "localboast/components/Transition"
import { generateRandomId } from "localboast/utils"
import { useState } from "react"

const TransitionDemo = (props: TransitionProps) => {
  const [instanceIndex, setInstanceIndex] = useState(0)
  const [enabled, setEnabled] = useState(true)
  const checkboxId = `transitionDemoToggle_${generateRandomId()}`
  return (
    <div
      style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
    >
      <Transition key={instanceIndex} {...props} shouldTransition={enabled} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
          <label htmlFor={checkboxId}>Transition Enabled?</label>
          <input
            id={checkboxId}
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
          />
        </div>
        <button
          style={{ marginLeft: 30 }}
          onClick={() => setInstanceIndex((oldIndex) => oldIndex + 1)}
        >
          Reset
        </button>
      </div>
    </div>
  )
}

TransitionDemo.defaultProps = Transition.defaultProps
export type TransitionDemo = typeof Transition

export default TransitionDemo
