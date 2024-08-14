import { merge } from "localboast/utils"
import { ReactNode, useCallback, useEffect, useMemo } from "react"
import { createPortal } from "react-dom"
import useUpdatingRef from "localboast/hooks/useUpdatingRef"
import { useInstanceCounter } from "localboast/hooks/useInstanceCounter"

export interface UsePortalOptions {
  // Reference to or getter that returns the existing element in the DOM to attach our portal element onto
  // Defaults to document.body
  containerEl?: HTMLElement | (() => HTMLElement)
  // Reference to or getter that returns the existing element in the DOM to use as the portal element
  // Omit to automatically create a new element
  portalEl?: HTMLElement | (() => HTMLElement)
  // HTML tag name to use when automatically creating a new portal element (only used when no value is specified for "portalEl")
  createdPortalTagName?: keyof HTMLElementTagNameMap
  // Options passed to "createElement" call when creating a new portal element (only used when no value is specified for "portalEl")
  createdPortalElementOptions?: ElementCreationOptions
  // Key-value collection of attributes to be assigned to the created portal element (e.g. { id: "my portal", class: "some-class"})
  createdPortalElementAttributes?: Record<string, string>
  // Key-value collection of style attributes to be set on the created portal element. Note: this is not a react-esque style object. This is raw CSS styles that are set directly on the DOM element (e.g. use "justify-content" instead of "justifyContent")
  createdPortalElementStyles?: Record<string, string | undefined>
  // Unique ID passed to the `createPortal` call. Not required but may be useful
  portalKey?: string
}

export const USE_PORTAL_DEFAULT_OPTIONS = {
  createdPortalTagName: "div",
  createdPortalElementAttributes: {},
  createdPortalElementStyles: {
    display: "contents",
    position: "absolute",
    inset: 0,
  },
}

export const usePortal = (options: UsePortalOptions) => {
  const portalCounter = useInstanceCounter("portal")
  const mergedOptions = merge(
    {
      ...USE_PORTAL_DEFAULT_OPTIONS,
      createdPortalElementAttributes: {
        ...USE_PORTAL_DEFAULT_OPTIONS.createdPortalElementAttributes,
        id: `lb-portal-${portalCounter}`,
      },
    },
    options,
  )
  const { portalEl: optionsPortalEl, containerEl: optionsContainerEl } =
    mergedOptions // exhaustive-deps complains if I reference options.portalEl directly in useMemo
  const mergedOptionsRef = useUpdatingRef(mergedOptions)
  const creatingNewElement = !mergedOptions.portalEl
  const portalEl = useMemo(() => {
    const needsNewPortalTag = !optionsPortalEl
    let el: HTMLElement
    if (needsNewPortalTag) {
      el = document.createElement(
        mergedOptions.createdPortalTagName,
        mergedOptions.createdPortalElementOptions,
      )
      Object.entries(
        mergedOptionsRef.current.createdPortalElementAttributes,
      ).forEach(([attributeKey, attributeValue]) => {
        el.setAttribute(attributeKey, attributeValue)
      })
      Object.entries(
        mergedOptionsRef.current.createdPortalElementStyles,
      ).forEach(([styleKey, styleValue]) => {
        if (styleValue !== undefined) {
          ;(el.style as any)[styleKey] = styleValue
        }
      })
    } else {
      el =
        (typeof optionsPortalEl === "function" && optionsPortalEl()) ||
        (optionsPortalEl as HTMLElement)
    }
    return el
  }, [
    optionsPortalEl,
    mergedOptionsRef,
    mergedOptions.createdPortalTagName,
    mergedOptions.createdPortalElementOptions,
  ])
  const containerEl = useMemo(
    () =>
      (typeof optionsContainerEl === "function" && optionsContainerEl()) ||
      (optionsContainerEl as HTMLElement) ||
      document.body,
    [optionsContainerEl],
  )

  useEffect(() => {
    if (creatingNewElement) {
      containerEl.appendChild(portalEl)
      return () => {
        containerEl.removeChild(portalEl)
      }
    }
  }, [creatingNewElement, portalEl, containerEl])
  1
  return useCallback(
    (children: ReactNode) =>
      createPortal(children, portalEl, mergedOptions.portalKey),
    [mergedOptions.portalKey, portalEl],
  )
}

export default usePortal
