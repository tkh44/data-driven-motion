# Api

### Props

* #### component
  `PropTypes.element`
  
  wrapper element 
  ex: `<div/>`


* #### data
  
  `PropTypes.array`

  array of data
  
  **It does not matter what `data` contains, as long as it is an array**

* #### render
  
  `PropTypes.oneOfType([PropTypes.func, PropTypes.arrayOf(PropTypes.func)])`
  
  ```js
  (key, data, style) => ReactElement
  ```

  called on render for each item in `data` with the `key` from `getKey`, `data` from `data[index]`, and
  `style`, the result of: `onComponentMount`, `onRender`, `onRemount`, or `onUnmount`
  
  If an array is provided it will render the resulting elements in order.
  This is useful for creating animated layers.


* #### getKey
  
  `PropTypes.func`

  ```js
  (data, i) => string
  ```
  
  help identify which items have been changed, added, or are removed
  
  [React docs on lists and keys](https://facebook.github.io/react/docs/lists-and-keys.html)


* #### onComponentMount
  
  `PropTypes.func`

  ```js
  (data, i) => Style object
  ```
  
  `data === props.data[i]`
  
  called when `component` mounts
  
  __do not wrap values in springs__


* #### onRender
  
  `PropTypes.func`

  ```js
  (data, i, spring) => Style object
  ```

  `data === props.data[i]`
  
  called when `props.component` mounts
  
  __ok to wrap values in springs__


* #### onRemount
  
  `PropTypes.func`

  ```js
  ({ key, data, style }) => Style object
  ```
  
  *Notice the argument is wrapped in an object*
  
  The argument is the computed config from `onRender` 
  
  __do not wrap values in springs__


* #### onUnmount
  
  `PropTypes.func`

  ```js
  ({ key, data, style }) => Style object
  ```
  
  *Notice the argument is wrapped in an object*
  
  The argument is the computed config from `onRender`. 
  
  __ok to wrap values in springs__
