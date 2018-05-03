import React from 'react'
import util from 'util'
import Pagination from './pagination.jsx'

export default ({ page, url_for }) => {
  let lastYear
  let lastMonth
  const years = []
  page.posts.sort('date', 'desc').each(post => {
    const year = post.date.year()
    const currentYear = (year === lastYear)
      ? years[years.length - 1]
      : years[years.length] = { year, months: [] }
    const month = post.date
    const currentMonth = (year === lastYear && (lastMonth.format('MM') === month.format('MM')))
      ? currentYear.months[currentYear.months.length - 1]
      : currentYear.months[currentYear.months.length] = { month, posts: [] }
    currentMonth.posts.push(post)
    lastYear = year
    lastMonth = month
  })

  return (
    <section>
      {years.map(({ year, months }) =>
        <div key={year}>
          <h2 className='archive-year'>
            <a href={url_for('archives/' + year)}>
              {year}
            </a>
          </h2>
          {months.map(({ month, posts }, i) =>
            <div key={i}>
              <h3 className="archive-month">
                <a href={url_for('archives/' + month.format('YYYY/MM'))}>
                  {month.format('MMMM')}
                </a>
              </h3>
              {posts.map((post, i) =>
                <div className="archive-post" key={i}>
                  <time dateTime={post.date.toISOString()}>
                    {post.date.format('Do')}
                  </time>
                  <a href={post.permalink}>
                    {post.title || '(no title)'}
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      <Pagination page={page} url_for={url_for} />
    </section>
  )
}