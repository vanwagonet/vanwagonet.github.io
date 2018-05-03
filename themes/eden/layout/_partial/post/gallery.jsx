import React from 'react'

export default ({ photos }) => !photos || !photos.length ? null : (
  <div className='image-gallery'>
    <div className='image-gallery-metabar'>
      <span>Gallery : {photos.length} images</span>
    </div>
    <div
      className={'image-gallery-photos' +
        (photos.length > 2 ? ' image-gallery-photos--thumbnail' : '')
      }
    >
      {photos.map(photo => {
        const photoUrl = (photo.indexOf(config.url) < 0 && photo.indexOf('://') >= 0)
          ? photo
          : url_for(post.permalink + photo)
        return (
          <div className='photo-box'>
            <a
              className='photo-box-inner fancybox'
              rel='fancybox-thumb'
              data-fancybox-group={'gallery-' + post.id}
              title={photo.replace('__', ' ').slice(0, photo.lastIndexOf('.'))}
              href={photoUrl}
            >
              <img className='photo' src={photoUrl} itemProp='image'/>
            </a>
          </div>
        )
      })}
    </div>
  </div>
)
