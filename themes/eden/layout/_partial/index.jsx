import React from 'react'
import Pagination from './pagination.jsx'
import Header from './post/header.jsx'

export default (props) => {
  const { page, post, theme, url_for } = props
  return <section className='list'>
    {page.posts.map(post => {
      let thumbnailImageUrl
      if ((theme.thumbnail_image) && (post.thumbnailImage) && ((post.thumbnailImage.length))) {
        if ((post.thumbnailImage.indexOf(config.url) < 0) && (post.thumbnailImage.indexOf('://') >= 0)) {
          thumbnailImageUrl = post.thumbnailImage
        } else {
          thumbnailImageUrl = url_for(post.permalink + post.thumbnailImage)
        }
      } else if ((theme.thumbnail_image) && (post.photos) && (post.photos.length)) {
        if ((post.photos[0].indexOf(config.url) < 0) && (post.photos[0].indexOf('://') >= 0)) {
          thumbnailImageUrl = post.photos[0]
        } else {
          thumbnailImageUrl = url_for(post.permalink + post.photos[0])
        }
      } else if ((theme.thumbnail_image) && (post.coverImage) && (post.coverImage.length)) {
        if ((post.coverImage.indexOf(config.url) < 0) && (post.coverImage.indexOf('://') >= 0)) {
          thumbnailImageUrl = post.coverImage
        } else {
          thumbnailImageUrl = url_for(post.permalink + post.coverImage)
        }
      }
      return (
        <article itemScope itemType='http://schema.org/BlogPosting'>
          <Header {...props} post={post}/>
          <div itemProp='articleBody'>
            {post.excerpt ? (
              <div dangerouslySetInnerHTML={{__html: post.excerpt}}/>
            ) : (
              <p>
                <span dangerouslySetInnerHTML={{__html:
                  post.content.replace(/<[^>]*>/g, '').slice(0, 200 ).replace(/\s*\S+$|\s+$/, '')
                }}/>
                …
                <br/>
                {(post.link && theme.go_to_message) ? (
                  <a href={url_for(post.link)}>
                    {theme.go_to_message}
                  </a>
                ) : (theme.read_more_message && [
                  <a href={post.permalink}>
                    {theme.read_more_message}
                  </a>,
                  post.readingtime &&
                    <span className='readtime'>
                      {' - ' + post.readingtime + ' min read'}
                    </span>
                ])}
              </p>
            )}
          </div>
          {thumbnailImageUrl != null &&
            <img className='thumb' alt='' src={thumbnailImageUrl}/>
          }
        </article>
      )
    })}
    <Pagination {...props} />
  </section>
}
