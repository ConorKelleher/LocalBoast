// Trick to turn a record of (potentially optional) types into a required set of keys, comparable with enum values
// https://medium.com/terria/typescript-transforming-optional-properties-to-required-properties-that-may-be-undefined-7482cb4e1585
type AllKeys<T extends Record<any, any>> = {
  [P in keyof Required<T>]: number
}

// Trick to enforce that an enum satisfies an interface
// https://stackoverflow.com/a/54098539
export type InterfaceIsImplemented<
  I extends Record<any, any>,
  _E extends AllKeys<I>,
> = true

// Way to separate props into two lists - ones from an enum and unknown ones
export const collectEnumValues = <
  T extends Record<any, any>,
  E extends Record<any, any>,
>(
  source: T,
  e: E,
) => {
  const inEnum = Object.fromEntries(
    Object.entries(source).filter(([key]) => e[key]),
  ) as Pick<T, keyof typeof e>
  const notInEnum = Object.fromEntries(
    Object.entries(source).filter(([key]) => !e[key]),
  ) as Omit<T, keyof typeof e>
  return [inEnum, notInEnum] as const
}
