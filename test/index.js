/* eslint-env mocha */
const React = require('react')
const expect = require('expect')
const TestUtils = require('react-addons-test-utils')
const DataDrivenMotion = require('../src/index')

const { PropTypes, Component, createElement: h } = React
const { Motion } = DataDrivenMotion

describe('data-driven-motion', () => {
  it('works', done => {
    expect(() => TestUtils.renderIntoDocument(
      h(Motion, {
        data: [{ name: 'bob', username: 'bob199', top: 1, left: 1, offsetY: 1 }],
        component: h('ul'),
        getKey: data => {
          return data.name
        },
        onComponentMount: data => {
          return {
            top: data.top,
            left: data.left,
            opacity: data.top > 500 ? 0 : 1,
            translateY: data.offsetY
          }
        },
        onRender: (data, i, spring) => {
          return {
            top: spring(i * data.top),
            left: spring(data.left),
            opacity: data.top > 500 ? 0 : 1,
            translateY: spring(data.offsetY)
          }
        },
        onRemount: ({ key, data, style }) => {
          return {
            top: data.top,
            left: data.left,
            opacity: data.top > 500 ? 0 : 1,
            translateY: data.offsetY
          }
        },
        onUnmount: ({ key, data, style }, spring) => {
          return {
            top: spring(data.top),
            left: spring(data.left),
            opacity: data.top > 500 ? 0 : 1,
            translateY: spring(data.offsetY)
          }
        },
        render: (key, data, style) => {
          h(
            'li',
            {
              style: {
                position: 'absolute',
                top: style.top,
                left: style.left,
                opacity: style.opacity,
                transform: `translateY(${style.translateY})`
              }
            },
            data.name
          )
        }
      })
    )).toNotThrow()
    done()
  })
})
