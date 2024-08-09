import { useMemo } from "react"

const counts: Record<string, number> = {}

// Hook that leverages mutation of a file-scoped record of strings to numbers to allow tracking counts of instances of anything
// Each time a new component/hook calls this hook (or updates the groupName attribute), a new record is added for the provided groupName
// (or the current count increases if there's already a count).
// This counter doesn't decrement (to avoid clashes with existing instances). It lives in memory and will go away only when the process ends
// Useful for getting a unique id per component/hook instance (e.g. ensuring each Portal component gets a unique portal index for ids)
export const useInstanceCounter = (groupName?: string) => {
  const count = useMemo(() => {
    const groupIndex = groupName || ""
    const newCount = (counts[groupIndex] || 0) + 1
    counts[groupIndex] = newCount
    return newCount
  }, [groupName])

  return count
}

export default useInstanceCounter
