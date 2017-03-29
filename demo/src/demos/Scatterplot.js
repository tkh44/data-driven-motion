// Inspired by https://bl.ocks.org/mbostock/4060954
import React, { Component, PureComponent } from 'react'
import { Motion } from '../../../src'
import Demo from '../Demo'
import { stack } from 'd3-shape'
import { scaleLinear, interpolateCool } from 'd3-scale'
import { min, max, range, transpose } from 'd3-array'
import { randomUniform } from 'd3-random'
const WOBBLY_SPRING = { stiffness: 150, damping: 15 }

const n = 20
const m = 20
const k = 10

// Inspired by Lee Byron’s test data generator.
function bumps (n, m) {
  const a = []
  let i
  for (i = 0; i < n; ++i) {
    a[i] = 0
  }
  for (i = 0; i < m; ++i) {
    bump(a, n)
  }
  return a
}

function bump (a, n) {
  const x = 1 / (0.1 + Math.random())
  const y = 2 * Math.random() - 0.5
  const z = 10 / (Math.random())
  for (let i = 0; i < n; i++) {
    const w = (i / n - y) * z
    a[i] += x * Math.exp(-w * w)
  }
}

function stackMax (layer) {
  return max(layer, d => d[1])
}

function stackMin (layer) {
  return min(layer, d => d[0])
}

const radiusGenerator = randomUniform(2, 8)
function randomRadius () {
  return radiusGenerator()
}

const width = 800
const height = 450
const graphStack = stack().keys(range(n))

class Scatterplot extends PureComponent {
  render () {
    const { layers } = this.props
    const maxY = max(layers, stackMax)
    const minY = min(layers, stackMin)
    const xScale = scaleLinear().domain([0, m - 1]).range([0, width])
    const yScale = scaleLinear().domain([minY, maxY]).range([height, 0])

    return (
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        style={{ width: '100%', height: '100%' }}
      >
        {layers.map((d, i) => {
          return (
            <Layer
              data={d}
              key={'layer' + i}
              xScale={xScale}
              yScale={yScale}
              minY={minY}
              maxY={maxY}
              index={i}
            />
          )
        })}
      </svg>
    )
  }
}

class Layer extends Component {
  render () {
    return (
      <Motion
        data={this.props.data}
        component={<g />}
        getKey={this.getKey}
        onComponentMount={this.onCpm}
        onRender={this.onRender}
        onRemount={this.onRe}
        onUnmount={this.onUn}
        render={this.renderCircle}
      />
    )
  }

  getKey = (data, i) => i + '-' + this.props.index;

  onCpm = (data, i) => {
    return {
      opacity: 0,
      r: 0,
      x: this.props.xScale(0),
      y: this.props.yScale(i % 2 ? this.props.maxY : 0)
    }
  };

  onRender = (data, i, spring) => {
    return {
      opacity: spring(1),
      r: spring(data.radius),
      x: spring(this.props.xScale(data[0]), WOBBLY_SPRING),
      y: spring(this.props.yScale(data[1]), WOBBLY_SPRING)
    }
  };

  onRe = ({ key, data, style }, i) => {
    return {
      opacity: 0,
      r: 0,
      x: this.props.xScale(0),
      y: this.props.yScale(i % 2 ? this.props.maxY : 0)
    }
  };

  onUn = ({ key, data, style }, spring) => {
    return {
      opacity: spring(0),
      r: spring(0),
      x: spring(this.props.xScale(m - 1), WOBBLY_SPRING),
      y: spring(this.props.yScale(this.props.maxY), WOBBLY_SPRING)
    }
  };

  renderCircle = (key, data, style, dataIndex) => {
    return (
      <circle
        key={key}
        r={style.r}
        cx={style.x}
        cy={style.y}
        fill={interpolateCool(this.props.index / this.props.data.length)}
        fillOpacity={style.opacity}
      />
    )
  };
}

export default class extends Component {
  constructor (props) {
    super(props)

    this.state = {
      layers: this.generateLayers()
    }
  }

  componentDidMount () {
    this.interval = window.setInterval(() => this.setState({layers: this.generateLayers()}), 1000)
  }

  componentWillUnmount () {
    window.clearInterval(this.interval)
  }

  render () {
    return (
      <Demo>
        {/*<button*/}
          {/*style={buttonStyle}*/}
          {/*onClick={() => this.setState({ layers: this.generateLayers() })}*/}
        {/*>*/}
          {/*Update*/}
        {/*</button>*/}
        <Scatterplot layers={this.state.layers} />
      </Demo>
    )
  }

  generateLayers = () => graphStack(transpose(range(n).map(() => bumps(m, k)))).map((d) => {
    return d.map((point) => {
      point.data = {}
      point.radius = randomRadius()
      return point
    })
  });
}

const buttonStyle = {
  position: 'absolute',
  top: 8,
  right: 8,
  backgroundColor: 'transparent',
  color: '#37b24d',
  border: '1px solid currentColor',
  borderRadius: 4,
  height: 32,
  lineHeight: 2.5,
  paddingLeft: 16,
  paddingRight: 16,
  outline: 'none',
  cursor: 'pointer'
}
