import { useSize } from "localboast"

export const useFooterPadding = () => {
  const { size, setRef } = useSize()

  return {
    FooterPadding: () => <div style={size || undefined} />,
    setFooterRef: setRef,
  }
}

export default useFooterPadding
