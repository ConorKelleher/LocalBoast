import { merge } from "localboast/utils"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import useUpdatingRef from "../useUpdatingRef"
import useKeyboard from "../useKeyboard"

export interface UseRecallOptions<D, S> {
  // By default, standard keyboard events for undo/redo are detected and used here. Set this to true to disable this behavior
  disableKeyboard?: boolean
  // Function called on the provided state value before persisting to the stack.
  // Defaults to JSON.stringify. A custom function can be provided for optimization or for edge cases.
  // Recommended return value is string or other primitive to save on memory and allow direct comparison to work.
  // If you wish to return and persist complex objects, you must provide a custom "comparator" function to allow comparison
  // of complex entries
  serialize?: (deserialized: D) => S
  // Function called on the state values persisted in the history to bring them back into a usable fashion.
  // Should act as the inverse of whatever serialize function is provided (if provided).
  deserialize?: (serialized: S) => D
  // Function used to compare serialized states. If not provided, direct comparison "===" will be used
  // This can be ignored if no serialize/deserialize functions are provided or if the value returned from a custom
  // serialization function can be compared through direct comparison (e.g. strings, numbers, other primitives)
  comparator?: (serializedA: S, serializedB: S) => boolean
}
export const USE_RECALL_DEFAULT_OPTIONS = {
  serialize: JSON.stringify,
  deserialize: JSON.parse,
  disableKeyboard: false,
}
export const useRecall = <D, S = string>(
  paramState: D,
  options?: UseRecallOptions<D, S>,
) => {
  const mergedOptions = merge(USE_RECALL_DEFAULT_OPTIONS, options)
  const mergedOptionsRef = useUpdatingRef(mergedOptions)
  const [stackState, setStackState] = useState(() => [
    mergedOptions.serialize(paramState),
  ])
  const stackStateRef = useUpdatingRef(stackState)
  const [stateIndex, setStateIndex] = useState(0)
  const stateIndexRef = useRef(stateIndex)
  const currentStateSerialized = stackState[stateIndex]
  const currentStateSerializedRef = useUpdatingRef(currentStateSerialized)
  const currentStateDeserialized = useMemo(
    () => mergedOptionsRef.current.deserialize(currentStateSerialized),
    [mergedOptionsRef, currentStateSerialized],
  )
  const canUndo = stateIndex > 0
  const canRedo = stateIndex < stackState.length - 1

  const undo = useCallback(() => {
    const newIndex = Math.max(0, stateIndexRef.current - 1)
    setStateIndex(newIndex)
    stateIndexRef.current = newIndex
    return mergedOptionsRef.current.deserialize(stackStateRef.current[newIndex])
  }, [stackStateRef, mergedOptionsRef])
  const redo = useCallback(() => {
    const newIndex = Math.min(
      stateIndexRef.current + 1,
      stackStateRef.current.length - 1,
    )
    setStateIndex(newIndex)
    stateIndexRef.current = newIndex
    return mergedOptionsRef.current.deserialize(stackStateRef.current[newIndex])
  }, [stackStateRef, mergedOptionsRef])

  useKeyboard((key, e) => {
    if (!mergedOptions.disableKeyboard && (e.metaKey || e.ctrlKey)) {
      let intercept = false
      if (["Z", "z"].includes(key)) {
        intercept = true
        if (e.shiftKey) {
          if (canRedo) redo()
        } else {
          if (canUndo) undo()
        }
      } else if (["Y", "y"].includes(key)) {
        intercept = true
        if (canRedo) redo()
      }
      if (intercept) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
  })

  useEffect(() => {
    const newStateSerialized = mergedOptionsRef.current.serialize(paramState)
    const { comparator } = mergedOptionsRef.current
    const statesEqual = comparator
      ? comparator(
          newStateSerialized as S,
          currentStateSerializedRef.current as S,
        )
      : newStateSerialized === currentStateSerializedRef.current
    if (!statesEqual) {
      const newIndex = stateIndexRef.current + 1
      setStateIndex(newIndex)
      stateIndexRef.current = newIndex
      setStackState((oldStack) => [
        ...oldStack.slice(0, newIndex),
        newStateSerialized,
      ])
    }
  }, [paramState, currentStateSerializedRef, mergedOptionsRef])

  return {
    currentState: currentStateDeserialized,
    history: stackState,
    index: stateIndex,
    undo,
    redo,
    canUndo,
    canRedo,
  }
}

export default useRecall
