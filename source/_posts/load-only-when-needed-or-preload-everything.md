title: 'Load only when needed, or Preload everything?'
tags:
  - ajax
  - JavaScript
  - minify
  - require
  - script
id: 93
categories:
  - JavaScript
date: 2011-04-13 12:47:07
---

As JavaScript and web application best practices have formed over the last several years, there have appeared two contesting patterns in loading the scripts needed for an application:

**Don't load any JavaScript until you know you need it.**

I usually feel like this is the way to go, because a lot of my code is specific to a particular widget or workflow. Why make the page take longer to load initially for something the user won't do every visit? Just put in minimal stubs to load the full functionality once the user begins down that workflow, or interacts with the widget.

Pros:

*   Lighter initial page weight
*   Encourages functionally modular code
*   Memory performance boost (important if you have to support old browsers)
*   Speed performance boost (if done right)

Cons:

*   Adds additional complexity to code
*   Laggy performance (if done wrong)
*   Lots of HTTP requests

**Combine and minify all JavaScript into one file loaded at the end of the html file.**

You know beforehand what is going to be needed on each page, and YSlow warned you about too many HTTP requests. Bundle up all the scripts into one download which will be cached after the first page view.

Pros:

*   Easy to implement (lots of code will do it for you)
*   Initial page load (once cached) is really fast

Cons:

*   Load a lot more than usually necessary
*   Initial load can be much slower

So how do you know which pattern to follow? It depends! If your application is very complex, and large portions of the functionality are used infrequently, it makes a lot of sense to use an on-demand pattern. If your application is fairly simple, or if all of the code is likely to be used every time, then combining all of the scripts and including it from the start will be much easier.

I recently worked on a smaller application where I divided all the script into two files. The first was loaded initially, and provided enough functionality for the login dialog only. Upon successful login, the second script was loaded, which combined all of the remaining pieces of application.

The point I most want to make is this: **Don't just follow a pattern because it is a "best practice".** Take the time to figure out the best solution for your project.