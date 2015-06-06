title: JavaScript require in 100 lines of code
tags:
  - ajax
  - include
  - JavaScript
  - require
  - script
id: 49
categories:
  - JavaScript
date: 2010-01-30 18:32:41
---

**UPDATE**: I've changed up my code a bit in the follow up post: [JavaScript Require Update](/2010/08/21/javascript-require-update/)
**UPDATE**: Although my initial intent was to write require with minimal code, my latest version in github is much longer, but preforms better and is much more feature rich. Check it out, or fork it at github: [http://github.com/thetalecrafter/require](http://github.com/thetalecrafter/require)

Lately I've been toying with dependency management in JavaScript. Most implementations of require (at least that I've seen) use polling, a function in the loaded script, synchronous XMLHttpRequest (dojo.require), or some combination of those.

Polling is less than ideal, since more code runs than is necessary. It can slow down the responsiveness of the page if the interval is too short, and the user waits longer than necessary if the interval is too long.

Putting a function in the loaded file means that everything you load has to understand the system. You cannot load arbitrary files. This makes it harder to do mash-ups involving other peoples' code.

Synchronous requests lock up the browser. If the server is latent, the user may feel the browser has crashed, and if the server goes down, it can actually crash the browser. In addition, XMLHttpRequest responses are not cached like script tags, meaning that the dynamic packages may need to be reloaded with every page load.

So... when looking at writing my own require function I knew I wanted:

*   Event-driven code. (No polling. No more code execution than necessary.)
*   No requirements on the contents of required files.
*   Asynchronous loads (No chance of freezing or crashing the browser.)
*   Take advantage of the browser's cache.
*   Nested requires. (A file isn't loaded until everything it requires is loaded.)
*   Decent browser compatibility (IE6+, FF2+, Chrome, Safari 3+, Opera).
*   No external library requirements.
One thing I ended up giving up to get the aforementioned wants: Loading scripts in parallel. Nested requires were unreliable since not all browsers guarantee execution order of dynamically inserted script tags, therefore too hard to determine the parent requirement. I'm looking at you Safari. Any pointers to improve that would be appreciated.

My testing has been less than thorough, and there are many situations I didn't try to handle. (Like checking to see if the script was already included statically.)

Without further ado, here's my code: (the most up-to-date is available on [github](http://github.com/thetalecrafter/require))

```javascript
/**
 * _.require v0.3 by Andy VanWagoner, distributed under the ISC licence.
 * Provides require function for javascript.
 *
 * Copyright (c) 2010, Andy VanWagoner
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */
(function() {
	var map = {}, root = [], reqs = {}, q = [], CREATED = 0, QUEUED = 1, REQUESTED = 2, LOADED = 3, COMPLETE = 4, FAILED = 5;

	function Requirement(url) {
		this.url = url;
		this.listeners = [];
		this.status = CREATED;
		this.children = [];
		reqs[url] = this;
	}

	Requirement.prototype = {
		push: function push(child) { this.children.push(child); },
		check: function check() {
			var list = this.children, i = list.length, l;
			while (i) { if (list[--i].status !== COMPLETE) return; }

			this.status = COMPLETE;
			for (list = this.listeners, l = list.length; i < l; ++i) { list[i](); }
		},
		loaded: function loaded() {
			this.status = LOADED;
			this.check();
			if (q.shift() === this && q.length) q[0].load();
		},
		failed: function failed() {
			this.status = FAILED;
			if (q.shift() === this && q.length) q[0].load();
		},
		load: function load() { // Make request.
			var r = this, d = document, s = d.createElement('script');
			s.type = 'text/javascript';
			s.src = r.url;
			s.requirement = r;
			function cleanup() { // make sure event & cleanup happens only once.
				if (!s.onload) return true;
				s.onload = s.onerror = s.onreadystatechange = null;
				d.body.removeChild(s);
			}
			s.onload = function onload() { if (!cleanup()) r.loaded(); };
			s.onerror = function onerror() { if (!cleanup()) r.failed(); };
			if (s.readyState) { // for IE; note there is no way to detect failure to load.
				s.onreadystatechange = function () { if (s.readyState === 'complete' || s.readyState === 'loaded') s.onload(); };
			}
			r.status = REQUESTED;
			d.body.appendChild(s);
		},
		request: function request(onready) {
			this.listeners.push(onready);
			if (this.status === COMPLETE) { onready(); return; }

			var tags = document.getElementsByTagName('script'), i = tags.length, parent = 0;
			while (i && !parent) { parent = tags[--i].requirement; }
			(parent || root).push(this);
			if (parent) this.listeners.push(function() { parent.check(); });

			if (this.status === CREATED) {
				this.status = QUEUED;
				if (q.push(this) === 1) { this.load(); }
			}
		}
	};

	function resolve(name) {
		if (/\/|\\|\.js$/.test(name)) return name;
		if (map[name]) return map[name];
		var parts = name.split('.'), used = [], ns;
		while (parts.length) {
			if (map[ns = parts.join('.')]) return map[ns] + used.reverse().join('/') + '.js';
			used.push(parts.pop());
		}
		return used.reverse().join('/') + '.js';
	}

	function absolutize(url) {
		if (/^(https?|ftp|file):/.test(url)) return url;
		return (/^\//.test(url) ? absolutize.base : absolutize.path) + url;
	}
	(function () {
		var tags = document.getElementsByTagName('base'), href = (tags.length ? tags.get(tags.length - 1) : location).href;
		absolutize.path = href.substr(0, href.lastIndexOf('/') + 1) || href;
		absolutize.base = href.split(/\\|\//).slice(0, 3).join('/');
	})();

	function require(arr, onready) {
		if (typeof arr === 'string') arr = [ arr ]; // make sure we have an array.
		if (typeof onready !== 'function') onready = false;
		var left = arr.length, i = arr.length;
		if (!left && onready) onready();
		while (i) { // Update or create the requirement node.
			var url = absolutize(resolve(arr[--i])), req = reqs[url] || new Requirement(url);
			req.request(function check() { if (!--left && onready) onready(); });
		}
	}

	require.map = function mapto(name, loc) { map[name] = loc; };
	require.unmap = function unmap(name) { delete map[name]; };
	require.tree = root;
	jQuery.require = require;
})();
```
