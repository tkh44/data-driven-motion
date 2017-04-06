import React, { Component } from 'react'
import { Motion } from '../../../src'
import Demo from '../Demo'
import colorMap from 'color-name'
import rgbToHsl from 'rgb-to-hsl'

const STIFF_SPRING = { stiffness: 200, damping: 20 }
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
          height: 39,
          width: 'calc(100% - 16px)'
        }}
      />
    )
  }
}

class ColorList extends Component {
  render () {
    return (
      <Motion
        data={this.props.data}
        component={
          <div
            style={{
              position: 'relative',
              display: 'flex',
              width: '100%',
              height: 'calc(100% - 55px)',
              overflow: 'hidden',
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
        render={this.renderResult}
      />
    )
  }

  getKey = (data, i) => data.name;

  onComponentMount = (data, i) => ({
    width: 1 / (this.props.data.length / 100),
    o: 0
  });

  onRender = (data, i, spring) => ({
    width: data.found
      ? spring(1 / (this.props.foundCount / 100), STIFF_SPRING)
      : 0,
    o: spring(1, STIFF_SPRING)
  });

  renderResult = (key, data, { width, o }) => {
    return (
      <div
        key={key}
        style={{
          flexGrow: '1',
          flexShrink: '1',
          flexBasis: 'auto',
          width: `${width}%`,
          height: '100%',
          opacity: o,
          marginTop: 2,
          marginBottom: 2,
          backgroundColor: `hsla(${data.hsl[0]}, ${data.hsl[1]}, ${data.hsl[2]}, 1)`,
          borderRadius: 0
        }}
      />
    )
  };
}

class ColorSearch extends Component {
  state = { colorName: '' };

  render () {
    const { colorName } = this.state
    let foundCount = 0
    const data = colors.map(color => {
      const found = color.name.includes(colorName)
      if (found) ++foundCount
      return { ...color, found }
    })

    return (
      <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
        <Input value={colorName} onChange={this.handleInputChange} />
        <ColorList data={data} foundCount={foundCount} />
      </div>
    )
  }

  handleInputChange = ({ target: { value: colorName } }) => {
    this.setState(() => ({colorName}))
  };
}

export default () => (
  <Demo>
    <ColorSearch />
  </Demo>
)
