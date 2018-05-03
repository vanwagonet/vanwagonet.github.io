import React from 'react'

export default ({ config, date }) =>
  <footer>
    Copyright &copy; {date(new Date(), 'YYYY')} {config.author || config.title}. All&nbsp;Rights&nbsp;Reserved.
  </footer>
