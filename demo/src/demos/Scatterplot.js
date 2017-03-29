// Inspired by https://bl.ocks.org/mbostock/4060954
import React, { Component, PureComponent } from 'react'
import { Motion } from '../../../src'
import Demo from '../Demo'
import { scaleLinear } from 'd3-scale'
import { min, max } from 'd3-array'
import { randomUniform } from 'd3-random'
const WOBBLY_SPRING = { stiffness: 60, damping: 15 }

const radiusGenerator = randomUniform(2, 8)
function randomRadius () {
  return radiusGenerator()
}

const width = 800
const height = 450

class Scatterplot extends PureComponent {
  render () {
    const { points } = this.props
    const maxY = max(points, d => d[1])
    const minY = min(points, d => d[1])
    const maxX = max(points, d => d[0])
    const xScale = scaleLinear().domain([0, maxX]).range([0, width])
    const yScale = scaleLinear().domain([minY, maxY]).range([height, 0])

    return (
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        style={{ width: '100%', height: '100%' }}
      >
        <Layer
          data={points}
          xScale={xScale}
          yScale={yScale}
          minY={minY}
          maxY={maxY}
          maxX={maxX}
        />
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

  getKey = (data, i) => i + '-' + (randomUniform(1, 2)() | 0);

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
      x: spring(this.props.xScale(this.props.maxX), WOBBLY_SPRING),
      y: spring(this.props.yScale(this.props.minY), WOBBLY_SPRING)
    }
  };

  renderCircle = (key, data, style, dataIndex) => {
    return (
      <circle
        key={key}
        r={style.r}
        cx={style.x}
        cy={style.y}
        fill={`hsl(${dataIndex % 360}, 100%, 71%)`}
        fillOpacity={style.opacity}
      />
    )
  };
}

export default class extends Component {
  constructor (props) {
    super(props)

    this.state = {
      points: this.generateLayers(5)
    }
  }

  componentDidMount () {
    this.interval = window.setInterval(
      () => {
        return this.setState({ points: this.generateLayers(randomUniform(1, 360)() | 0) })
      },
      1000
    )
  }

  componentWillUnmount () {
    window.clearInterval(this.interval)
  }

  render () {
    return (
      <Demo>
        <div style={buttonStyle}>
          {`Animating ${this.state.points.length} circle elements`}
        </div>
        <Scatterplot points={this.state.points} />
      </Demo>
    )
  }

  generateLayers = itemCount => {
    let points = []
    for (let i = itemCount; i > -1; i--) {
      points[i] = [i, Math.random() * 100 | 0]
      points[i].radius = randomRadius()
    }

    return points
  };
}

const buttonStyle = {
  position: 'absolute',
  top: 8,
  right: 8,
  backgroundColor: 'transparent',
  color: '#37b24d',
  fontWeight: 'bold',
  borderRadius: 4,
  height: 32,
  lineHeight: 2.5,
  paddingLeft: 16,
  paddingRight: 16,
  outline: 'none'
}
