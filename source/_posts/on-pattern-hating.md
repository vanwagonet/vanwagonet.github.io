title: On Pattern Hating
tags:
  - Java
  - patterns
  - problem solving
id: 126
categories:
  - General
date: 2011-10-07 22:50:21
---

I have long considered myself a Java hater. I now think it really has nothing to do with the language itself. Sure it was easy to point at slow performance (hasn't been true for a long time now), or mourn for missing syntactic sugar (Pattern.compile('abc', Pattern.CASE_INSENSITIVE) vs /abc/i), but really I think my problem with Java is really just a problem with the mindset I have observed in novice programmers (with Java usually being their first language).

**The problem is with patterns.**

Patterns are great. They provide a toolbox that can lead developers on the road to "best practice". But...

**Patterns are a poor substitute for problem solving.**

It doesn't matter if you know how to make a Singleton, even if you know when a Singleton is useful, if the problem at hand is improving report speed. You need to know math, you need to know computation, and you need to find the unnecessary work being done. It's possible we'll use a Singleton, but it won't be the solution to the problem.

In an interview, if I ask for code to find the most common words in a bunch of text files, "public class WordRanker {" is unimportant. I've seen a few programmers struggle for the first few minutes to figure out if it should be a class, a function, or what language to use. But once, I was impressed by someone who quickly figured out what they wanted to do, and then said, "I'd google how to do that."

The pattern is accidental complexity. Problem solving is essential complexity.