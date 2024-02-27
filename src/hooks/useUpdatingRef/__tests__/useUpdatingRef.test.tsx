import { screen } from "@testing-library/react"
// import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom"
import "test_utils/polyfils"
import mantineRender from "test_utils/mantineRender"
import useUpdatingRef from "localboast/hooks/useUpdatingRef"

interface UseUpdatingRefTestProps {
  value: unknown
}

const UseUpdatingRefTest = (props: UseUpdatingRefTestProps) => {
  const ref = useUpdatingRef(props.value)

  return (
    <>
      <div data-testid="propsValueOutput">{props.value!.toString()}</div>
      <div data-testid="refValueOutput">{ref.current!.toString()}</div>
    </>
  )
}

describe("useUpdatingRef Tests", () => {
  let rerender

  beforeEach(() => {
    ;({ rerender } = mantineRender(
      <UseUpdatingRefTest value="Test Initial Value" />,
    ))
  })

  test("values initialise correctly", () => {
    expect(screen.getByTestId("propsValueOutput")).toHaveTextContent(
      "Test Initial Value",
    )
    expect(screen.getByTestId("refValueOutput")).toHaveTextContent(
      "Test Initial Value",
    )
  })

  test("Ref value updates asynchronously after arg change", () => {
    rerender!(<UseUpdatingRefTest value="New Updated Value" />)

    expect(screen.getByTestId("propsValueOutput")).toHaveTextContent(
      "New Updated Value",
    )
    expect(screen.getByTestId("refValueOutput")).toHaveTextContent(
      "Test Initial Value",
    )

    rerender!(<UseUpdatingRefTest value="New Updated Value" />)

    expect(screen.getByTestId("propsValueOutput")).toHaveTextContent(
      "New Updated Value",
    )
    expect(screen.getByTestId("refValueOutput")).toHaveTextContent(
      "New Updated Value",
    )
  })
})
