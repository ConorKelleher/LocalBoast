import { useSize } from "hooks"

const useFooterPadding = () => {
  const { size, setRef } = useSize()

  return {
    FooterPadding: () => <div style={size || undefined} />,
    setFooterRef: setRef,
  }
}

export default useFooterPadding
