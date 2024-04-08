import useTwitchChat, {
  USE_TWITCH_CHAT_DEFAULT_OPTIONS,
  UseTwitchChatOptions,
} from "../../useTwitchChat"

const UseTwitchChatDemo = (props: UseTwitchChatOptions) => {
  const {
    authIFrameRef,
    username,
    authenticate,
    logOut,
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
  } = useTwitchChat(props)

  return chats
}

UseTwitchChatDemo.defaultProps = USE_TWITCH_CHAT_DEFAULT_OPTIONS

export default UseTwitchChatDemo
