import useLocalStorage from "localboast/hooks/useLocalStorage"

const UseLocalStorageBooleanDemo = () => {
  // Default value is number - automatically types it as "number" and knows to serialize/deserialize normally
  const [booleanValue, setBooleanValue, clearBooleanValue] = useLocalStorage(
    "lb-ls-demo-boolean",
    true,
  )

  return (
    <div style={{ display: "flex" }}>
      <input
        type="checkbox"
        checked={booleanValue}
        onChange={(e) => setBooleanValue(e.target.checked)}
      />
      <button onClick={clearBooleanValue}>Reset Boolean</button>
    </div>
  )
}

export default UseLocalStorageBooleanDemo
