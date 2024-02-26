# LocalBoast - Make your React App a bit more extra.

![BannerImage](assets/icons/ColourSolidWide.jpeg)

[![npm](https://img.shields.io/npm/dm/localboast)](https://www.npmjs.com/package/localboast)

This is the full LocalBoast React library.

- GitHub: https://github.com/ConorKelleher/LocalBoast
- npm: https://www.npmjs.com/package/LocalBoast

INSERT_HOW_TO_INSTALL_HERE

# Contents

INSERT_CONTENTS_HERE

# To Use

This library includes a range of [**Components**](https://github.com/ConorKelleher/localboast/tree/main/src/components), [**Hooks**](https://github.com/ConorKelleher/localboast/tree/main/src/hooks) and [**Utils**](https://github.com/ConorKelleher/localboast/tree/main/src/utils). These are all able to be used independently and are intended to provide quick access to powerful functionality.

Each of the core folders provides an index of the exported contents, allowing you to directly import from specific places in the app, e.g.:

```javascript
import { Truncate } from "localboast/dist/components"
import { useMove } from "localboast/dist/hooks"
import { cx } from "localboast/dist/utils"
```

All of these exported elements are also exported from the root index, allowing for cleaner imports like:

```javascript
import { Truncate, useMove, cx } from "localboast"
```

INSERT_FOOTER_HERE
