import { useUpdatingRef } from "localboast/hooks/useUpdatingRef"
import cx from "localboast/utils/cx"
import generateRandomId from "localboast/utils/generateRandomId"
import { merge } from "localboast/utils/objectHelpers"
import { Size, useSize } from "localboast/hooks/useSize"
import { dasherize } from "localboast/utils/stringHelpers"
import { useCallback, useEffect, useRef } from "react"

const getSVGForegroundTransition = (ms: number) =>
  `transition: transform ${ms / 1000}s 0s ease-in-out`
const getSVGBackgroundTransition = (ms: number) =>
  `transition: opacity ${ms / 2000}s ${ms / 2000}s ease-in-out`
export enum UseWipeShape {
  Circle = "circle",
  Square = "rect",
}
export type SVGShape = UseWipeShape | string

export interface UseWipeOptions {
  ms?: number
  shape?: SVGShape
}
export const USE_WIPE_DEFAULT_OPTIONS = {
  ms: 2000,
  shape: UseWipeShape.Circle,
}

const getSVGContainer = () => {
  const container = document.createElement("div")

  container.id = "lb_svg_mask_container"
  container.style.position = "fixed"
  container.style.inset = "0"
  container.style.pointerEvents = "none"
  return container
}

const getSVGViewBox = (size: Size | null) =>
  `0 0 ${size?.width || 100} ${size?.height || 100}`
const getSVGRectDimensions = (size: Size | null) =>
  `${!size ? 100 : Math.min(size.height, size.width)}px`
const getSVGCircleRadius = (size: Size | null) =>
  `${!size ? 50 : Math.min(size.height, size.width) / 2}px`

const getNewSVG = (
  size: Size | null,
  options: UseWipeOptions,
  wipeId: string,
) => {
  const newSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg")
  newSVG.setAttribute("id", `lbWipeMaskSVG_${wipeId}`)
  newSVG.setAttribute("width", "100%")
  newSVG.setAttribute("height", "100%")
  newSVG.setAttribute("version", "1.1")
  newSVG.setAttribute("viewBox", getSVGViewBox(size))
  newSVG.setAttribute("xmlns", "http://www.w3.org/2000/svg")
  const shape = options.shape
  const ms = options.ms! // safe to assert since options were merged with defaults
  const isCustomSVGShape = !Object.values(UseWipeShape).includes(
    shape as UseWipeShape,
  )
  const shapeTagName = isCustomSVGShape ? "image" : shape

  newSVG.innerHTML = `<defs>
  <mask id="lbWipeMask_${wipeId}">
    <rect width="100%" height="100%" fill="white" style="${getSVGBackgroundTransition(
      ms,
    )}" />
    <${shapeTagName}
      fill="black"
      style="${cx(
        "transform: scale(0);",
        {
          "transform-origin: center;": shape !== UseWipeShape.Circle,
          "transform-box: fill-box;": shape !== UseWipeShape.Circle,
        },
        getSVGForegroundTransition(ms),
      )}"
      ${
        shape !== UseWipeShape.Circle
          ? `width="${getSVGRectDimensions(size)}"`
          : ""
      }
      ${
        shape !== UseWipeShape.Circle
          ? `height="${getSVGRectDimensions(size)}"`
          : ""
      }
      ${shape === UseWipeShape.Circle ? `r="${getSVGCircleRadius(size)}"` : ""}
      ${isCustomSVGShape ? `href="${shape}"` : ""}
    />
  </mask>
</defs>`
  return newSVG
}

const STYLE_VALUES_TO_IGNORE: CSSStyleValue[] = ["normal", "0s"]
const ZERO_STYLE_VALUES: CSSStyleValue[] = [0, "0", "0px"]
const ZERO_STYLE_KEYS_TO_IGNORE = [
  "padding-top",
  "padding-left",
  "padding-right",
  "padding-bottom",
  "margin-top",
  "margin-right",
  "margin-bottom",
  "margin-left",
]

const shouldIgnoreStyle = (styleName: string, styleValue: CSSStyleValue) =>
  STYLE_VALUES_TO_IGNORE.includes(styleValue) ||
  (ZERO_STYLE_VALUES.includes(styleValue) &&
    ZERO_STYLE_KEYS_TO_IGNORE.includes(styleName))

