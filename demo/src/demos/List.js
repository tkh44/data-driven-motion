import React, { Component } from 'react'
import { Motion } from '../../../src'
import Demo from '../Demo'

let items = []
for (let i = 100; i > 0; i--) {
  items[i] = { id: i, name: `Item ${i}`, username: `User ${i}` }
}
const WOBBLY_SPRING = { stiffness: 280, damping: 30 }

class ListDemo extends Component {
  state = {
    filter: 2
  };

  render () {
    return (
      <div
        style={{ padding: 8, overflow: 'auto', height: 'calc(100% - 16px)' }}
      >
        <input
          style={{
            width: 'calc(100%)',
            marginBottom: 8
          }}
          type={'range'}
          min={2}
          max={15}
          step={1}
          value={this.state.filter}
          onChange={({ target: { value } }) => this.setState({ filter: value })}
        />
        <p
          style={{
            position: 'relative',
            marginLeft: 64,
            listStyle: 'none'
          }}
        >
          Divisible by {this.state.filter}
        </p>
        <ListWrapper
          data={items
            .filter(d => d.id % this.state.filter === 0)
            .map((d, i) => {
              d.index = i
              return d
            })}
        />
      </div>
    )
  }
}

class ListWrapper extends Component {
  render () {
    return (
      <Motion
        data={this.props.data}
        component={
          <ul
            style={{
              position: 'relative',
              marginLeft: 64,
              listStyle: 'none'
            }}
          />
        }
        getKey={(data, i) => i + ''}
        onComponentMount={(data, i) => {
          return {
            opacity: 1,
            hue: i * 4 % 360,
            xOffset: 0,
            yOffset: i * 14
          }
        }}
        onRender={(data, i, spring) => {
          return {
            opacity: spring(1),
            hue: spring(i * 4 % 360),
            xOffset: spring(0, WOBBLY_SPRING),
            yOffset: spring(i * 16, WOBBLY_SPRING)
          }
        }}
        onRemount={({ key, data, style }) => {
          return {
            opacity: 1,
            hue: 0,
            xOffset: -100,
            yOffset: 0
          }
        }}
        onUnmount={({ key, data, style }, spring) => {
          return {
            opacity: spring(0),
            hue: spring(0),
            xOffset: spring(100, WOBBLY_SPRING),
            yOffset: spring(0, WOBBLY_SPRING)
          }
        }}
        render={[this.renderLi, this.renderLi]}
      />
    )
  }

  renderLi = (key, data, style, dataIndex, layerIndex) => {
    return (
      <li
        key={key + layerIndex}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          margin: 0,
          transform: `translate3d(${style.xOffset * layerIndex}px, ${style.yOffset}px, 0px)`,
          opacity: style.opacity,
          background: 'rgba(62, 127, 182, 1)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          WebkitFilter: `hue-rotate(${style.hue}deg)`
        }}
      >
        {data.username}
      </li>
    )
  };
}

export default () => {
  return (
    <Demo tall>
      <ListDemo />
    </Demo>
  )
}
