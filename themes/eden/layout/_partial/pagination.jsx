import React from 'react'

export default ({ page, url_for }) =>
  <nav className='pages'>
    { page.prev ? (
      <a className='page prev' href={url_for(page.prev_link)}>
        Newer
      </a>
    ) : (
      <i className='page' />
    ) }
    Page {page.current} of {page.total}
    { page.next ? (
      <a className='page next' href={url_for(page.next_link)}>
        Older
      </a>
    ) : (
      <i className='page' />
    ) }
  </nav>