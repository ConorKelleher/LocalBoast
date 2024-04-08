import { StoryConfig } from "storybook_utils/packageConstants"

const TWITCH_CHAT_BOT_CLIENT_ID = "7g4xkdxusodkut4ykeocfhci6grf6s"

export default {
  name: "useTwitchChat",
  description: `Hook to handle authentication and reading of messages from the chat of a given twitch channel.`,
  stories: [
    {
      name: "TwitchChat",
      args: {
        botId: TWITCH_CHAT_BOT_CLIENT_ID,
      },
    },
  ],
} as StoryConfig
