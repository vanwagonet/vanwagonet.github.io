import React from 'react'

export default (props) => {
  let title = ''
  if (props.is_home()) {
    title += props.config.title
  } else if (props.is_archive()) {
    title += 'All archives'
    if (props.is_month()) {
      title += ' : ' + props.page.year + '/' + props.page.month
    } else if (props.is_year()) {
      title += ' : ' + props.page.year
    }
    title += ' - ' + props.config.title
  } else if (props.is_tag()) {
    if (props.page.tag) {
      title += 'Tag : ' + props.page.tag
    } else {
      title += 'All tags'
    }
    title += ' - ' + props.config.title;
  } else if (props.is_category()) {
    if (props.page.category) {
      title += 'Category : ' + props.page.category
    } else {
      title += 'All categories'
    }
    title += ' - ' + props.config.title
  } else {
    title += props.page.title + ' - ' + props.config.title
  }

  return [
    <meta charSet='utf-8'/>,
    <meta name='viewport' content='width=device-width, initial-scale=1'/>,
    <title>{title}</title>,
    <meta name='author' content={props.config.author}/>,
    <meta name='description' content={props.config.title}/>,
    <link rel='icon' href={props.url_for(props.theme.image_dir + '/' + props.theme.favicon)}/>,
    (props.config.feed && props.config.feed.path.length > 0) &&
      <link rel='alternative' type='application/atom+xml' title='RSS' href={props.config.feed.path}/>,
    <link rel='stylesheet' href={props.url_for('assets/css/style.css')}/>
  ]
}
