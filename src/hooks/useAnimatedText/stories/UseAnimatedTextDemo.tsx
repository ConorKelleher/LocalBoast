import { UseAnimatedTextOptions } from "localboast"
import AnimatedTextDemo, {
  AnimatedTextDemoType,
} from "components/AnimatedText/stories/demos/AnimatedTextDemo"

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
