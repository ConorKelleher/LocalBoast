import {
  Dispatch,
  DispatchWithoutAction,
  Reducer,
  ReducerAction,
  ReducerState,
  ReducerStateWithoutAction,
  ReducerWithoutAction,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from "react"
import useUpdatingRef from "../useUpdatingRef"
import useRecall, { UseRecallOptions } from "./useRecall"

// All of the following type signatures are stole directly from the useReducer typings.
// All implementations in reality are the same however, passing args straight through to useReducer,
// with additional recallOptions object
export function useRecallReducer<
  R extends ReducerWithoutAction<any>,
  I,
  S = string,
>(
  reducer: R,
  initializerArg: I,
  initializer: (arg: I) => ReducerStateWithoutAction<R>,
  recallOptions?: UseRecallOptions<ReducerState<R>, S>,
): [
  ReducerStateWithoutAction<R>,
  DispatchWithoutAction,
  ReturnType<typeof useRecall>,
]
export function useRecallReducer<
  R extends ReducerWithoutAction<any>,
  S = string,
>(
  reducer: R,
  initializerArg: ReducerStateWithoutAction<R>,
  initializer?: undefined,
  recallOptions?: UseRecallOptions<ReducerState<R>, S>,
): [
  ReducerStateWithoutAction<R>,
  DispatchWithoutAction,
  ReturnType<typeof useRecall>,
]
export function useRecallReducer<R extends Reducer<any, any>, I, S = string>(
  reducer: R,
  initializerArg: I & ReducerState<R>,
  initializer: (arg: I & ReducerState<R>) => ReducerState<R>,
  recallOptions?: UseRecallOptions<ReducerState<R>, S>,
): [ReducerState<R>, Dispatch<ReducerAction<R>>, ReturnType<typeof useRecall>]
export function useRecallReducer<R extends Reducer<any, any>, I, S = string>(
  reducer: R,
  initializerArg: I,
  initializer: (arg: I) => ReducerState<R>,
  recallOptions?: UseRecallOptions<ReducerState<R>, S>,
): [ReducerState<R>, Dispatch<ReducerAction<R>>, ReturnType<typeof useRecall>]
export function useRecallReducer<R extends Reducer<any, any>, S = string>(
  reducer: R,
  initialState: ReducerState<R>,
  initializer?: undefined,
  recallOptions?: UseRecallOptions<ReducerState<R>, S>,
): [ReducerState<R>, Dispatch<ReducerAction<R>>, ReturnType<typeof useRecall>]
export function useRecallReducer<
  R extends Reducer<any, any> | ReducerWithoutAction<any>,
  S = string,
>(
  reducer: any,
  initialArg: any,
  init?: any,
  recallOptions?: UseRecallOptions<ReducerState<R>, S>,
): [ReducerState<R>, Dispatch<ReducerAction<R>>, ReturnType<typeof useRecall>] {
  const reducerRef = useUpdatingRef(reducer)

  // Reducer can't make imperative actions so if undo/redo is passed to it, have to enqueue that for next render
  const [needsUndo, setNeedsUndo] = useState(false)
  const [needsRedo, setNeedsRedo] = useState(false)

  const wrapperReducer = useCallback(
    (oldState: ReducerState<R>, action: ReducerAction<R>) => {
      if (action?.type === "undo") {
        // `dispatch({ type: "undo" })` passed to reducer - enqueue underlying undo
        setNeedsUndo(true)
        return oldState
      } else if (action?.type === "redo") {
        // `dispatch({ type: "reo" })` passed to reducer - enqueue underlying redo
        setNeedsRedo(true)
        return oldState
      } else if (action?.type === "setRecallState") {
        // Recall state updated - use whatever state it passes us
        return action.payload
      }
      return reducerRef.current(oldState, action)
    },
    [reducerRef],
  )

  const [state, dispatch] = useReducer(wrapperReducer, initialArg, init)
  const recallData = useRecall(state, recallOptions)
  const { undo: undoImmediate, redo: redoImmediate } = recallData
  const currentStateRef = useUpdatingRef(state)
  const currentRecallStateRef = useUpdatingRef(recallData.currentState)

  // Execute any undo/redo actions we've enqueued via reducer
  useEffect(() => {
    if (needsUndo) {
      undoImmediate()
      setNeedsUndo(false)
    }
  }, [needsUndo, undoImmediate])
  useEffect(() => {
    if (needsRedo) {
      redoImmediate()
      setNeedsRedo(false)
    }
  }, [needsRedo, redoImmediate])

  // If stack index changes and our states don't match, use the recall state (undo/redo must have happened)
  useEffect(() => {
    if (currentStateRef.current !== currentRecallStateRef.current) {
      dispatch({
        type: "setRecallState",
        payload: currentRecallStateRef.current,
      } as ReducerAction<R>)
    }
  }, [recallData.index, currentStateRef, currentRecallStateRef])

  return [state, dispatch, recallData]
}

export default useRecallReducer
