import React from 'react'

export default ({ config, url_for }) =>
  <header>
    <h1>
      <a href={config.url}>
        {config.title}
        {' '}
        <img
          className='logo'
          alt='Inkwell with angle brackets'
          src={url_for('assets/images/favicon.svg')}
        />
      </a>
    </h1>
  </header>
