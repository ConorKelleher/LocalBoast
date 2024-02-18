<!--- Auto-Generated Readme. Do not edit this. Instead edit the generateReadme function or the story's config.ts file --->
<h1>useTruncate</h1>Hook to allow any string rendered in the DOM to be programmatically truncated  with customizable truncation position, offsets and ellipsis.<br>
In most cases, the component-based solution (which simply wraps a call to this hook) is probably preferred.
<br><br>

See the component-based solution: [Truncate](https://github.com/conorkelleher/localboast/tree/main/src/components/Truncate)<br><h4>See [examples and full documentation](https://localboast.com/docs?path=/docs/hooks-usetruncate--docs)</h4>

<h3>Usage</h3>

```javascript
import { useTruncate } from "localboast"

const SomeComponent = () => {
  const [middleTruncatedText, ref] = useTruncate("This is my string that will be truncated", { from: TruncateFrom.Middle })

  return (
    <div ref={ref}>
      {middleTruncatedText}
    </div>
  )
}
```