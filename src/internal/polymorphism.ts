import {
  ComponentPropsWithRef,
  ComponentType,
  CSSProperties,
  ElementType,
} from "react"

export type PolymorphicComponentProps<
  C extends ElementType,
  Props = object,
> = ComponentPropsWithRef<C> &
  Props & {
    component?: C
  }

export type PolymorphicExtraProps = {
  style?: CSSProperties
  component?: ElementType
}

export function withPolymorphism<D extends ElementType, P>(
  component: ComponentType,
) {
  type ComponentProps<C extends ElementType> = PolymorphicComponentProps<C, P>

  type PolymorphicAttributes = <C extends ElementType = D>(
    props: ComponentProps<C>,
  ) => React.ReactElement
  type StaticAttributes = ComponentType<ComponentProps<any>>

  type PolymorphicComponent = PolymorphicAttributes & StaticAttributes

  return component as PolymorphicComponent
}
