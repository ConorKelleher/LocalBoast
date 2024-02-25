import { StoryTypes, StoryConfig } from "storybook_utils/packageConstants.ts"
import AnimatedTextDemo from "./AnimatedTextDemo"

export default {
  type: StoryTypes.Component,
  name: "AnimatedText",
  description: `Component to allow per-character animating of any string. Simply pass in a string or array of strings as children and the component will pass through a self-updating string animating each character that is different from the previous children.`,
  alternative: "useAnimatedText",
  component: AnimatedTextDemo,
  usage: `import { AnimatedText } from "localboast"

const texts = [
  "This is the first string",
  "This is the second string",
] 

const SomeComponent = () => {
  const [textIndex, setTextIndex] = useState(0)
  const textToAnimate = texts[textIndex]

  useInterval(() => {
    setTextIndex((oldIndex) => (oldIndex + 1) % texts.length)
  }, 5000)

  return (
    <AnimatedText>
      {textToAnimate}
    </AnimatedText>
  )
}`,
} as StoryConfig
