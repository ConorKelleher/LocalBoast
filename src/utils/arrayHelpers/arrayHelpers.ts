export const first = <T>(arr: T[]) => arr[0]
export const last = <T>(arr: T[]) => arr[arr.length - 1]
export const shallowEqual = (arrA: any[], arrB: any[]) =>
  arrA.length === arrB.length &&
  arrA.every((entryA, index) => arrB[index] === entryA)
