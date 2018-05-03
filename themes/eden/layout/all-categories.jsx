import React from 'react'

export default ({ site, url_for }) =>
  <div id='categories-archives' className='main-content-wrap'>
    <form id='filter-form' action='##'>
      <input name='category' type='text' className='form-control input--xlarge' placeholder='Search a category' autofocus='autofocus'/>
    </form>
    <h4 className='archive-result text-color-base text-xlarge'/>
    <section>
      {site.categories.sort('name').map(item =>
        <a
          className='category category--small category--primary'
          href={'#posts-list-' + item.name}
          data-category={item.name.replace('.', '__').replace(' ', '-').toLowerCase()}
        >
          {item.name}
        </a>
      )}
    </section>
    <section className='boxes'>
      {site.categories.sort('name').filter(item => !item.parent).map(item =>
        <div
          id={'posts-list-' + item.name}
          className='archive box'
          data-category={item.name.replace('.', '__').replace(' ', '-').toLowerCase()}
        >
          <h4 className='archive-title'>
            <a className='link-unstyled' href={url_for('categories/' + item.slug)}>
              {item.name + ' (' + item.length + ')'}
            </a>
          </h4>
          <ul className='archive-posts'>
            {site.categories.findOne({name: item.name}).posts.map(post =>
              <li className='archive-post'>
                <a className='archive-post-title' href={post.permalink}>
                  {post.title || '(no title)'}
                </a>
                <span className='archive-post-date'>
                  {' - ' + post.date.format('DD/MM/YYYY').toLowerCase()}
                </span>
              </li>
            )}
            {site.categories.find({parent: item._id}).map(childItem =>
              <div
                id={'posts-list-' + childItem.name}
                className='archive'
                data-category={childItem.name.replace('.', '__').replace(' ', '-').toLowerCase()}
                data-parent-categories={item.name.replace('.', '__').replace(' ', '-').toLowerCase()}
              >
                <h5 className='archive-title'>
                  <a
                    className='link-unstyled'
                    href={url_for('categories/' + item.slug + '/' + childItem.slug)}
                  >
                    {childItem.name + ' (' + childItem.length + ')'}
                  </a>
                </h5>
                <ul className='archive-posts'>
                  {site.categories.findOne({name: childItem.name}).posts.map(post =>
                    <li className='archive-post'>
                      <a
                        className='archive-post-title'
                        href={post.permalink}
                      >
                        {post.title || '(no title)'}
                      </a>
                      <span className='archive-post-date'>
                        {' - ' + post.date.format('DD/MM/YYYY').toLowerCase()}
                      </span>
                    </li>
                  )}
                  {site.categories.find({parent: childItem._id}).map(childChildItem =>
                    <div
                      id={'posts-list-' + childChildItem.name}
                      className='archive'
                      data-category={childChildItem.name.replace('.', '__').replace(' ', '-').toLowerCase()}
                      data-parent-categories={item.name.replace('.', '__').replace(' ', '-').toLowerCase() + ',' + childItem.name.replace('.', '__').replace(' ', '-').toLowerCase()}
                    >
                      <h5 className='archive-title'>
                        <a
                          className='link-unstyled'
                          href={url_for('categories/' + item.slug + '/' + childItem.slug + '/' + childChildItem.slug)}
                        >
                          {childChildItem.name + ' (' + childChildItem.length + ')'}
                        </a>
                      </h5>
                      <ul className='archive-posts'>
                        {site.categories.findOne({'name': childChildItem.name}).posts.map(post =>
                          <li className='archive-post'>
                            <a
                              className='archive-post-title'
                              href={post.permalink}
                            >
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
                </ul>
              </div>
            )}
          </ul>
        </div>
      )}
    </section>
  </div>
