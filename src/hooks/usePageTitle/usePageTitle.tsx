import { useLayoutEffect } from "react"

/**
 * Hook to set the page title to whatever string is passed
 * @param title: string - Will update the title to match this arg whenever it changes
 */
const usePageTitle = (title: string) => {
  // I _think_ this makes sense. Using layout effect to improve SEO, since title should be set BEFORE browser renders
  useLayoutEffect(() => {
    document.title = title
  }, [title])
}

export default usePageTitle
