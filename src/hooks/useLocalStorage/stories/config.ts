import { StoryContext } from "@storybook/react"
import { StoryConfig } from "storybook_utils/packageConstants"
import UseLocalStorageStringDemoString from "./demos/UseLocalStorageUsage?raw"
import UseLocalStorageNumberDemoString from "./demos/UseLocalStorageNumberDemo?raw"
import UseLocalStorageBooleanDemoString from "./demos/UseLocalStorageBooleanDemo?raw"
import UseLocalStorageArrayDemoString from "./demos/UseLocalStorageArrayDemo?raw"
import UseLocalStorageTypedDemoString from "./demos/UseLocalStorageTypedDemo?raw"
import UseLocalStorageComplexDemoString from "./demos/UseLocalStorageComplexDemo?raw"

export default {
  description: `Hook to replicate usability of useState but with automatic persistence to/retrieval from localStorage`,
  metaMutations: {
    parameters: {
      docs: {
        source: {
          transform: (originalString: string, context: StoryContext) => {
            let demoText
            switch (context.allArgs.demoType) {
              case "string":
                demoText = UseLocalStorageStringDemoString
                break
              case "number": {
                demoText = UseLocalStorageNumberDemoString
                break
              }
              case "boolean": {
                demoText = UseLocalStorageBooleanDemoString
                break
              }
              case "array": {
                demoText = UseLocalStorageArrayDemoString
                break
              }
              case "typed": {
                demoText = UseLocalStorageTypedDemoString
                break
              }
              case "complex": {
                demoText = UseLocalStorageComplexDemoString
                break
              }
              default: {
                demoText = originalString
              }
            }
            return demoText
          },
        },
      },
    },
    argTypes: {
      demoType: {
        table: {
          disable: true,
        },
      },
      key: {
        control: {
          type: null,
        },
      },
      defaultValue: {
        control: {
          type: null,
        },
        table: {
          type: {
            summary: "T | () => T",
          },
        },
      },
      options: {
        control: {
          type: null,
        },
        table: {
          type: {
            summary: "UseLocalStorageOptions",
            detail: `{
  stringify?: (value: T) => string | undefined
  parse?: (value: string) => T | null
}`,
          },
        },
      },
    },
  },
  stories: [
    {
      name: "StringExample",
      args: { demoType: "string" },
    },
    {
      name: "NumberExample",
      args: { demoType: "number" },
    },
    {
      name: "BooleanExample",
      args: { demoType: "boolean" },
    },
    {
      name: "ArrayExample",
      args: { demoType: "array" },
    },
    {
      name: "TypedExample",
      args: { demoType: "typed" },
    },
    {
      name: "ComplexExample",
      args: { demoType: "complex" },
    },
  ],
} as StoryConfig
