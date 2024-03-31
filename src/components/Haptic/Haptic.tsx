import useHaptic, {
  USE_HAPTIC_DEFAULT_OPTIONS,
  UseHapticOptions,
} from "localboast/hooks/useHaptic"
import { merge } from "localboast/utils/objectHelpers"

export interface HapticProps
  extends UseHapticOptions,
    Omit<
      React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
      >,
      "onClick"
    > {}

export const HAPTIC_DEFAULT_PROPS = {
  ...USE_HAPTIC_DEFAULT_OPTIONS,
}

export const Haptic = ({ children, ...otherProps }: HapticProps) => {
  const {
    onClick,
    events,
    focusScaleMultiplier,
    clickScaleMultiplier,
    focusMs,
    blurMs,
    clickMs,
    returnMs,
    ...otherMergedProps
  } = merge(HAPTIC_DEFAULT_PROPS, otherProps)

  const [{ style: hapticStyle, ...otherHapticProps }] = useHaptic({
    onClick,
    events,
    focusScaleMultiplier,
    clickScaleMultiplier,
    focusMs,
    blurMs,
    clickMs,
    returnMs,
  })

  return (
    <div
      {...otherMergedProps}
      style={{
        ...hapticStyle,
        height: "fit-content",
        width: "fit-content",
        display: "flex",
        ...otherProps.style,
      }}
      {...otherHapticProps}
    >
      {children}
    </div>
  )
}

Haptic.defaultProps = HAPTIC_DEFAULT_PROPS

export default Haptic
