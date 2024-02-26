import { useMove } from "localboast"

export const UseMoveDemo = () => {
  const [setHandle, offset] = useMove()
  return (
    <p style={{ textAlign: "center" }}>
      This is a{" "}
      <strong
        ref={(ref) => ref && setHandle(ref)}
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px)`,
          userSelect: "none",
          cursor: "move",
          display: "inline-block",
        }}
      >
        SERIOUS
      </strong>{" "}
      sentence.
      <br />
      <br />
      Don't try to make it less so by grabbing my emboldened word or anything.
    </p>
  )
}

export const renderDemoArgs = () => {
  return `export const UseMoveDemo = () => {
  const [setHandle, offset] = useMove()
  return (
    <p style={{ textAlign: "center" }}>
      This is a{" "}
      <strong
        ref={(ref) => ref && setHandle(ref)}
        style={{
          transform: \`translate(\${offset.x}px, \${offset.y}px)\`,
          userSelect: "none",
          cursor: "move",
          display: "inline-block",
        }}
      >
        SERIOUS
      </strong>{" "}
      sentence.
      <br />
      <br />
      Don't try to make it less so by grabbing my emboldened word or anything.
    </p>
  )
}`
}
