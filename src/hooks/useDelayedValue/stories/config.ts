import { StoryConfig } from "storybook_utils/packageConstants"

export default {
  description: `Nifty little hook to add a delay when changing a value. When the provided value changes, automatically creates a self-cleaning timeout to update its local state (which is then returned).
  
  Useful for providing visual delays in response to state changes, e.g.:

  \`\`\`javascript
  const [showThankYouPrompt] = useDelayedValue(hasAllowedCookies)
  \`\`\`
  
  <p>Provides multiple back-doors for setting state immediately. The returned value is an array where the first value is the delayed value and the second value is a function that cancels the timeout and syncs the values immediately.
  There is also an optional \`immediateIf\` function that can be provided to determine when to bypass the timeout, e.g.:</p>
  
  \`\`\`javascript
  const [modalOpen] = useDelayedValue(showFeedback, { immediateIf: (value) => value === false })
  \`\`\`
`,
  metaMutations: {
    argTypes: {
      value: {
        control: "text",
      },
    },
  },
  stories: [
    {
      name: "DelayedValue",
      args: {
        value: "Change Me",
      },
    },
  ],
} as StoryConfig
