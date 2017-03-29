import React, { createElement as h, Component } from 'react'
import { Motion } from '../../../src'
import Demo from '../Demo'

const WOBBLY_SPRING = { stiffness: 280, damping: 30 }

class BoxContainer extends Component {
  state = { x: 0, y: 0, mouseDown: false, offsetTop: 0, offsetLeft: 0 };

  render () {
    const { x: xPos, y: yPos, offsetLeft, offsetTop } = this.state

    const x = xPos - offsetLeft
    const y = yPos - offsetTop

    return h(Motion, {
      data: Array.from({ length: 33 }, (v, i) => ({ key: 'circle-' + i })),
      component: (
        <div
          ref={node => {
            this.node = node
          }}
          style={{
            flex: 1,
            width: '100%',
            height: '100%',
            backgroundColor: '#212529',
            perspective: 1000,
            overflow: 'hidden'
          }}
          onMouseMove={({ pageX: x, pageY: y }) => this.setState({ x, y })}
          onMouseDown={() => this.setState({ mouseDown: true })}
          onMouseUp={() => this.setState({ mouseDown: false })}
          onMouseEnter={() => {
            const rect = this.node.getBoundingClientRect()
            this.setState({ offsetTop: rect.top, offsetLeft: rect.left })
          }}
          onMouseLeave={() => this.setState({ mouseDown: false })}
        />
      ),
      getKey: data => data.key,
      onComponentMount: () => ({ x, y, z: 0, hue: 0 }),
      onRender: (data, i, spring) => ({
        x: spring(x, WOBBLY_SPRING),
        y: spring(y, WOBBLY_SPRING),
        z: spring(this.state.mouseDown ? i * 30 : 0, WOBBLY_SPRING),
        hue: spring((x * i + y * i) / 2 % 360)
      }),
      onRemount: () => ({ x, y, z: 0, hue: 0 }), // Does not matter since data does not change
      onUnmount: () => ({ x, y, z: 0, hue: 0 }), // Does not matter since data does not change
      render: this.renderCircle
    })
  }

  renderCircle = (key, data, style, dataIndex, layerIndex) => {
    return (
      <div
        key={key}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: 'calc((64px + 5vh + 5vw) / 3)',
          width: 'calc((64px + 5vh + 5vw) / 3)',
          borderRadius: '50%',
          border: `3px solid hsl(${style.hue + dataIndex * 180}, 50%, 40%)`,
          backfaceVisibility: 'hidden',
          transformOrigin: 'center center',
          transform: `translate3d(calc(${style.x}px - 5vw), calc(${style.y}px - 5vh), ${style.z}px)`,
          cursor: dataIndex === 0 ? 'pointer' : 'normal'
        }}
        children={this.state.mouseDown}
      />
    )
  };
}

export default () => {
  return (
    <Demo>
      <BoxContainer />
      <div
        style={{
          position: 'absolute',
          top: 8,
          left: 8,
          fontSize: '0.6em',
          color: 'white'
        }}
      >
        {'Move mouse & Hold mouse down'}
      </div>
    </Demo>
  )
}
