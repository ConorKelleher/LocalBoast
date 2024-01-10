import { useCallback, useEffect, useState } from "react"
import useTwitchChatBot from "./useTwitchChatBot"
import { useUpdatingRef } from "hooks"

export type OnMessage = (newMessages: string[], allMessages: string[]) => void

interface UseTwitchChatBotMessages {
  oauthToken: string | null
  username: string | null
  onMessage?: OnMessage
}

const useTwitchChatBotMessages = ({
  username,
  oauthToken,
  onMessage,
}: UseTwitchChatBotMessages) => {
  const [chats, setChats] = useState<string[]>([])
  const { connect, part, disconnect, joined, joining, error } =
    useTwitchChatBot()
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
    chatError: error,
    disconnect: useCallback(() => {
      disconnect && disconnect()
      clearChats()
    }, [disconnect, clearChats]),
  }
}

export default useTwitchChatBotMessages
