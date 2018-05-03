import React from 'react'
import Head from './_partial/head.jsx'
import Header from './_partial/header.jsx'
import Footer from './_partial/footer.jsx'
import Sidebar from './_partial/sidebar.jsx'
import Script from './_partial/script.jsx'

export default (props) =>
  <html>
    <Head {...props}/>
    <Header {...props}/>
    <main>
      <div dangerouslySetInnerHTML={{__html: props.body}}/>
      <Footer {...props}/>
    </main>
    <Sidebar {...props}/>
    <Script {...props} post={props.page}/>
  </html>
