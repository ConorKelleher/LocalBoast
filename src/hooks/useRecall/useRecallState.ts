import { Dispatch, SetStateAction, useEffect, useState } from "react"
import useUpdatingRef from "../useUpdatingRef"
import useRecall, { UseRecallOptions } from "./useRecall"

// All of the following type signatures are stole directly from the useState typings.
// All implementations in reality are the same however, passing args straight through to useState,
// with additional recallOptions object
export function useRecallState<D, S = string>(
  initialState: D | (() => D),
  recallOptions?: UseRecallOptions<D, S>,
): [D, Dispatch<SetStateAction<D>>, ReturnType<typeof useRecall>]
export function useRecallState<D = undefined>(): [
  D | undefined,
  Dispatch<SetStateAction<D | undefined>>,
  ReturnType<typeof useRecall>,
]
export function useRecallState<D, S = string>(
  initialState?: D | (() => D),
  recallOptions?: UseRecallOptions<D, S>,
): [
  D | undefined,
  Dispatch<SetStateAction<D | undefined>>,
  ReturnType<typeof useRecall>,
] {
  const [state, setState] = useState(initialState)
  const recallData = useRecall(state as D, recallOptions)

  const currentStateRef = useUpdatingRef(state)
  const currentRecallStateRef = useUpdatingRef(recallData.currentState)

  // If stack index changes and our states don't match, use the recall state (undo/redo must have happened)
  useEffect(() => {
    if (currentStateRef.current !== currentRecallStateRef.current) {
      setState(currentRecallStateRef.current)
    }
  }, [recallData.index, currentStateRef, currentRecallStateRef])

  return [state, setState, recallData]
}

export default useRecallState
