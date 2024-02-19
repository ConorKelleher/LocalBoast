export const svgToDataUri = (svg: string) =>
  `url("data:image/svg+xml,${encodeURIComponent(svg)}") 0 0, pointer`
