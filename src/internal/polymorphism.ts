import {
  ComponentPropsWithRef,
  CSSProperties,
  ElementType,
  forwardRef,
  ForwardRefRenderFunction,
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
  component: ForwardRefRenderFunction<HTMLElement, P>,
  displayName: string,
) {
  type ComponentProps<C extends ElementType> = PolymorphicComponentProps<C, P>

  type PolymorphicAttributes = <C extends ElementType = D>(
    props: ComponentProps<C>,
  ) => React.ReactElement
  type StaticAttributes = ForwardRefRenderFunction<
    HTMLElement,
    ComponentProps<any>
  >

  type PolymorphicComponent = PolymorphicAttributes & StaticAttributes

  const wrappedComponent = forwardRef<HTMLElement, P>(
    component as PolymorphicComponent,
  )
  wrappedComponent.displayName = displayName

  return wrappedComponent
}
