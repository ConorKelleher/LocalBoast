import {
  useImageLoader,
  UseImageLoaderOptions,
  USE_IMAGE_LOADER_DEFAULT_OPTIONS,
} from "localboast"

export interface UseImageWithFallbackOptions extends UseImageLoaderOptions {
  fallbackSrc: string
}
export const USE_IMAGE_WITH_FALLBACK_DEFAULT_OPTIONS = {
  ...USE_IMAGE_LOADER_DEFAULT_OPTIONS,
}

export const useImageWithFallback = ({
  fallbackSrc,
  src,
  ...otherImageLoaderOptions
}: UseImageWithFallbackOptions) => {
  const { loading, failedToLoad } = useImageLoader({
    src,
    ...otherImageLoaderOptions,
  })

  return loading || !failedToLoad ? src : fallbackSrc
}
export default useImageWithFallback
