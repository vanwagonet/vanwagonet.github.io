import React from 'react'

export default ({ site, url_for }) =>
  <div id='tags-archives' className='main-content-wrap'>
    <form id='filter-form' action='#'>
      <input name='tag' type='text' className='form-control input--xlarge' placeholder='Search a tag' autofocus='autofocus'/>
    </form>
    <h4 className='archive-result text-color-base text-xlarge'/>
    <section>
      {site.tags.sort('name').map(item =>
        <a
          className='tag tag--primary tag--small'
          href={'#' + item.name + '-list'}
          data-tag={item.name.replace('.','__').toLowerCase()}
        >
          {item.name}
        </a>
      )}
    </section>
    <section className='boxes'>
      {site.tags.sort('name').map(item =>
        <div
          id={item.name + '-list'}
          className='archive box'
          data-tag={item.name.replace('.','__').toLowerCase()}
        >
          <h4 className='archive-title'>
            <a
              className='link-unstyled'
              href={url_for('tags/' + item.slug)}
            >
              {item.name + ' (' + item.length + ')'}
            </a>
          </h4>
          <ul className='archive-posts'>
            {site.tags.findOne({name: item.name}).posts.map(post =>
              <li className='archive-post'>
                <a className='archive-post-title' href={post.permalink}>
                  {post.title || '(no title)'}
                </a>
                <span className='archive-post-date'>
                  {' - ' + post.date.format('DD/MM/YYYY').toLowerCase()}
                </span>
              </li>
            )}
          </ul>
        </div>
      )}
    </section>
  </div>
