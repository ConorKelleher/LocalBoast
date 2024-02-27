import { useCallback } from "react"
import {
  useTwitchChatBotAuth,
  UseTwitchChatBotAuthOptions,
} from "localboast/hooks/useTwitchChat/useTwitchChatBotAuth"
import {
  useTwitchChatBotMessages,
  OnTwitchChatMessage,
} from "localboast/hooks/useTwitchChat/useTwitchChatBotMessages"
import { merge } from "localboast/utils/objectHelpers"
// Have to import the following separately to avoid circular dependencies
import { USE_TWITCH_CHAT_BOT_AUTH_DEFAULT_OPTIONS } from "./useTwitchChatBotAuth"

export interface UseTwitchChatOptions extends UseTwitchChatBotAuthOptions {
  onMessage?: OnTwitchChatMessage
}

export const USE_TWITCH_CHAT_DEFAULT_OPTIONS = {
  ...USE_TWITCH_CHAT_BOT_AUTH_DEFAULT_OPTIONS,
}

export const useTwitchChat = (options: UseTwitchChatOptions) => {
  const mergedOptions = merge(USE_TWITCH_CHAT_DEFAULT_OPTIONS, options)
  const {
    authenticated,
    oauthToken,
    username,
    authenticating,
    authenticate,
    unauthenticate,
    authIFrameRef,
  } = useTwitchChatBotAuth(mergedOptions)
  const {
    chats,
    clearChats,
    joinChannel,
    disconnect: disconnectChat,
    leaveChannel,
    chatJoined,
    chatJoining,
    chatReconnecting,
    chatError,
  } = useTwitchChatBotMessages({
    oauthToken,
    username,
    onMessage: mergedOptions.onMessage,
  })

  return {
    authIFrameRef,
    username,
    authenticate,
    logOut: useCallback(() => {
      unauthenticate()
      disconnectChat && disconnectChat()
    }, [unauthenticate, disconnectChat]),
    authenticated,
    authenticating,
    chats,
    disconnectChat,
    clearChats,
    joinChannel,
    leaveChannel,
    chatJoined,
    chatJoining,
    chatReconnecting,
    chatError,
  }
}

export default useTwitchChat
