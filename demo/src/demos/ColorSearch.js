import React, { Component } from 'react'
import { Motion } from '../../../src'
import Demo from '../Demo'
import colorMap from 'color-name'
import rgbToHsl from 'rgb-to-hsl'

const STIFF_SPRING = { stiffness: 320, damping: 20, precision: 1 }
const colors = Object.keys(colorMap).map((name, i) => ({
  name,
  index: i,
  rgb: colorMap[name],
  hsl: rgbToHsl(...colorMap[name])
}))

class Input extends Component {
  render () {
    return (
      <input
        type={'search'}
        placeholder={'Color Name'}
        value={this.props.value}
        onChange={this.props.onChange}
        style={{
          fontSize: '1.25rem',
          fontFamily: 'sans-serif',
          color: '#343a40',
          background: '#f8f9fa',
          border: 'none',
          borderBottom: '1px solid #ced4da',
          outline: 'none',
          boxShadow: 'none',
          paddingTop: 4,
          paddingRight: 4,
          paddingBottom: 4,
          paddingLeft: 4,
          margin: 8,
          width: 'calc(100% - 16px)'
        }}
      />
    )
  }
}

class ColorList extends Component {
  render () {
    const { colorName } = this.props
    const data = colors.filter(({ name }) => name.includes(colorName))

    return (
      <Motion
        data={data}
        component={
          <div
            style={{
              position: 'relative',
              padding: 0,
              paddingLeft: 8,
              paddingRight: 8,
              margin: 0
            }}
          />
        }
        getKey={this.getKey}
        onComponentMount={this.onComponentMount}
        onRender={this.onRender}
        onRemount={this.onRemount}
        onUnmount={this.onUnmount}
        render={this.renderColorSearch}
      />
    )
  }

  getKey = (data, i) => data.name;

  onComponentMount = (data, i) => ({
    width: 36,
    o: 0
  });

  onRender = (data, i, spring) => ({
    width: spring(36, STIFF_SPRING),
    o: spring(1, STIFF_SPRING)
  });

  onRemount = ({ key, data, style }) => {
    return {
      width: 18,
      o: 0
    }
  };

  onUnmount = ({ key, data, style }, spring) => {
    return {
      width: spring(30, STIFF_SPRING),
      o: 0
    }
  };

  renderColorSearch = (key, data, { width, o }) => {
    return (
      <div
        key={key}
        style={{
          display: 'inline-block',
          width,
          height: 36,
          opacity: o,
          margin: 2,
          backgroundColor: `hsl(${data.hsl[0]}, ${data.hsl[1]}, ${data.hsl[2]})`,
          borderRadius: 4
        }}
      >
      </div>
    )
  };
}

class ColorSearch extends Component {
  state = { colorName: '' };
  frameId = null

  render () {
    return (
      <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
        <Input value={this.state.colorName} onChange={this.handleInputChange} />
        <ColorList colorName={this.state.colorName} />
      </div>
    )
  }

  handleInputChange = ({ target: { value: colorName } }) => {
    if (this.frameId) {
      window.cancelAnimationFrame(this.frameId)
    }
    this.frameId = window.requestAnimationFrame(() => {
      this.setState(() => ({ colorName }))
      this.frameId = null
    })
  };
}

export default () => (
  <Demo>
    <ColorSearch />
  </Demo>
)
