import { typography } from "@storybook/theming"
import { create } from "@storybook/theming/create"

const SHARED_THEME = {
  brandTitle: "LocalBoast",
  // brandUrl: process.env?.NODE_ENV === "development" ? "./" : "/docs",
  brandImage:
    "https://s3.eu-west-1.amazonaws.com/localboast.com/icons/ColourTransparentWide.png",
  brandTarget: "_self",
  // fontBase: "Urbanist",
  // fontCode: "Fira Code",
  // typography: typography.size,
  //{
  //   type: {
  //     // primary: '"Nunito Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
  //     primary: "Urbanist",
  //   },
  //   weight: {
  //     regular: "400",
  //     bold: "700",
  //     extrabold: "800",
  //     black: "900",
  //   },
  // size: {
  //   s1: 16,
  //   s2: 18,
  //   s3: 20,
  //   m1: 24,
  //   m2: 28,
  //   m3: 32,
  //   l1: 36,
  //   l2: 44,
  //   l3: 52,
  // },
  // },
}

export const DARK_THEME = create({
  ...SHARED_THEME,
  base: "dark",
})

export const LIGHT_THEME = create({
  ...SHARED_THEME,
  base: "light",
})
