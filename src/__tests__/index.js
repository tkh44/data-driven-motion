/* eslint-env jest */
/* eslint-disable jsx-quotes */
import React from 'react'
import renderer from 'react-test-renderer'
const TestUtils = require('react-dom/test-utils')
import {Motion} from '../index'

describe('ddm', () => {
  test('renders elements with styles', () => {
    const getKey = (data, i) => data.name + ' ' + i

    const tree = renderer
      .create(
        <Motion
          data={[
            {name: 'Arrow', left: 5, top: 5},
            {name: 'River', left: 14, top: 55}
          ]}
          component={<ul style={{padding: 8}} />}
          render={[(key, data, style, i, j) => (
            <li key={key} style={style}>{data.name + ' ' + j}</li>
          )]}
          getKey={getKey}
          onRender={(data, i, spring) => ({
            top: spring(data.top),
            left: spring(data.left)
          })}
          onRemount={({data}) => ({
            top: data.top - 32,
            left: data.left - 32
          })}
          onUnmount={({data}, spring) => ({
            top: spring(data.top + 32),
            left: spring(data.left + 32)
          })}
        />
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })
  test('renders elements with styles', done => {
    let renderCount = 0

    TestUtils.renderIntoDocument(
      <Motion
        data={[{name: 'Arrow'}, {name: 'River'}]}
        component={<ul style={{padding: 8}} />}
        render={(key, data, style) => {
          ++renderCount
          if (renderCount === 1) {
            expect(data.name).toBe('Arrow')
          }

          if (renderCount === 2) {
            done()
          }
          return <li key={key} style={style}>{data.name}</li>
        }}
        getKey={(data, i) => data.name + ' ' + i}
        onComponentMount={data => ({x: 5})}
        onRender={(data, i, spring) => ({
          x: 5
        })}
        onRemount={({data}) => ({
          x: 32
        })}
        onUnmount={({data}, spring) => ({
          x: 55
        })}
      />
    )
  })
})
