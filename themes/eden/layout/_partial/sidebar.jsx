import React from 'react'

const Icon = ({ type }) => {
  const Type = require('./icon/' + type).default
  return <Type />
}

export default ({ config, gravatar, theme, url_for }) =>
  <nav>
    {((theme.gravatar_image && theme.author.email) || theme.author.picture) &&
      <a className='name' href={url_for('/about')}>
        {theme.gravatar_image && theme.author.email ? (
          <img className='avatar' src={gravatar(theme.author.email, 90)}/>
        ) : theme.author.picture && (
          <img className='avatar' src={url_for(theme.image_dir + '/' + theme.author.picture)}/>
        )}
        {config.author}
      </a>
    }
    {Object.keys(theme.sidebar).map(group =>
      <ul className='links'>
        {Object.keys(theme.sidebar[group]).map(id => {
          const item = theme.sidebar[group][id]
          return <li>
            <a
              href={url_for(item.url)}
              target={(item.url.indexOf(config.url) < 0 && item.url.indexOf('://') >= 0)
                ? '_blank'
                : null
              }
            >
              {item.icon && <Icon type={item.icon} />}
              {item.title}
            </a>
          </li>
        })}
      </ul>
    )}
  </nav>
