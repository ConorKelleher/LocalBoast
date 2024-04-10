import useLocalStorage from "localboast/hooks/useLocalStorage"

const UseLocalStorageTypedDemo = () => {
  // Default value is null - must explicitly type it
  const [typedValue, setTypedValue, clearTypedValue] = useLocalStorage<
    object | null
  >("lb-ls-demo-typed", null)

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      Typed Value is: {JSON.stringify(typedValue)}
      <div style={{ display: "flex" }}>
        <button
          onClick={() =>
            setTypedValue((oldValue) => (oldValue ? null : { test: true }))
          }
        >
          Toggle value from `object` to `null`
        </button>
        <button onClick={clearTypedValue}>Reset Typed Value</button>
      </div>
    </div>
  )
}

export default UseLocalStorageTypedDemo
