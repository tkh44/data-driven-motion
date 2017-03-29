import 'github-markdown-css'
import './style.css'
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { render } from 'react-dom'

function run () {
  const Root = require('./App').default
  render(<Root />, document.querySelector('#demo'))
}

run()

if (module.hot) {
  // Whenever a new version of App.js is available
  module.hot.accept('./App', function () {
    // Require the new version and render it instead
    run()
  })
}
