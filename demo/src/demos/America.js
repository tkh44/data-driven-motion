import flagImgUrl from '../static/usa-flag.png'
import React, { Component, PureComponent } from 'react'
import { Motion } from '../../../src'
import Demo from '../Demo'
import { normalizePaths, getProgress } from 'react-svg-morph/lib/utils/morph'
import scalePath from 'react-svg-morph/lib/utils/scalePath'
import { EAGLE_PATH, USA_PATH } from './svg-paths'

const WOBBLY_SPRING = { stiffness: 200, damping: 15 }
const width = 800
const height = 450

class America extends PureComponent {
  render () {
    const { from: usa, to: eagle } = normalizePaths(
      [{ path: scalePath(USA_PATH, height, 640, 412), trans: {} }],
      [{ path: scalePath(EAGLE_PATH, height, 794, 1122), trans: {} }]
    )

    return (
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        style={{ width: '100%', height: '100%' }}
      >
        <defs>
          <pattern
            id='🇺🇸'
            patternUnits='userSpaceOnUse'
            width={width}
            height={height}
          >
            <image
              xlinkHref={flagImgUrl}
              x='0'
              y='0'
              width={width}
              height={height}
            />
          </pattern>
        </defs>
        <Patriot val={this.props.val} eagle={eagle} usa={usa} />
      </svg>
    )
  }
}

class Patriot extends Component {
  render () {
    return (
      <Motion
        data={[this.props.val]}
        component={<g transform={'translate(175,35)'} />}
        getKey={this.getKey}
        onComponentMount={this.onCpm}
        onRender={this.onRender}
        render={this.renderAmerica}
      />
    )
  }

  getKey = (data, i) => i + '-USA';

  onCpm = (data, i) => ({ val: data });

  onRender = (data, i, spring) => ({ val: spring(data, WOBBLY_SPRING) });

  renderAmerica = (key, data, { val }, dataIndex) => {
    const [snapshot] = getProgress(this.props.usa, this.props.eagle, val)

    return (
      <path
        key={key}
        d={snapshot.path}
        fill={'url(#🇺🇸)'}
        stroke={'#f03e3e'}
        strokeWidth={2}
      />
    )
  };
}

export default class extends Component {
  constructor (props) {
    super(props)

    this.state = { val: 0 }
  }

  render () {
    return (
      <Demo>
        <input
          style={{
            position: 'absolute',
            top: 8,
            left: 32,
            height: 32,
            width: 'calc(60%)',
            marginBottom: 8
          }}
          type={'range'}
          min={0}
          max={100}
          step={1}
          value={this.state.val * 100}
          onChange={({target: {value}}) => this.setState({val: value / 100})}
        />
        <button
          style={buttonStyle}
          onClick={() => this.setState(prev => ({ val: prev.val === 0 ? 1 : 0 }))}
        >
          Toggle
        </button>
        <America val={this.state.val} />
      </Demo>
    )
  }
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
  outline: 'none',
  border: '1px solid #37b24d'
}
