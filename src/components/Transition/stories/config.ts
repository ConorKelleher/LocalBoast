import { smileyBase64ImageURL } from "localboast/storybook_utils/constants"
import { StoryConfig } from "storybook_utils/packageConstants"

export default {
  description: `Component to add transitions to a JSX tag. Supports polymorphism to avoid adding additional wrapper divs.<br>
  This wraps the <strong>useTransition</strong> hook to allow ease-of use with JSX.`,
  alternative: "useTransition",
  metaMutations: {},
  stories: [
    {
      name: "ImmediateScale",
      args: {
        component: "img",
        src: smileyBase64ImageURL,
      },
    },
    {
      name: "DelayedRotate",
      args: {
        component: "img",
        src: smileyBase64ImageURL,
        delayMs: 2000,
        type: "rotate",
        rotation: 360,
        ms: 500,
      },
    },
    {
      name: "LoopingRotate",
      args: {
        component: "img",
        src: smileyBase64ImageURL,
        type: "rotate",
        behavior: "loop",
        ms: 500,
      },
    },
    {
      name: "MirroredScale",
      args: {
        component: "img",
        src: smileyBase64ImageURL,
        type: "scale",
        behavior: "mirror",
      },
    },
    {
      name: "MirroredLongInterval",
      args: {
        component: "img",
        src: smileyBase64ImageURL,
        type: "rotate",
        loopInterval: 2000,
        behavior: "mirror",
      },
    },
    {
      name: "PingPongRotate",
      args: {
        component: "img",
        src: smileyBase64ImageURL,
        type: "rotate",
        behavior: "ping-pong",
      },
    },
    {
      name: "PingPongDelayedStartRotate",
      args: {
        component: "img",
        src: smileyBase64ImageURL,
        type: "rotate",
        delayMs: 2000,
        behavior: "ping-pong",
      },
    },
    {
      name: "PingPongPan",
      args: {
        component: "img",
        src: smileyBase64ImageURL,
        type: "pan",
        behavior: "ping-pong",
        initialPanX: "-50%",
      },
    },
    {
      name: "LoopingMultiPan",
      args: {
        component: "img",
        src: smileyBase64ImageURL,
        behavior: "loop",
        initialPanX: "-100%",
        initialPanY: "-100%",
        panX: "100%",
        panY: "100%",
        type: ["panRight", "panDown"],
        ms: 1000,
        animationTimingFunction: "ease-in-out",
        loopInterval: 0,
      },
    },
  ],
} as StoryConfig
