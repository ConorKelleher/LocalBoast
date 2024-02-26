import { useRotate } from "localboast"

export const UseRotateDemo = () => {
  const [setHandle, rotation] = useRotate()
  return (
    <p style={{ textAlign: "center" }}>
      This is a{" "}
      <strong
        ref={(ref) => ref && setHandle(ref)}
        style={{
          transform: `rotate(${rotation}deg)`,
          display: "inline-block",
        }}
      >
        SERIOUS
      </strong>{" "}
      sentence.
      <br />
      <br />
      Don't try to make it less so by dragging the edges of my emboldened word
      or anything.
    </p>
  )
}

export const renderDemoArgs = () => {
  return `todo`
}
