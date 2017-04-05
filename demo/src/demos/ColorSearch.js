import React, { Component } from 'react'
import { Motion } from '../../../src'
import Demo from '../Demo'
import colorMap from 'color-name'
import rgbToHsl from 'rgb-to-hsl'

const STIFF_SPRING = { stiffness: 500, damping: 45 }
const colors = Object.keys(colorMap).map(name => ({
  name,
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
              listStyle: 'none',
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
    height: 32,
    h: 0,
    o: 0
  });

  onRender = (data, i, spring) => ({
    height: spring(32, STIFF_SPRING),
    h: spring(data.hsl[0], STIFF_SPRING),
    o: spring(1, STIFF_SPRING)
  });

  onRemount = ({ key, data, style }) => {
    return {
      height: 0,
      h: 0,
      o: 0
    }
  };

  onUnmount = ({ key, data, style }, spring) => {
    return {
      height: spring(0, STIFF_SPRING),
      h: data.hsl[0],
      o: spring(0, STIFF_SPRING)
    }
  };

  renderColorSearch = (key, data, { height, h, o }) => {
    return (
      <div
        key={key}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height,
          fontSize: height / 2,
          opacity: o,
          backgroundColor: `hsl(${h}, ${data.hsl[1]}, ${data.hsl[2]})`,
          borderRadius: 4
        }}
      >
        {data.name}
      </div>
    )
  };
}

class ColorSearch extends Component {
  state = { colorName: '' };

  render () {
    return (
      <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
        <Input value={this.state.colorName} onChange={this.handleInputChange} />
        <ColorList colorName={this.state.colorName} />
      </div>
    )
  }

  handleInputChange = ({ target: { value: colorName } }) => {
    this.setState(() => ({ colorName }))
  };
}

export default () => (
  <Demo tall>
    <ColorSearch />
  </Demo>
)
