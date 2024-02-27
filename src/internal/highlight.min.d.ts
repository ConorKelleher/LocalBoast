declare namespace hljs {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Node {}

  export function highlightAll(): void
  export function highlightElement(el: HTMLElement): void
}

export = hljs
export as namespace hljs
