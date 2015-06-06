title: Some thoughts on Web 4.0
tags:
  - ajax
  - html5
  - svg
id: 75
categories:
  - JavaScript
date: 2011-04-16 07:57:57
---

The web has undergone some significant changes since its inception. 1.0 consisted mostly of HTML documents, with simple CSS style, and little or no JavaScript interaction. 2.0 was the AJAX revolution, making dynamic sites with complex JavaScript. Some have suggested we are already in 3.0, with HTML5 and SVG well supported in the latest version of every major browser. What I'd like to talk about, is what I wish would come next.

As many who are immersed in front-end web development have noticed, HTML and SVG have different DOMs, different styles, and competing animation tools. They have been getting better, with HTML5's inline SVG support, and browsers beginning to bring each markup's features to the other, but the inconsistencies are still painful, and and they make implementation both for web and browser developers sub-optimal.

What I would love to see is something akin to the following document:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Fancy HTML+SVG</title>
  <link rel="stylesheet" href="styles.css" />
  <defs>
    <path id="logo" desc="My Fancy SVG Logo" d="M59,0 l69,69 h-15 l-44,44 v15 l-69-69 h15 l45-45 5,5 -45,45 44,44 44-44 -49-49 z  M59,44 c0-8,10-8,10,0 v40 c0,8-10,8-10,0 z" />
    <filter id="soft_blur"><feGaussianBlur in="SourceGraphic" stdDeviation=".5"/></filter>
  </defs>
  <link rel="shortcut icon" sizes="16x16 24x24 32x32 48x48" href="#logo" />
</head>
<body>
  <header>
    <a id="home" href="."><use href="#logo" /></a>
    <h1>The TaleCrafter&#039;s Scribbles<h1>
    <h2>notes about science, fiction, and faith… but mostly web development</h2>
  </header>
  <article>My Article text and images and stuff go here</article>
  <footer>Boring Legal and maybe locale selection in here</footer>
  <script src="script.js" async defer></script>
</body>
</html>
```

styles.css
```css
  #logo { background:#111; } /* applies to everywhere <use>d, including favicon */
  #home { width:64px; height:64px; float:left; }
  #home path { transform:scale(.5); transition:background .5s ease; }
  #home path:hover { background:#0d0dc5; }
  h1 { filter:url(#soft_blur); transition:filter .5s linear; }
  h1:hover { filter:none; }
  /* ... lots more styles ... */
```

script.js
```javascript
  document.querySelector('#home path').addEventListener('click', /* open menu or something useful */);
```

Summary of things that would be cool:

*   no need for foreignObject or anything like that, simply mix and match tags
*   put all the useful attributes in the same namespace (make use is useful without xlink: namespace)
*   css transitions & animations on svg styles (properties would also be nice)
*   defs and use in html documents
*   filters on html elements (Firefox is already working on this)
*   unify styles like background and fill
*   JavaScript DOM API identical
In short SVG and HTML would be one and the same. You would style both with the same css.

Some nitpicks:

*   I'm not sold on defining filters in markup, then using in style. It feels... odd. Why not define in style? (Oh no, that might be too much like IE's filters! Gasp!)
*   Animating is still a crapshoot. It feels like it should be in JavaScript, but declarative syntax is so much simpler, and easier to optimize for browsers. Some SMIL animations work in some browsers. CSS animations are still nacent but promising. (Even IE looks like it might implement it in 'native HTML5'. Sorry, couldn't help myself.) Still, JavaScript is the only reliable way right now.

Let me hear an Amen, or let me know what I'm missing. Leave a comment and let's talk about it.
