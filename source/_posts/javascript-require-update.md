title: JavaScript Require Update
tags:
  - ajax
  - include
  - JavaScript
  - require
  - script
id: 62
categories:
  - JavaScript
date: 2010-08-21 12:47:42
---

I've updated the code I use to require scripts and styles on my web pages.

Check it out, or fork it at github: [http://github.com/thetalecrafter/require](http://github.com/thetalecrafter/require)

Usage:

main file:

```javascript
	require.setObjUrl('jQuery', function(name) {
		return name === 'jQuery' ? 'http://code.jquery.com/jquery-1.5.2.min.js' :
			'http://cdn-' + (name.length % 4) + '.example/plugins/' + name + '.js'; });
	require('jQuery.myplugin', function(myplugin) { /* both have loaded when this executes */ });
```

plugin file:

```javascript
	require('jQuery', function(jQuery) {
		jQuery.myplugin = ...
	});
```

require css: Any requirement matching `/\.css$/i` will be treated as a css requirement.

```javascript
	require('myplugin.css', function() { /* You can count on styles being available here */ });
```

require image: Any requirement matching /\.(?:gif|jpe?g|png)$/i will be treated as an image requirement.

```javascript
	require('myplugin_bg.png', function() { /* You can count on the image being available here */ });
```
