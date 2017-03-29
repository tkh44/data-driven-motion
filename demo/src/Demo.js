import React from 'react'

export default ({ style, tall = false, children }) => {
  return (
    <div style={style} className={'demo-container' + (tall ? ' tall' : '')}>
      <div className={'content'}>
        {children}
      </div>
    </div>
  )
}
