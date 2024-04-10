import useLocalStorage from "localboast/hooks/useLocalStorage"

const UseLocalStorageNumberDemo = () => {
  // Default value is number - automatically types it as "number" and knows to serialize/deserialize normally
  const [numberValue, setNumberValue, clearNumberValue] = useLocalStorage(
    "lb-ls-demo-number",
    29,
  )

  return (
    <div style={{ display: "flex" }}>
      <input
        type="number"
        value={numberValue}
        onChange={(e) => setNumberValue(parseFloat(e.target.value))}
      />
      <button onClick={clearNumberValue}>Reset Number</button>
    </div>
  )
}

export default UseLocalStorageNumberDemo
