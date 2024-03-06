import { StoryConfig } from "storybook_utils/packageConstants"
import { directReference } from "localboast/storybook_utils/helpers"

const fullString =
  "This is my full, unadulterated string. This is sadly too long for the container. Try resizing the window or expanding the side panel to see this truncation in effect"

export default {
  description: `Component to allow any rendered string to be programmatically truncated with customizable truncation position, offsets and ellipsis.<br>
  This wraps the <strong>useTruncate</strong> component to allow ease-of use with JSX.`,
  alternative: "useTruncate",
  imports: 'import { TruncateFrom } from "localboast/components/Truncate"',
  metaMutations: {
    parameters: {
      docs: {
        source: {
          transform: (originalString: string) => {
            return originalString
              .replace(/ +tag={{((.|\n)(?!}}))+(.|\n)}}\n?/, "") // Remove tag prop
              .replace(/<Truncate\s+>/, "<Truncate>") // Remove whitespace if no other props than tag
          },
        },
      },
    },
    argTypes: {
      tag: {
        control: {
          type: null,
        },
      },
    },
  },
  stories: [
    {
      name: "TruncateEnd",
      args: {
        children: fullString,
        // tag: directReference("TruncateDemo"),
      },
    },
    {
      name: "TruncateMiddle",
      args: {
        children: fullString,
        from: directReference("TruncateFrom.middle"),
        // tag: directReference("TruncateDemo"),
      },
    },
    {
      name: "TruncateStart",
      args: {
        children: fullString,
        from: directReference("TruncateFrom.start"),
        // tag: directReference("TruncateDemo"),
      },
    },
    {
      name: "TruncateOffsetStart",
      args: {
        children: fullString,
        from: directReference("TruncateFrom.start"),
        startOffset: 4,
        // tag: directReference("TruncateDemo"),
      },
    },
    {
      name: "TruncateOffsetEnd",
      args: {
        children: fullString,
        endOffset: 4,
        // tag: directReference("TruncateDemo"),
      },
    },
    {
      name: "TruncateMiddleOffsetEnd",
      args: {
        children: fullString,
        from: directReference("TruncateFrom.middle"),
        endOffset: 15,
        // tag: directReference("TruncateDemo"),
      },
    },
    {
      name: "TruncateMiddleOffsetStart",
      args: {
        children: fullString,
        from: directReference("TruncateFrom.middle"),
        startOffset: 15,
        // tag: directReference("TruncateDemo"),
      },
    },
  ],
} as StoryConfig
