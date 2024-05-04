// Trick to turn a record of (potentially optional) types into a required set of keys, comparable with enum values
// https://medium.com/terria/typescript-transforming-optional-properties-to-required-properties-that-may-be-undefined-7482cb4e1585
type AllKeys<T extends Record<any, any>> = {
  [P in keyof Required<T>]: number
}

// Trick to enforce that an enum satisfies an interface
// https://stackoverflow.com/a/54098539
export type VerifyOptions<
  I extends Record<any, any>,
  _E extends AllKeys<I>,
> = true

// Way to separate props into two lists - ones from an enum and unknown ones
export const collectEnumValues = (
  source: Record<any, any>,
  e: Record<any, any>,
) => {
  const inEnum = Object.fromEntries(
    Object.entries(source).filter(([key]) => e[key]),
  )
  const notInEnum = Object.fromEntries(
    Object.entries(source).filter(([key]) => !e[key]),
  )
  return [inEnum, notInEnum] as const
}
