title: Greater than the sum of its components
tags:
  - AMD
  - CommonJS
  - JavaScript
  - Node.js
  - require
id: 148
categories:
  - JavaScript
date: 2013-02-19 17:36:43
---

Lately I've been working on a cool project written exclusively in JavaScript, with a [Node.js](http://nodejs.org/) & [MongoDB](http://www.mongodb.org/) back end, and a [CommonJS](http://thetalecrafter.github.com/modules/) [Backbone](http://backbonejs.org/) front end. What I have found most fun so far is the synergy I get between certain components.

**Templates**

First off, I admit I'm a reinvent-the-wheel kind of engineer. I readily find some minor fault in existing solutions and decide I have to write my own. [EJS](https://github.com/visionmedia/ejs) is really great, especially for someone coming from a PHP background, who doesn't think logic-less templates are better than sliced bread. However, I really needed templates that can run asynchronously, doing file or network io for includes and other such magic.

So, I made [Stencil](http://thetalecrafter.github.com/stencil/). I was able to make templates that compile without mucking up the line numbers, so debugging is very straight-forward. No exception rethrowing necessary. The very-important async use case was satisfied without making all templates forced to use the async pattern.

```javascript
sync_result = sync_tpl(data); // works if no async code in template
async_tpl(data, function(err, async_result) { }); // always works
```

Where the whole becomes more than the sum of parts: A small snippet makes it so I can directly `require` my templates, and get back the function instead of the string:

```javascript
require.extensions['.html'] = function(module, filename) {
	var fs = require('fs'), stencil = require('stencil-js'),
		opts = { id:filename, src:fs.readFileSync(filename, 'utf8') };
	module._compile(
		'module.exports=' + stencil.compile(opts, true) + ';',
		filename
	);
};
```

Now the rest of my code that uses templates doesn't have to care that I use Stencil. You just `tpl = require('path/to/template.html')`. This is possible because Node.js has an extensible require, and Stencil allows you to compile to a JavaScript string instead of just to a function. If I were to go back and change the templating system to EJS, Jade, or Mustache, I would only need to update this one little snippet.

**Client CommonJS**

I liked Node.js's module system, and I didn't want to have to [replace it](http://requirejs.org/docs/node.html) or use a separate system on the front end. Don't get me started on mess of [UMD](https://github.com/umdjs/umd). So, I created my own [Modules library](http://thetalecrafter.github.com/modules/). You've [heard](http://thetalecrafter.com/2010/01/30/javascript-require-in-100-lines-of-code/ "JavaScript require in 100 lines of code") [about](http://thetalecrafter.com/2011/04/13/load-only-when-needed-or-preload-everything/ "Load only when needed, or Preload everything?") this [before](http://thetalecrafter.com/2011/09/22/commonjs-in-the-browser/ "CommonJS in the Browser").

I got CommonJS modules to load (asynchronously) and run in the browser, so it was trivial to share code used on both ends. Again, line numbers weren't munged in the server-side translation, so debugging works just like you always expect it to.

The library runs as a middleware for [Express](http://expressjs.com/), enabling the reload functionality [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD) lovers rave about, as well as standalone for concatenating and minifying bundles in the production build process. All with a client-side weight one-third that of [AlmondJS](https://github.com/jrburke/almond), although that or [RequireJS](http://requirejs.org/) would also work on the front-end, since Modules still uses AMD as its transport format.

The real magic though, is that the Modules library has an option for translating certain types of files, giving us the same `require` functionality for our templates that we had on the server, and because the translation happens server side (or at build time), the client code can keep a [Content Security Policy](http://www.html5rocks.com/en/tutorials/security/content-security-policy/) that disallows eval and unsafe inline code, as Stencil never has to be loaded in client code. (Lighter & more secure. Woohoo!)

```javascript
app.use(require('modules').middleware({
	translate:{
		html:function tpl(name, file, src) {
			var opts = { id:name, src:src };
			return 'module.exports=' + stencil.compile(opts, true) + ';';
		}
	},
	root: './components/', // file root path
	path: '/module/', // url root path
	// ... other options
}));
```

**Backbone**

One magic thing that I got for free, is that Backbone and Underscore are already CommonJS compatible, so passing them through the same middleware just worked. [Async](https://github.com/caolan/async), and countless other Node.js modules also just work.

**Adding it all together**

While I chose to write my own templating and module components, many other libraries include the little hooks that make these synergies possible. Each component individually is really nothing spectacular, but when you put them all together you get a product that is cohesive from front to back, and really fun to work on.
