# LocalBoast - Make your React App a bit more extra.

![BannerImage](assets/icons/ColourSolidWide.jpeg)

[![npm](https://img.shields.io/npm/dm/localboast)](https://www.npmjs.com/package/localboast)
[![Ko-Fi](https://shields.io/badge/kofi-Buy_Me_a_Coffee-ffffff?logo=ko-fi&label=)](http://ko-fi.com/localboast)
[![Support me on Patreon](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Fshieldsio-patreon.vercel.app%2Fapi%3Fusername%3Dlocalboast%26type%3Dpatrons&style=flat)](https://patreon.com/localboast)
[![YouTube Channel Subscribers](https://img.shields.io/youtube/channel/subscribers/UCt-IaL4qQsOU6_rbS7zky1Q?label=Subscribers&style=flat&logo=Youtube)](http://youtube.com/channel/UCt-IaL4qQsOU6_rbS7zky1Q/live)
[![Twitch Channel](https://img.shields.io/twitch/status/localboast?label=Twitch&style=flat&logo=Twitch)](http://twitch.tv/localboast)

# What is it?

**LocalBoast** is a React library developed with a view to creating spectacle with as little effort as possible. If something doesn't sound very practical but would probably look cool, it belongs here.

The intention is to remain with zero dependencies (other than some borrowed code here and there) so a lot of the library consists of common functions from other repos (function debouncing, resize detection etc.) but with an API that's custom-built to work with the flashier parts of this library. So yes, some wheels are being reinvented in the name of creating a pointlessly flashy car but, in fairness, most wheels are boring.

INSERT_HOW_TO_INSTALL_HERE

# Contents

INSERT_CONTENTS_HERE

# To Use

This library includes a range of [**Components**](https://github.com/ConorKelleher/localboast/tree/main/src/components), [**Hooks**](https://github.com/ConorKelleher/localboast/tree/main/src/hooks) and [**Utils**](https://github.com/ConorKelleher/localboast/tree/main/src/utils). These are all able to be used independently and are intended to provide quick access to powerful functionality.

All public elements of this library are exported from the root index, allowing for simple imports like:

```javascript
import { Truncate, useMove, debounce } from "localboast"
```

Each of the core folders also provides an index of the exported contents, potentially saving on some unneeded imports:

```javascript
import { Truncate } from "localboast/components"
import { useMove } from "localboast/hooks"
import { debounce } from "localboast/utils"
```

Each module can also be imported directly from their own folder, allowing for largest optimization:

```javascript
import Truncate from "localboast/components/Truncate"
import useMove from "localboast/hooks/useMove"
import debounce from "localboast/utils/debounce"
```

INSERT_FOOTER_HERE
