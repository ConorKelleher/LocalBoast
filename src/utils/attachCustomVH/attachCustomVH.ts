export const attachCustomVH = () => {
  // https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
  const resetVHProperty = () => {
    const vh = window.innerHeight * 0.01
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty("--vh", `${vh}px`)
  }
  window.addEventListener("resize", resetVHProperty)
  resetVHProperty()
}

export default attachCustomVH
