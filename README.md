# data-driven-motion

[![npm version](https://badge.fury.io/js/data-driven-motion.svg)](https://badge.fury.io/js/data-driven-motion)
[![Build Status](https://travis-ci.org/tkh44/data-driven-motion.svg?branch=master)](https://travis-ci.org/tkh44/data-driven-motion)
[![codecov](https://codecov.io/gh/tkh44/data-driven-motion/branch/master/graph/badge.svg)](https://codecov.io/gh/tkh44/data-driven-motion)
[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://img.shields.io/badge/code_style-standard-brightgreen.svg)



Easily animate your data in react

This is a small wrapper around [react-motion](https://github.com/chenglou/react-motion) with the intention of simplifying the api for my most common use case.

## [Demos and Docs](https://tkh44.github.io/data-driven-motion/)

```bash
npm install -S data-driven-motion
```

## Motion

```jsx
<Motion
  data={[]}
  component={<ul style={{ padding: 8 }} />}
  render={(key, data, style) => <li key={key} style={style}>{data.name}</li>}
  getKey={data => data.name}
  onComponentMount={data => ({ top: data.top, left: data.left })}
  onRender={(data, i, spring) => ({ top: spring(data.top), left: spring(data.left) })}
  onRemount={({ data }) => ({ top: data.top - 32, left: data.left - 32 })}
  onUnmount={({ data }, spring) => ({ top: spring(data.top + 32), left: spring(data.left + 32) })}
/>
```
