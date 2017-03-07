import { PureComponent, PropTypes, cloneElement, createElement as h } from 'react'
import TransitionMotion from 'react-motion/lib/TransitionMotion'
import spring from 'react-motion/lib/spring'

export class Motion extends PureComponent {
  constructor (props) {
    super(props)

    this.renderCurrentStyles = this.renderCurrentStyles.bind(this)
    this.getKey = this.getKey.bind(this)
    this.getDefaultStyles = this.getDefaultStyles.bind(this)
    this.getStyles = this.getStyles.bind(this)
    this.willLeave = this.willLeave.bind(this)
    this.willEnter = this.willEnter.bind(this)
  }

  render () {
    const { data, onRemount, onUnmount, onComponentMount } = this.props

    return h(TransitionMotion, {
      defaultStyles: data.length && onComponentMount ? this.getDefaultStyles() : undefined,
      styles: this.getStyles(),
      willEnter: onRemount && this.willEnter,
      willLeave: onUnmount && this.willLeave,
      children: this.renderCurrentStyles
    })
  }

  renderCurrentStyles (currentStyles) {
    const { component, render } = this.props
    let children
    if (Array.isArray(render)) {
      // If render is an array, children becomes and array of arrays.
      // This is useful if you want to create layers of animation
      children = new Array(render.length)
      for (let i = 0; i < render.length; ++i) {
        children[i] = new Array(currentStyles.length)
        for (let j = 0; j < currentStyles.length; ++j) {
          const { key, data, style } = currentStyles[j]
          children[i][j] = render[i](key, data, style, j, i)
        }
      }
    } else {
      children = new Array(currentStyles.length)
      for (let j = 0; j < currentStyles.length; ++j) {
        const { key, data, style } = currentStyles[j]
        children[j] = render(key, data, style, j, 0)
      }
    }

    return cloneElement(component, {}, children)
  }

  getKey (data, i) {
    const { getKey } = this.props
    if (typeof getKey === 'function') {
      return getKey(data, i)
    }

    return getKey
  }

  getDefaultStyles () {
    const {
      getKey,
      onComponentMount,
      data
    } = this.props

    let mappedData = new Array(data.length)
    for (let i = 0; i < data.length; ++i) {
      mappedData[i] = {
        key: getKey(data[i], i),
        data: data[i],
        style: onComponentMount(data[i], i)
      }
    }

    return mappedData
  }

  getStyles () {
    const {
      getKey,
      onRender,
      data
    } = this.props

    let mappedData = new Array(data.length)
    for (let i = 0; i < data.length; ++i) {
      mappedData[i] = {
        key: getKey(data[i], i),
        data: data[i],
        style: onRender(data[i], i, spring)
      }
    }

    return mappedData
  }

  willEnter (config) {
    return this.props.onRemount(config)
  }

  willLeave (config) {
    return this.props.onUnmount(config, spring)
  }
}

Motion.defaultProps = {
  component: h('div'),
  data: []
}

Motion.propTypes = {
  // wrapper element ex: <div/>
  component: PropTypes.element,

  // array of data
  data: PropTypes.array,

  // (key, data, style) => ReactElement
  // called on render for each item in `data` with the key from `getKey`, `data` from `data[index]`, and
  // `style`, the result of: `onComponentMount`, `onRender`, `onRemount`, or `onUnmount`
  //
  // If an array is provided it will render the resulting elements in order.
  // This is useful for creating animated layers.
  render: PropTypes.oneOfType([PropTypes.func, PropTypes.arrayOf(PropTypes.func)]),

  // (data, i) => string
  // help identify which items have been changed, added, or are removed
  // https://facebook.github.io/react/docs/lists-and-keys.html
  getKey: PropTypes.func,

  // (data, i) => Style object
  // data === props.data[i]
  // called when `component` mounts
  // do not wrap values in springs
  onComponentMount: PropTypes.func,

  // (data, i, spring) => Style object
  // data === props.data[i]
  // called on every render
  // ok to wrap values in springs
  onRender: PropTypes.func,

  // ({ data }, i) => Style object
  // data === props.data[i]
  // do not wrap values in springs
  onRemount: PropTypes.func,

  // ({ data }, i, spring) => Style object
  // data === props.data[i]
  // ok to wrap values in springs
  onUnmount: PropTypes.func
}
