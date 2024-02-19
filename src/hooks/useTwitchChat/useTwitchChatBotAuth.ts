import { useCallback, useEffect, useRef, useState } from "react"
import { generateRandomId } from "utils"
import { useUpdatingRef } from "hooks"
import {
  LS_KEY_TWITCH_AUTH_TOKEN,
  LS_KEY_TWITCH_CSRF_TOKEN,
} from "constants/twitchConstants"

const getAuthUrl = (chatBotClientId: string, uid: string) =>
  `
  https://id.twitch.tv/oauth2/authorize
  ?response_type=token
  &client_id=${chatBotClientId}
  &redirect_uri=${encodeURIComponent(window.location.origin + "/twitch_auth")}
  &scope=chat%3Aread&state=${uid}
  `.replace(/\s/g, "")

const getValidateUrl = () => "https://id.twitch.tv/oauth2/validate"

const checkTokenValid = async (token: string) => {
  const res = await fetch(getValidateUrl(), {
    method: "GET",
    headers: { Authorization: `OAuth ${token}` },
  })
  if (res.status !== 200) {
    return {
      isValid: false,
      username: null,
    }
  }
  // get token username + compare with provided
  const data = await res.json()
  return {
    isValid: true,
    username: data.login,
  }
}

type Dimensions = {
  height: number
  width: number
}
export enum WindowOption {
  Tab,
  Popup,
  Iframe,
}
export interface UseTwitchChatBotAuthOptions {
  botId: string
  window?: WindowOption
  popupDimensions?: Dimensions
}

export const DEFAULT_OPTIONS = {
  window: WindowOption.Popup,
  popupDimensions: { height: 500, width: 700 },
}

const POLLING_INTERVAL = 500

const getPersistedAuthToken = () =>
  localStorage.getItem(LS_KEY_TWITCH_AUTH_TOKEN)

const useTwitchChatBotAuth = (options: UseTwitchChatBotAuthOptions) => {
  const [oauthToken, setOauthToken] = useState<string | null>(
    getPersistedAuthToken,
  )
  const authWindowRef = useRef<Window | null>(null)
  const authIFrameRef = useRef<HTMLIFrameElement | null>(null)
  const [pollingForToken, setPollingForToken] = useState(false)
  const [username, setUsername] = useState<string | null>(null)
  const [validating, setValidating] = useState(false)
  const mergedOptions: UseTwitchChatBotAuthOptions = {
    ...DEFAULT_OPTIONS,
    ...options,
  }
  const mergedOptionsRef = useUpdatingRef(mergedOptions)
  const oauthTokenRef = useUpdatingRef(oauthToken)

  const closeNewWindows = useCallback(() => {
    if (authWindowRef.current) {
      // Maybe this _can_ be done inside the actual auth page. Not sure though
      authWindowRef.current.close()
      authWindowRef.current = null
    }
    if (authIFrameRef.current) {
      if (authIFrameRef.current.parentNode) {
        authIFrameRef.current.parentNode.removeChild(authIFrameRef.current)
      }
      authIFrameRef.current = null
    }
  }, [])

  const triggerAuth = useCallback(() => {
    if (!oauthTokenRef.current) {
      const { botId } = mergedOptionsRef.current
      const uid = generateRandomId()
      localStorage.setItem(LS_KEY_TWITCH_CSRF_TOKEN, uid)
      setPollingForToken(true)

      let openWindowOptions = undefined
      switch (mergedOptionsRef.current.window) {
        // @ts-expect-error Want fallthrough to pass a setting onto the next case
        case WindowOption.Popup:
          openWindowOptions = `height=${
            mergedOptionsRef.current.popupDimensions!.height
          },width=${mergedOptionsRef.current.popupDimensions!.width}`
        // eslint-disable-next-line no-fallthrough
        case WindowOption.Tab:
          authWindowRef.current = window.open(
            getAuthUrl(botId, uid),
            "Twitch Auth",
            openWindowOptions,
          )
          break
        case WindowOption.Iframe:
          authIFrameRef.current = document.createElement("iframe")
          authIFrameRef.current.src = getAuthUrl(botId, uid)
          break
      }
    }
  }, [oauthTokenRef, mergedOptionsRef])

  /**
   * Checks validity of provided token and handles success/failure states
   * - If valid, set username and token to state + clear loader
   * - If invalid, clear state and LS values and trigger auth/clear loader
   */
  const validateToken = useCallback(async (token: string) => {
    setValidating(true)
    const { isValid, username } = await checkTokenValid(token)
    setValidating(false)
    if (isValid) {
      setUsername(username)
      setOauthToken(token)
    } else {
      localStorage.removeItem(LS_KEY_TWITCH_AUTH_TOKEN)
      setOauthToken(null)
      setUsername(null)
    }
  }, [])

  const pollAuthInLs = useCallback(async () => {
    const accessToken = localStorage.getItem(LS_KEY_TWITCH_AUTH_TOKEN)

    if (accessToken) {
      setPollingForToken(false)
      closeNewWindows()
      validateToken(accessToken)
    } else {
      setTimeout(pollAuthInLs, POLLING_INTERVAL)
    }
  }, [closeNewWindows, validateToken])

  const unauthenticate = useCallback(() => {
    localStorage.removeItem(LS_KEY_TWITCH_AUTH_TOKEN)
    localStorage.removeItem(LS_KEY_TWITCH_CSRF_TOKEN)
    setOauthToken(null)
    setPollingForToken(false)
    setUsername(null)
    closeNewWindows()
  }, [closeNewWindows])

  // When polingForToken first becomes true, start the actual polling
  useEffect(() => {
    if (pollingForToken) {
      setTimeout(pollAuthInLs, POLLING_INTERVAL)
    }
  }, [pollingForToken, pollAuthInLs])

  // If we have persisted token and aren't validating, validate it
  useEffect(() => {
    if (oauthToken && !username && !validating) {
      // authing but no auth window - revalidating token
      validateToken(oauthToken)
    }
  }, [oauthToken, username, validating, validateToken])

  const authenticated = !!(oauthToken && username)

  return {
    authenticated,
    oauthToken,
    username,
    authenticating: !authenticated && (pollingForToken || validating),
    authenticate: triggerAuth,
    unauthenticate,
    authIFrameRef,
  } as const
}

export default useTwitchChatBotAuth
