title: CommonJS in the Browser
tags:
  - CommonJS
  - include
  - JavaScript
  - modules
  - require
id: 109
categories:
  - JavaScript
date: 2011-09-22 14:33:25
---

I've been thinking a lot lately about how to use [CommonJS modules](http://wiki.commonjs.org/wiki/Modules/1.1.1) in my web applications. I even started a [repository on github](https://github.com/thetalecrafter/modules) for my implementation. As is apparent from [searching](http://lmgtfy.com/?q=commonjs+in+the+browser), the task is non-trivial, and there are lots of people trying to do the same thing, and every one of them has a different idea about how it should work.

**But WHY would you want to use CommonJS (formerly known as ServerJS) modules in a client environment?**

Ideally you can share modules between client and server, but that requires you to use a server environment like [node.js](nodejs.org), which might make management really nervous. Even without sharing the CommonJS module system helps us avoid some annoyances in JavaScript development.

*   Each module has it's own scope. I don't have to manually wrap each file in a function to get a new variable scope. (Of course, to achieve this, the boilerplate is going to have to wrap each module's code in a function anyway.)
*   Namespaces are only used in the require function, not everywhere in my code. Almost inevitably every web application I've worked in ends up using code like the following:
```javascript
    var whatIWanted = new FormerCompanyName.Common.CoolLibrary.ConstructorName( More.namespace.chains.than.you.can.follow );
    // the rest of this file continues to use these ridiculously long namespaces
```

Although I'm sure many will disagree with me, I much prefer the CommonJS way:

```javascript
    var CoolModule = require('common/cool-library'),
        thingINeed = require('more/namespace/chains/than/you/can/follow'),
        whatIWanted = new CoolModule.ConstructorName(thingINeed);
    // the rest of the file is void of long namespaces
```

And much more importantly, when I define a new module (or class as some insist on calling them):

```javascript
    FormerCompanyName.Common.CoolLibrary.ConstructorName = function() {/* ... */};
    // versus
    exports.ConstructorName = function() {/* ... */};
    // or even
    module.exports = function() {/* ... */} // this case isn't in the spec, but I really like it, so I made sure my library can handle it.
```
*   Because you can also use relative module identifiers ("./sibling-module", "../uncle-module"), when the company changes it's name, it can be as simple as renaming a folder to update all the top-level module ids.
*   Additionally, modules can be included in the page in any order, and are only executed when first required, instead of all modules executing immediately upon inclusion, requiring the script order to be specific and fragile. If I add a new module using CommonJS, I can just append it to the end of the list, otherwise I have to make sure it is earlier in the page than whatever uses it, and after whatever it uses.
**Okay, but how much work is it going to be?**

Let's walk through first what I wanted my server-side code to look like, then what it has to do to make it work on the other side.

As most of my server-side experience thus far has been in php, that's the first language I've used in my implementation.

```php
<!DOCTYPE html>
<html>
<head>
    <title>My Awesome Application</title>
    <link rel="stylesheet" href="awesome-styles.css" />
</head>
<body>
    <!-- blah blah blah -->
    <?= Modules::script() /* include all necessary script tags */ ?>
    <script>require('awesome').go()</script>
</body>
</html>
```

The Modules class will look for all js files in the folder you put it in, and any subfolders, and will id them by their path.

Yes, I am including every module, not actually checking dependencies. I refer you back to [my previous post](/2011/04/13/load-only-when-needed-or-preload-everything/) and say this is the simplest way, and if the caching headers are working, the experience won't suffer. You are welcome to use one of the [fantastic libraries](http://lmgtfy.com/?q=async+require+javascript) that loads modules on-demand, if you disagree.

Hopefully that is all the server-side API you need to worry about, but there is more if you need it.

**So what is that library doing to my poor scripts to make the CommonJS module environment?**

I will explain in detail what goes into it in another post, but if you are daring, you can check out the source on [github](https://github.com/thetalecrafter/modules).
