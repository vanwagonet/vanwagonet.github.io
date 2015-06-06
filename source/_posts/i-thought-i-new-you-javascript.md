title: I thought I new you(JavaScript);
tags:
  - class
  - inheritance
  - JavaScript
  - learn
  - oop
  - script
  - understand
id: 73
categories:
  - JavaScript
date: 2011-04-04 16:08:01
---

This is the first of hopefully many posts aiming to demystify javascript.

The first thing to get over is the name. [JavaScript is not Java](http://www.456bereastreet.com/archive/200909/java_is_not_javascript/). The name came from trying to ride on Java's hype. [JavaScript is to Java as Hamster is to Ham](http://adactio.com/journal/1595). Understand? Moving on...

Hopefully, most programmers now know that JavaScript is object-oriented. I'm afraid though that most believe object-oriented is synonymous with classical inheritance, which you will not find in JavaScript. JavaScript instead uses prototypal inheritance.

Classical Inheritance in Java:

```java
class Fruit {
  private String name;
  public Fruit(String n) { name = n; }
  public toString() { return name; }
}

class Banana extends Fruit {
  public Banana() { super("banana"); }
}

// (new Banana()) instanceof Banana and Fruit
```

With classical inheritance, as in Java, you define classes. Classes are templates or blueprints for what an object of that type will be like. Objects, which are instances of a class, get all the methods and fields associated with the class and the classes it inherits.

When you call a method, first the runtime looks in the class, then if it can't find the definition, it traverses up the class hierarchy until it finds the method definition.

Prototypal Inheritance in JavaScript:

```javascript
function Fruit(name) { this.name = name; }
Fruit.prototype = { name:null, toString:function() { return this.name; } };

function Banana() { Fruit.call(this, 'banana'); }
Banana.prototype = new Fruit(null);

// (new Banana()) instanceOf Banana and Fruit 
```

As you can see in JavaScript, with prototypal inheritance, there are no classes. The 'class' keyword is not used. Objects inherit from other objects. (The Banana prototype is an 'instance' of Fruit.) Constructors are just normal functions that you may call with the 'new' keyword.

When you access any property, the runtime checks the object, then if it cannot find the property, it traverses up the prototype object hierarchy until it finds the property. If it doesn't find the property, it returns undefined.

The new keyword is a little deceptive, because it looks the same as Java. This is closer to what really happens:

```javascript
// var banana = new Banana(a, b);
var banana = {}; // new Object()
// assume __proto__ is a hidden field, used internally for the prototype hierarchy
banana.__proto__ = Banana.prototype;
var temp = Banana.call(banana, a, b); // call the Banana function with 'this' set to the banana object
banana = (temp && typeof temp === 'object') ? temp : banana;

// banana.name;
var temp = banana;
while (!temp.hasOwnProperty('name') && temp.__proto__) { temp = temp.__proto__; }
return temp.hasOwnProperty('name') ? temp.name : undefined;
```

Please note that this code is an oversimplification, but hopefully helps you to understand what is happening behind the scenes. One of the interesting things you may have noticed from the above code is that when you call 'new Banana()', you might not get back what you expect. See one way you can implement the Factory pattern in JavaScript:

```javascript
function Fruit(name, color) {
  if (typeof Fruit[name] === 'function')) return new Fruit[name]();
  this.name = name;
  this.color = color;
  return this;
}
Fruit.prototype = { name:null, color:null };

Fruit.Banana = function Banana() { return this; };
Fruit.Banana.prototype = new Fruit('Banana', 'yellow');

Fruit.Apple = function Apple() { return this; };
Fruit.Apple.prototype = new Fruit('Apple', 'red');

var banana = new Fruit('Banana'); // instanceOf Fruit and Banana
var apple = new Fruit('Apple'); // instanceOf Fruit and Apple
var kiwi = new Fruit('Kiwi'); // instanceOf Fruit
```

As most of JavaScript's powerful dynamic features, it could easily be used for evil as well as for good.

```javascript
function Droid() { return new IPhone(); }
var phone = new Droid(); // this is not the droid you're looking for
```

[wtfjs.com](http://wtfjs.com/) is full of examples where JavaScript does weird things, but almost invariably because you tried to do something weird in the code. With a small amount of restraint on the developer's part, JavaScript can be powerful and need not be a mystery.
