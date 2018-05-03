import React from 'react'

export default ({ post, url_for, list_categories }) => [
  <h2 itemProp='headline'>
    <a href={url_for(post.link || post.permalink)} itemProp='url'>
      {post.title || '(no title)'}
    </a>
  </h2>,
  <div className='meta'>
    <time itemProp='datePublished' dateTime={post.date.toISOString()}>
      {post.date.format('MMM DD, YYYY')}
    </time>
    {(post.categories && post.categories.length > 0) && [
      ' in ',
      <span dangerouslySetInnerHTML={{__html: list_categories(post.categories, {
        show_count: 0,
        style: 'none'
      })}} />
    ]}
  </div>
]