const stringifyStyles = (styles: CSSStyleDeclaration) => {
  return Object.values(styles)
    .map((styleName) => {
      const styleValue = styles[styleName as keyof typeof styles]
      // loose equality to rule out null or undefined
      if (styleValue != null && !shouldIgnoreStyle(styleName, styleValue)) {
        return `${dasherize(styleName)}: ${styleValue}`
      }
    })
    .filter(Boolean)
    .join("; ")
}

const applyElStyles = (el: HTMLElement, styles: CSSStyleDeclaration) => {
  const styleString = stringifyStyles(styles)
  el.style.cssText = styleString + +"; pointer-events: none !important"
}

const recursivelyCleanNode = (
  originalNode: Node | undefined,
  cloneNode: Node | undefined,
  providedNodesToRemove?: Node[],
) => {
  const nodesToRemove = providedNodesToRemove || []
  if (cloneNode && "removeAttribute" in cloneNode) {
    const originalEl = originalNode as HTMLElement
    const cloneEl = cloneNode as HTMLElement

    // Commenting out since this doesn't work yet :(
    // if (cloneEl.tagName === "IFRAME" && originalEl.tagName === "IFRAME") {
    //   recursivelyCleanNode(
    //     (originalEl as HTMLIFrameElement).contentDocument?.body,
    //     (cloneEl as HTMLIFrameElement).contentDocument?.body
    //   );
    // } else {
    for (
      let childIndex = 0;
      childIndex < cloneEl.childNodes.length;
      childIndex++
    ) {
      const nextCloneNode = cloneNode.childNodes[childIndex]
      const nextOriginalNode = originalNode?.childNodes[childIndex]
      recursivelyCleanNode(nextOriginalNode, nextCloneNode, nodesToRemove)
    }
    // }

    if (["STYLE", "SCRIPT"].includes(cloneEl.tagName)) {
      // Don't copy any non-display tag (scripts, stylesheets, etc.)
      nodesToRemove?.push(cloneNode)
      return
    }

    // Use original tag as source for styles (since get computed style has issues on newly created nodes)
    // Only exception is body tag, since that has a bunch of new stuff done to it
    const styleSource = cloneEl.tagName === "BODY" ? cloneEl : originalEl
    applyElStyles(cloneEl, window.getComputedStyle(styleSource))
    cloneEl.removeAttribute("id")
    cloneEl.removeAttribute("name")
    // Not removing class since it's essential for pseudoelements to persist
    // cloneEl.removeAttribute("class");
    cloneEl.scrollTop = originalEl.scrollTop
    cloneEl.scrollLeft = originalEl.scrollLeft
  }

  if (!providedNodesToRemove) {
    // at top-level call, perform removals AFTER recursion
    nodesToRemove.forEach((node) => node.parentNode?.removeChild(node))
  }
}

// eslint-disable-next-line
const copyIframeContents = (originalEl: HTMLElement, cloneEl: HTMLElement) => {
  Array.from(originalEl.getElementsByTagName("iframe")).forEach(
    (originalIframe, index) => {
      const newIframe = cloneEl.getElementsByTagName("iframe")[index]
      const htmlElementToCopy =
        originalIframe.contentDocument?.querySelector("html")
      if (htmlElementToCopy) {
        const copiedHtmlElement = htmlElementToCopy.cloneNode(
          true,
        ) as HTMLElement
        let newContentContainer: HTMLElement | Document
        if (newIframe.contentDocument) {
          const newIframeHtml = newIframe.contentDocument.querySelector("html")
          if (newIframeHtml) {
            newIframe.contentDocument.removeChild(newIframeHtml)
          }
          newContentContainer = newIframe.contentDocument
        } else {
          newContentContainer = newIframe
        }
        copyIframeContents(htmlElementToCopy, copiedHtmlElement)
        newContentContainer.appendChild(copiedHtmlElement)
      }
    },
  )
}

const deepClonePage = (originalPage: HTMLElement) => {
  const clonedPage = originalPage.cloneNode(true) as HTMLDivElement
  // Commenting out since this doesn't work yet :(
  // copyIframeContents(originalPage, clonedPage);
  return clonedPage
}

