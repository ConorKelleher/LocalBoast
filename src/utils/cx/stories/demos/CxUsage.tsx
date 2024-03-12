import cx from "localboast/utils/cx"

const SomeComponent = ({
  disabled,
  primary,
}: {
  disabled: boolean
  primary: boolean
}) => {
  return (
    <button
      className={cx("button-class", {
        ["button-disabled"]: disabled,
        ["button-primary"]: primary,
      })}
    >
      Click Me
    </button>
  )
}
