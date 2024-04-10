import useLocalStorage from "localboast/hooks/useLocalStorage"

const UseLocalStorageTextDemo = () => {
  // Default value is string - automatically types it as "string" and knows it doesn't have to serialize/deserialize
  const [stringValue, setStringValue, clearStringValue] = useLocalStorage(
    "lb-ls-demo-string",
    "This is the default string. Change this and it'll persist",
  )

  return (
    <div style={{ display: "flex" }}>
      <input
        type="text"
        value={stringValue}
        onChange={(e) => setStringValue(e.target.value)}
      />
      <button onClick={clearStringValue}>Reset String</button>
    </div>
  )
}

export default UseLocalStorageTextDemo
