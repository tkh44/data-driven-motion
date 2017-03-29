import React from 'react'
import apiMarkdown from 'html-loader!markdown-loader!../../../docs/api.md'

export default (props) => {
  return (
    <div {...props} className={'api-docs markdown-body'}>
      <div dangerouslySetInnerHTML={{
        __html: apiMarkdown
      }} />
    </div>
  )
}
