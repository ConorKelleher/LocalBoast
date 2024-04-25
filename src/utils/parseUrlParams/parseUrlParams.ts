const parseURLParams = (paramsString: string) => {
  // remove optional # or ? from start of string
  const trimmedParams = decodeURIComponent(paramsString.replace(/^[#?]/, ""))
  const splitParams = trimmedParams.split("&")
  const paramsObj: Record<string, string> = {}
  splitParams.forEach((splitParam) => {
    const [key, value] = splitParam.split("=")
    paramsObj[key] = value || ""
  })
  return paramsObj
}

export default parseURLParams
