import { useCallback } from "react"
import {
  useTwitchChatBotAuth,
  useTwitchChatBotMessages,
  UseTwitchChatBotAuthOptions,
  USE_TWITCH_CHAT_BOT_AUTH_DEFAULT_OPTIONS,
  OnTwitchChatMessage,
  merge,
} from "localboast"

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
