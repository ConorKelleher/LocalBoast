import { generateRandomId } from "localboast/utils"
import useLocalStorage from "localboast/hooks/useLocalStorage"

const UseLocalStorageArrayDemo = () => {
  // Default value is array of numbers - automatically types it as number[] and knows to serialize/deserialize normally
  const [arrayValue, setArrayValue, clearArrayValue] = useLocalStorage(
    "lb-ls-demo-array",
    [generateRandomId()],
  )

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <ul>
        {arrayValue.map((val, index) => (
          <li key={index}>{val}</li>
        ))}
      </ul>
      <div style={{ display: "flex" }}>
        <button
          onClick={() =>
            setArrayValue((oldArray) => [...oldArray, generateRandomId()])
          }
        >
          Add Random Item
        </button>
        <button
          onClick={() => setArrayValue((oldArray) => oldArray.slice(0, -1))}
          disabled={!arrayValue.length}
        >
          Remove Last Item
        </button>
        <button onClick={clearArrayValue}>Reset Array</button>
      </div>
    </div>
  )
}

export default UseLocalStorageArrayDemo