export const useWipe = (options?: UseWipeOptions) => {
  const { size, setRef: setSizeRef } = useSize()
  const svgContainerRef = useRef<HTMLDivElement>(getSVGContainer())
  const sizeRef = useUpdatingRef(size)
  const positionRef = useRef<HTMLElement | null>(null)
  const mergedOptionsRef = useUpdatingRef(
    merge(USE_WIPE_DEFAULT_OPTIONS, options),
  )

  // Append svg mask container on mount + remove on unmount
  useEffect(() => {
    const svgContainer = svgContainerRef.current
    setSizeRef(svgContainer)
    document.querySelector("html")!.appendChild(svgContainer)
    return () => {
      document.querySelector("html")!.removeChild(svgContainer)
    }
  }, [setSizeRef])

  const setupCloneRef = useRef((wipeId: string) => {
    const clone = deepClonePage(document.body)
    clone.style.position = "fixed"
    clone.style.zIndex = "9000"
    clone.style.inset = "0"
    clone.style.pointerEvents = "none"
    clone.style.mask = `url(#lbWipeMask_${wipeId})`
    const bodyTags = document.getElementsByTagName("body")
    for (let i = 1; i < bodyTags.length; i++) {
      // Increase each existing body dupe's z-index
      bodyTags[i].style.zIndex = (
        (parseInt(bodyTags[i].style.zIndex) || 0) + 1
      ).toString()
    }
    document.querySelector("html")!.appendChild(clone)
    recursivelyCleanNode(document.body, clone)
    setTimeout(() => {
      document.querySelector("html")!.removeChild(clone)
    }, mergedOptionsRef.current.ms)

    return clone
  })

  const setupSVGRef = useRef((wipeId: string) => {
    const newSVG = getNewSVG(sizeRef.current, mergedOptionsRef.current, wipeId)

    svgContainerRef.current.appendChild(newSVG)

    setTimeout(() => {
      svgContainerRef.current.removeChild(newSVG)
    }, mergedOptionsRef.current.ms)

    return newSVG
  })

  const animateRef = useRef((newSVG: SVGSVGElement) => {
    const maskBackgroundEl = newSVG.querySelector("mask")
      ?.children[0] as HTMLElement
    const maskShapeEl = newSVG.querySelector("mask")?.children[1] as HTMLElement
    if (!maskShapeEl || !maskBackgroundEl || !sizeRef.current) {
      return
    }
    const maskShapeTransition = maskShapeEl.style.transition
    const maskBackgroundTransition = maskBackgroundEl.style.transition

    maskShapeEl.style.transition = ""
    maskBackgroundEl.style.transition = ""

    let maskInsetAmount = 0
    const positionAdjustments = {
      x: 0,
      y: 0,
    }
    if (positionRef.current) {
      // todo - figure this out better so no position ref means centered object
      const positionRect = positionRef.current.getBoundingClientRect()
      positionAdjustments.x = positionRect.left + positionRect.width / 2
      positionAdjustments.y = positionRect.top + positionRect.height / 2
    }
    const smallestPageDimension = Math.min(
      sizeRef.current.height,
      sizeRef.current.width,
    )
    const largestPageDimension = Math.max(
      sizeRef.current.height,
      sizeRef.current.width,
    )

    if (mergedOptionsRef.current.shape !== UseWipeShape.Circle) {
      // rect is positioned by top-left pixel, have to inset it by half to get its center
      maskInsetAmount = smallestPageDimension / 2
    }
    const newTranslate = `translate(${
      positionAdjustments.x - maskInsetAmount
    }px, ${positionAdjustments.y - maskInsetAmount}px)`
    maskShapeEl.style.transform = `${newTranslate} scale(0)`
    maskBackgroundEl.style.opacity = "1"
    setTimeout(() => {
      maskShapeEl.style.transition = maskShapeTransition
      maskBackgroundEl.style.transition = maskBackgroundTransition
      setTimeout(() => {
        // todo - make this 2.5 value optional + get a better understanding of why it's needed
        const fullPageScale =
          2.5 * (largestPageDimension / smallestPageDimension)
        const oldTransform = maskShapeEl.style.transform
        const newTransform =
          oldTransform.replace(/scale\([^)]+\)/, "") + `scale(${fullPageScale})`

        maskShapeEl.style.transform = newTransform
        maskBackgroundEl.style.opacity = "0"
      })
    })
  })

  const wipe = useCallback(() => {
    const wipeId = generateRandomId()
    const newSVG = setupSVGRef.current(wipeId)
    setupCloneRef.current(wipeId)
    animateRef.current(newSVG)
  }, [])

  return {
    wipe,
    positionRef,
  }
}

export default useWipe
