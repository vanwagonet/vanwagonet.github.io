title: 'Async Functions: Delivering on Promises'
tags:
  - ES 2016
  - JavaScript
id: 165
categories:
  - JavaScript
date: 2015-05-11 12:57:29
---

Since Promises were first introduced to JavaScript, I have been frustrated by disappearing errors. Due to its dynamic nature, errors in JavaScript can show up much later in the dev process, sometimes making it all the way to production environments before they are first noticed. Many tools, like linters and type checkers, have been introduced to try to detect errors earlier. However, with Promises sometimes no error is ever thrown at all, your code just doesn't work as you expect it to.

A small example to illustrate:

```javascript
function getResult() {
  return new Promise(function(resolve, reject) {
    someAsyncFunction(resolve) // this function may throw an error asynchronously
  })
}
```

As you can see, `reject` never gets called. You must explicitly handle the error condition, or you won't get so much as an error in the console. The error is thrown, but swallowed by the promise.

So why don't I just handle the error? The point is not that errors cannot be handled. They certainly can be. The problem is that it is easier to do the wrong thing with promises. By default errors are caught and ignored.

Furthermore, async stack traces suck. This is a pain point for both promises and callbacks. Assuming an error occurs somewhere deep in asynchrony, the stack may only show you where the error was thrown, and have little or no context of where the function was called in the first place.

**Both of these problems go away when using async function with await.**

ES7 (or ES 2016 if you prefer) proposes a new keywords `async` and `await`. Under the hood, the new mechanism uses promises, but by default does the right thing.

The prior example becomes:

```javascript
async function getResult() {
  return await someAsyncFunction()
}
```

This code assumes `someAsyncFunction` is also updated to the new syntax.

So what did we get?

1.  If something goes wrong an error is thrown, and ends up in the console if not handled.
2.  The stack trace is complete, so you can see what initiated the failed action.
3.  A try/catch around your `getResult()` call works.

Want to know more about how `async` and `await` work? You can read Jake Archibald gush over their many virtues [on his blog](http://jakearchibald.com/2014/es7-async-functions/), or if you like, you can check out the surprisingly readable [proposal](https://github.com/lukehoban/ecmascript-asyncawait).
