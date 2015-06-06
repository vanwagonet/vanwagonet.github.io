title: A Case Against Vendor Prefixes In CSS
tags:
  - browser
  - css
  - moz
  - ms
  - prefix
  - web
  - webkit
id: 135
categories:
  - CSS
date: 2012-02-14 13:11:04
---

I am a web developer, and a rather impatient one too. When a new feature is available in a few browsers, I want to use it. Most of the time, these features are either experimental or not finished with the standardization process when they are generally available. So, they are prefixed by the vendor. This is how the process was designed, so that is what vendors do.

**Why do we prefix?**

Prefixing is a kind of disclaimer for the feature. "Hey this is likely going to change, so don't rely on it." This seems in theory like a good way to go about it. If I am a browser maker, and I think of a cool new feature, like say, a gradient defined in css instead of an image, I really won't know how good my design is until lots of people have used it and given feedback. Of course, if I am conscientious of the community and betterment of the web for everybody, I share my idea with other browser vendors and get their take on it too. Often we have competing ideas of how to implement it, so we want a way to distinguish between them. This competition is wonderful, and will lead us to a better solution. So, I make my background-image:-andy-linear-gradient(...), and my competitor makes their background:-steve-gradient(linear, color-stop(), ...). Some people can try it out and it will work through the standards process and eventually everyone will have a background:linear-gradient(...) feature.

In theory it works out great, but what about in practice?

**Here's what actually happens, from a dev's perspective.**

My favorite browser, Shiny, implements a cool new feature: -shiny-gradient(). I play with it and think it's really cool, but to be safe, I don't actually use it in any production site. A year later, the other browser I support, Ice Monster has long since added their own -ice-gradient(). Two years later, pretty much every browser has their own prefixed version, even the Laggard browser.

Nice. It only took two years for the feature to be generally available, so I start to use it, even though my code looks like this:

```css
background-image: -shiny-gradient(linear, left top, left bottom, from(hsl(0, 80%, 70%)), to(#BADA55));
background-image: -shiny-linear-gradient(top, hsl(0, 80%, 70%), #BADA55);
background-image:    -ice-linear-gradient(top, hsl(0, 80%, 70%), #BADA55);
background-image:    -lag-linear-gradient(top, hsl(0, 80%, 70%), #BADA55);
background-image:     -my-linear-gradient(top, hsl(0, 80%, 70%), #BADA55);
background-image:         linear-gradient(top bottom, hsl(0, 80%, 70%), #BADA55);
```

I don't mind too much, because I use SASS or some other css pre-processor that actually takes care of all the prefixes and nuances. But this still bothers me in two important ways.

1.  My stylesheets are getting much heavier than they used to be, which is a concern because I want people to be able to view my site quickly even on mobile devices. Most of the syntax is exactly the same, but I still have to write it over and over again for each vendor.
2.  I have to opt in for each browser I want to get the feature. If a new browser becomes popular, it won't get the gradients unless I go back and add yet another version.
I complain, but I keep doing it anyway. Two years later (Now **four years** since it was first introduced), The standard is still a draft, and because I want to support not just the bleeding edge browser, even when the standard finalizes I must leave all of the vendor prefixes indefinitely.

**The problem gets more real with mobile.**

Management asks for a ShinyPhone version of our application. They don't care about Robot, even though it uses -shiny prefixes. I am given enough time to make the ShinyPhone version, but no time to even test in Robot. Eventually though, I manage to get it working because I own a Robot phone.

A few months later, Catchup Phone 7, Ice Monster Mobile, and Concert Mini are showing up on more phones. They have their prefixed version of all the great Shiny features I used, but because I didn't know about them, the mobile application looks awful, and would take me several weeks to fix for each new phone. Management is not willing to spend that kind of time, so **even though they have all the features my site is broken for them**. Who will our customers blame? It works on ShinyPhone, so it must be that Ice Monster Mobile just isn't as good. **Ice Monster and other browsers get blamed for my site not working well there**.

**The Solution?**

It is clear that if other browsers want to make themselves look good, they have to do more than just implement the feature. **If they just use -shiny prefixes**, that would make my application work far better, and therefore make their browser look good. But that completely undermines what we've learned in the browser wars, and goes against the reason for prefixing in the first place!

**We don't really have a good solution yet.**

However, I have an idea I think worth talking about. **What if the feature hadn't been prefixed at all?** I would have been less nervous to put it into production, because CSS simply doesn't apply rules that aren't implemented, and though it will likely change syntax, I can add new versions, and the one that is implemented will work. My stylesheet ends up more like this:

```css
background-image: gradient(linear, left top, left bottom, from(hsl(0, 80%, 70%)), to(#BADA55));
background-image: linear-gradient(top bottom, hsl(0, 80%, 70%), #BADA55);
```

My application just works for every browser that supports the feature with little thought or effort from my part, and if the spec doesn't change, which it actually doesn't change very often, I am already done more than four years before it is standardized.

**Benefits of prefixing:**

1.  **Sense** of security for browser vendors, so they can change the implementation and make it better.
2.  Web developers **should** be aware that the feature isn't really ready yet.
3.  **Credit** goes to the vendor who pioneered the feature.
**Benefits of NOT prefixing:**

1.  **Less effort** and maintenance for web developers trying to make their application (and browsers) look good. They don't need to spend a lot of time researching which browsers support which features.
2.  **Lighter weight** stylesheets for everyone, especially mobile browsers.
3.  Browser vendors can focus on the **feature**s, not on evangelizing their prefix.
4.  **No -webkit- prefixes being supported by Mozilla**. Dang, I said it after trying so hard not to.
Honestly I do see the value in prefixing experimental and non-standardized features, but vendors have to break them often, and the standard needs to move faster if developers are realistically going to experiment with experimental features, and wait for the standard for production use.

Please feel free to disagree in the comments, check out the discussion going on in the [w3c](http://lists.w3.org/Archives/Public/www-style/2012Feb/0313.html), or [read up](http://paulirish.com/2012/vendor-prefixes-are-not-developer-friendly/) on [other](http://blog.vandenoostende.com/2012/on-vendor-prefixes/) [opinions](http://www.sitepoint.com/w3c-css-webkit-prefix-crisis/). Better yet, [get involved](http://www.change.org/petitions/microsoft-mozilla-opera-dont-make-webkit-prefixes-a-de-facto-standard).
