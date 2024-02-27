import { useCallback, useEffect, useState } from "react"
import useUpdatingRef from "localboast/hooks/useUpdatingRef"
import {
  useTwitchChatBot,
  UseTwitchChatBotOptions,
  USE_TWITCH_CHAT_BOT_DEFAULT_OPTIONS,
} from "localboast/hooks/useTwitchChat/useTwitchChatBot"

export type OnTwitchChatMessage = (
  newMessages: string[],
  allMessages: string[],
) => void

export interface UseTwitchChatBotMessagesOptions
  extends UseTwitchChatBotOptions {
  oauthToken: string | null
  username: string | null
  onMessage?: OnTwitchChatMessage
}

export const USE_TWITCH_CHAT_BOT_MESSAGES_DEFAULT_OPTIONS = {
  ...USE_TWITCH_CHAT_BOT_DEFAULT_OPTIONS,
}

export const useTwitchChatBotMessages = ({
  username,
  oauthToken,
  onMessage,
  ...chatBotOptions
}: UseTwitchChatBotMessagesOptions) => {
  const [chats, setChats] = useState<string[]>([])
  const { connect, part, disconnect, joined, joining, reconnecting, error } =
    useTwitchChatBot(chatBotOptions)
  const onMessageRef = useUpdatingRef(onMessage)

  const joinChannel = useCallback(
    (channel?: string) => {
      if (username) {
        const channelToJoin = channel || username
        connect(oauthToken!, channelToJoin, username, (newChats: string[]) => {
          setChats((oldChats) => {
            const newAllChats = [...oldChats, ...newChats]
            if (onMessageRef.current) {
              onMessageRef.current(newChats, newAllChats)
            }
            return newAllChats
          })
        })
      }
    },
    [connect, oauthToken, username, onMessageRef],
  )

  const clearChats = useCallback(() => {
    setChats([])
  }, [])

  // Disconnect on unmount
  useEffect(() => {
    return disconnect
  }, [disconnect])

  return {
    chats,
    clearChats,
    joinChannel,
    leaveChannel: part,
    chatJoined: joined,
    chatJoining: joining,
    chatReconnecting: reconnecting,
    chatError: error,
    disconnect: useCallback(() => {
      disconnect && disconnect()
      clearChats()
    }, [disconnect, clearChats]),
  }
}

export default useTwitchChatBotMessages
