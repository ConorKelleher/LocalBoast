import useAnimationFrames from "localboast/hooks/useAnimationFrames"
import { useEffect, useState } from "react"

const fullWidth = 500
const UseAnimationFramesDemo = () => {
  const [x, setX] = useState(0)
  const [destination, setDestination] = useState(fullWidth)
  const { start } = useAnimationFrames()

  // Will recursively create animation frames for 5 seconds, and call back progress
  useEffect(() => {
    start((progress) => {
      // Multiply progress by total distance to travel and set this as new x pos
      const distanceTravelled = progress * fullWidth
      setX(destination ? distanceTravelled : fullWidth - distanceTravelled)

      if (progress === 1) {
        // If reached end of animation, switch direction
        setDestination((destination) => (destination ? 0 : fullWidth))
      }
    }, 3000)
  }, [start, destination])

  return (
    <div style={{ position: "relative", width: fullWidth, height: 100 }}>
      <div
        style={{
          position: "absolute",
          backgroundColor: "#278fa1",
          height: 100,
          width: 100,
          top: 0,
          left: x,
        }}
      ></div>
    </div>
  )
}

export default UseAnimationFramesDemo
