import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react"
import PropTypes from "prop-types"
import MagicGrid from "magic-grid"

const MagicGridWrapper = ({ children, ...props }, ref) => {
  const container = useRef(null)
  const grid = useRef(null)

  useEffect(() => {
    let timeout
    // magic-grid handles resizing via its own `listen` method
    // unfortunately event listener it creates is not being cleaned up
    // that's why we don't use it and have our own instead
    // see: https://github.com/e-oj/Magic-Grid/issues/24
    const resize = () => {
      if (!timeout)
        timeout = setTimeout(() => {
          grid.current && grid.current.positionItems()
          timeout = null
        }, 200)
    }

    if (!grid.current) {
      grid.current = new MagicGrid({ container: container.current, ...props })
      window.addEventListener("resize", resize)
    }

    grid.current.positionItems()

    return () => {
      window.removeEventListener("resize", resize)
    }
  })

  useImperativeHandle(ref, () => ({
    positionItems: () => {
      grid.current && grid.current.positionItems()
    },
  }))

  return <div ref={container}>{children}</div>
}

MagicGridWrapper.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node),
}

export default forwardRef(MagicGridWrapper)
