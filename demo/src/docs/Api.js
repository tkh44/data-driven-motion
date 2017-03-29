import React from 'react'
import apiMarkdown from 'raw-loader!../../../docs/api.md'
import Markdown from 'react-markdown'

export default (props) => {
  return (
    <div {...props} className={'api-docs markdown-body'}>
      <Markdown source={apiMarkdown} />
    </div>
  )
}
