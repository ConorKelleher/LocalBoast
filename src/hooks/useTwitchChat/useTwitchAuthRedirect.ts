import { useEffect, useState } from "react"
import parseURLParams from "localboast/utils/parseUrlParams"
import useLocalStorage from "localboast/hooks/useLocalStorage"
import {
  LS_KEY_TWITCH_AUTH_TOKEN,
  LS_KEY_TWITCH_CSRF_TOKEN,
} from "localboast/constants/twitchConstants"

const useTwitchAuthRedirect = () => {
  const { access_token, state } = parseURLParams(window.location.hash)
  const [csrfToken, , clearCsrfToken] = useLocalStorage(
    LS_KEY_TWITCH_CSRF_TOKEN,
  )
  const [, setAuthToken] = useLocalStorage(LS_KEY_TWITCH_AUTH_TOKEN)
  const [error, setError] = useState(
    access_token
      ? null
      : "Error: No access_token hash found in url. Authentication failed I guess todo: add actual error handling",
  )

  useEffect(() => {
    if (access_token && typeof access_token === "string") {
      if (state !== csrfToken) {
        setError(
          "Error: Mismatching CSRF token. Received: " +
            state +
            ", expecting: " +
            csrfToken,
        )
        return
      }
      clearCsrfToken()
      setAuthToken(access_token)
    }
  }, [access_token, state, csrfToken, clearCsrfToken, setAuthToken])

  return {
    error,
    csrfToken,
    accessToken: access_token,
  }
}

export default useTwitchAuthRedirect
