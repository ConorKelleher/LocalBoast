import useImageLoader, {
  USE_IMAGE_LOADER_DEFAULT_OPTIONS,
  UseImageLoaderOptions,
} from "localboast/hooks/useImageLoader"

interface UseImageLoaderDemoProps extends UseImageLoaderOptions {
  /**
   * Not a direct attribute of the hook. Simply here for the demo to replicate usage of the ImageWithFallback component
   */
  fallbackSrc?: string
}
const UseImageLoaderDemo = ({
  src,
  fallbackSrc,
  load,
}: UseImageLoaderDemoProps) => {
  const { loading, loaded, failedToLoad } = useImageLoader({ src, load })
  const cantLoadSrc = load && failedToLoad
  const shouldUseFallbackSrc = cantLoadSrc && !!fallbackSrc

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <span>
        Trying to load{" "}
        <a href={src} target="_blank" rel="noopener norefferer">
          this src
        </a>
        .
      </span>
      {cantLoadSrc ? (
        <span>
          Couldn't load it.{" "}
          {fallbackSrc ? (
            <>
              So loading{" "}
              <a href={fallbackSrc} target="_blank" rel="noopener norefferer">
                fallback
              </a>{" "}
              instead.
            </>
          ) : (
            "No fallback provided"
          )}
        </span>
      ) : null}
      <img
        src={shouldUseFallbackSrc ? fallbackSrc : src}
        height={100}
        width={100}
      />
      <span>
        <strong>loading: </strong>
        {loading.toString()}
      </span>
      <span>
        <strong>loaded: </strong>
        {loaded.toString()}
      </span>
      <span>
        <strong>failedToLoad: </strong>
        {failedToLoad.toString()}
      </span>
    </div>
  )
}

UseImageLoaderDemo.defaultProps = USE_IMAGE_LOADER_DEFAULT_OPTIONS

export default UseImageLoaderDemo
