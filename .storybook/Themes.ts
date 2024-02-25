import { typography } from "@storybook/theming"
import { create } from "@storybook/theming/create"

const SHARED_THEME = {
  brandTitle: "LocalBoast",
  brandUrl: process.env?.NODE_ENV === "development" ? "./" : "/docs",
  brandImage:
    "https://s3.eu-west-1.amazonaws.com/localboast.com/icons/ColourTransparentTall.png",
  brandTarget: "_self",
  typography: {
    type: {
      primary: '"Nunito Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
    },
    weight: {
      regular: "400",
      bold: "700",
      extrabold: "800",
      black: "900",
    },
    size: {
      s1: 12,
      s2: 14,
      s3: 16,
      m1: 20,
      m2: 24,
      m3: 28,
      l1: 32,
      l2: 40,
      l3: 48,
    },
  },
}

export const DARK_THEME = create({
  ...SHARED_THEME,
  base: "dark",
})

export const LIGHT_THEME = create({
  ...SHARED_THEME,
  base: "light",
})
