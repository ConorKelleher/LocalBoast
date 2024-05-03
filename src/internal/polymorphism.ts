import {
  ComponentPropsWithoutRef,
  ComponentType,
  CSSProperties,
  ElementType,
  forwardRef,
  ReactElement,
  RefAttributes,
  ForwardRefRenderFunction,
  ComponentPropsWithRef,
} from "react"

type InheritedProps<C extends ElementType> = C extends ComponentType
  ? ComponentPropsWithoutRef<C>
  : ComponentPropsWithRef<C>

export type PolymorphicProps<
  Props = object,
  C extends ElementType = "div",
> = InheritedProps<C> & {
  style?: CSSProperties
  /**
   * Custom top-level Element type to render. Polymorphic, so any required props can be passed inline as normal
   */
  component?: C
} & Props &
  RefAttributes<HTMLElement>

export function withPolymorphism<P = object, D extends ElementType = "div">(
  component: ForwardRefRenderFunction<HTMLElement, PolymorphicProps<P, any>>,
  displayName: string,
) {
  // Generator for component props. Pass actual value to narrow props to a component type or "any" to get static props
  type ComponentProps<C extends ElementType> = PolymorphicProps<P, C>

  // Define polymorphic function component's attributes
  type PolymorphicAttributes = <C extends ElementType = D>(
    props: ComponentProps<C>,
  ) => ReactElement
  // Define static component attributes, omitting ones that can never exist
  type StaticAttributes = Omit<ComponentType<ComponentProps<any>>, never>

  // Join Poly and static types to get a single polymorphic component structure
  type PolymorphicComponent = PolymorphicAttributes & StaticAttributes

  // Wrap provided function with forwardRef
  const wrappedComponent = forwardRef<HTMLElement, PolymorphicProps<P, any>>(
    component,
  )

  // Cast wrapped component to our Polymorphic structure
  const polymorphicComponent = wrappedComponent as PolymorphicComponent

  // Enforcing display name passed in since forwardRef nukes that
  polymorphicComponent.displayName = displayName

  return polymorphicComponent
}
