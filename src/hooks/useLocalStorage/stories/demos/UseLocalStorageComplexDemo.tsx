import { generateRandomId } from "localboast/utils"
import useLocalStorage from "localboast/hooks/useLocalStorage"

export type ComplexType = {
  uniqueId?: string
  actualData: string
}

export const customStringify = (complexDataArray: ComplexType[]) => {
  const simplifiedDataArray = complexDataArray.map((complexData) => {
    const simplifiedData = { ...complexData }
    delete simplifiedData.uniqueId
    return simplifiedData
  })
  return JSON.stringify(simplifiedDataArray)
}
export const customParse = (complexString: string) => {
  const complexData: ComplexType[] = JSON.parse(complexString)
  complexData.map((data) => {
    data.uniqueId = generateRandomId()
  })
  return complexData
}

const UseLocalStorageComplex = () => {
  // Default value is complex - automatically typed but we can specify custom parser, stringifier
  const [complexValue, setComplexValue, clearComplexValue] = useLocalStorage(
    "lb-ls-demo-complex",
    [] as ComplexType[],
    { parse: customParse, stringify: customStringify },
  )
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      Full Data is:
      <pre>{JSON.stringify(complexValue, null, 2)}</pre>
      (actualData will persist but uniqueId isn't persisted - gets recreated
      each serialization/deserialization)
      <div style={{ display: "flex" }}>
        <button
          onClick={() =>
            setComplexValue((oldValue) => [
              ...oldValue,
              {
                actualData: generateRandomId(),
                uniqueId: generateRandomId(),
              },
            ])
          }
        >
          Add new entry
        </button>
        <button
          onClick={() => setComplexValue((oldValue) => oldValue.slice(0, -1))}
        >
          Remove last entry
        </button>
        <button onClick={clearComplexValue}>Reset Complex Value</button>
      </div>
    </div>
  )
}

export default UseLocalStorageComplex
