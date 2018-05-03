import React from 'react'
import Post from './_partial/post.jsx'

export default (props) =>
  <Post
    {...props}
    post={props.page}
  />
