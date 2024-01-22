import AnimatedTextDemo, {
  AnimatedTextDemoType,
} from "components/AnimatedText/stories/AnimatedTextDemo"
import { UseAnimatedTextOptions } from "../useAnimatedText"

interface UseAnimatedTextDemoProps {
  text: string
  options?: UseAnimatedTextOptions
  type: AnimatedTextDemoType
}
const UseAnimatedTextDemo = (props: UseAnimatedTextDemoProps) => {
  return (
    <AnimatedTextDemo {...props.options} type={props.type}>
      {props.text}
    </AnimatedTextDemo>
  )
}

export default UseAnimatedTextDemo
