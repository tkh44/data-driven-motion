import React from 'react'

export default function Loading ({isLoading, error, pastDelay}) {
  if (isLoading) {
    return pastDelay ? <div>Loading...</div> : null // Don't flash "Loading..." when we don't need to.
  } else if (error) {
    return (
      <pre>
        <h1>Error</h1>
        {JSON.stringify(error, null, 2)}
      </pre>
    )
  } else {
    return null
  }
}
