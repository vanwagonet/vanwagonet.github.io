import React from 'react'
import Actions from './post/actions.jsx'
import Gallery from './post/gallery.jsx'
import Header from './post/header.jsx'

export default (props) => {
  const { list_tags, post, theme, url_for } = props
  let coverImageUrl
  if (post.coverImage) {
    if (post.coverImage.indexOf(config.url) < 0 && post.coverImage.indexOf('://') >= 0) {
      coverImageUrl = post.coverImage
    } else {
      coverImageUrl = url_for(post.permalink + post.coverImage)
    }
  }
  return [
    <article className='post' itemScope itemType='http://schema.org/BlogPosting'>
      {coverImageUrl &&
        <img className='post-cover' alt='' src={coverImageUrl} />
      }
      <Header {...props}/>
      <div itemProp='articleBody'>
        <div dangerouslySetInnerHTML={{__html: post.content}}/>
        {theme.image_gallery &&
          <Gallery {...props} photos={post.photos} />
        }
      </div>
      <div className='post-footer'>
        {(post.tags && post.tags.length > 0) &&
          <div className='tags'>
            Tagged in
            {' '}
            <span dangerouslySetInnerHTML={{__html: list_tags(post.tags, {
                show_count: 0,
                style: 'none',
                class: 'tag',
                separator: ', '
            })}}/>
          </div>
        }
      </div>
    </article>,
    <Actions {...props}/>
  ]
}
