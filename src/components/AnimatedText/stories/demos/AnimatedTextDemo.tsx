import { AnimatedTextProps } from "localboast/components/AnimatedText"
import AnimatedTextButtonDemo from "./AnimatedTextButtonDemo"
import AnimatedTextLoopingDemo from "./AnimatedTextLoopingDemo"

export type AnimatedTextDemoType = "button" | "plain"
interface AnimatedTextDemoProps extends AnimatedTextProps {
  type: AnimatedTextDemoType
}

const AnimatedTextDemo = ({ type, ...other }: AnimatedTextDemoProps) => {
  if (type === "button") {
    return <AnimatedTextButtonDemo {...other} />
  }
  return <AnimatedTextLoopingDemo {...other} />
}

export default AnimatedTextDemo
