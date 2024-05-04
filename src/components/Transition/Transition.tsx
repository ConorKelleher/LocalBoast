import useTransition, {
  USE_TRANSITION_DEFAULT_OPTIONS,
  UseTransitionOptions,
  UseTransitionOptionsKeys,
  UseTransitionType,
} from "localboast/hooks/useTransition"
import { merge } from "localboast/utils/objectHelpers"
import {
  PolymorphicProps,
  withPolymorphism,
} from "localboast/internal/polymorphism"
import { collectEnumValues } from "localboast/internal/assertTypes"
import { ElementType } from "react"

type _TransitionProps = {
  type: UseTransitionType
} & UseTransitionOptions

const DEFAULT_COMPONENT = "div"
type DEFAULT_COMPONENT = typeof DEFAULT_COMPONENT

export const TRANSITION_DEFAULT_PROPS = {
  type: UseTransitionType.scale,
  component: DEFAULT_COMPONENT,
  ...USE_TRANSITION_DEFAULT_OPTIONS,
}

const Transition = withPolymorphism<_TransitionProps, DEFAULT_COMPONENT>(
  (props, ref) => {
    const mergedProps = merge(TRANSITION_DEFAULT_PROPS, props)
    const [useTransitionOptions, otherProps] = collectEnumValues(
      mergedProps,
      UseTransitionOptionsKeys,
    )
    const { component, type, ...polymorphicProps } = otherProps
    const transitionStyles = useTransition(type, useTransitionOptions)
    const Component = component as ElementType

    return (
      <Component
        ref={ref}
        {...polymorphicProps}
        style={{ ...transitionStyles, ...polymorphicProps.style }}
      />
    )
  },
  "Transition",
)
export type TransitionProps = PolymorphicProps<_TransitionProps>

export default Transition
