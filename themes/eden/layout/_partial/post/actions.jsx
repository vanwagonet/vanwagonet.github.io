import React from 'react'

export default ({ post, url_for }) =>
  <nav className='pages'>
    {post.prev ? (
      <a className='page prev' href={url_for(post.prev.path)} title={post.prev.title || '(no title)'}>
        Previous
      </a>
    ) : (
      <i className='page'/>
    )}
    {post.next ? (
      <a className='page next' href={url_for(post.next.path)} title={post.next.title || '(no title)'}>
        Next
      </a>
    ) : (
      <i className='page'/>
    )}
  </nav>
