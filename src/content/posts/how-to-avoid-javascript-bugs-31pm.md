---
comments: 6
reactions: 12
views: 444
published_at: 2019-04-04T20:44:51Z
devto_link: https://dev.to/neutrino2211/how-to-avoid-javascript-bugs-31pm
cover_image: none
title: How To Avoid Javascript Bugs
published: true
description: Essential tips on how to avoid most javascript bugs
tags: beginner javascript webdev
---

Being a javascript programmer is great but we can never avoid the dreaded stack trace! 😡, most of these bugs are just one Google search away from being solved but sometimes Google can't help and you become stuck with this headache-inducing bug, but do not worry because I have some tips that will help you avoid most bugs.


### 1. Know your *Sources* and *Sinks*

![Sink](https://media.giphy.com/media/3o7TKOuX9nFjq3bR5u/giphy.gif)
First of all, what are *Sources* and *Sinks*, a **Source** is a process that generates a piece of information and a **Sink** is the consumer of this information. 
Example:

{% runkit %}
function doSomething(randomPercentage){
    const percentString = randomPercentage + "%";
    console.log(percentString);
}

const randomPercentage = Math.random()*100; // Math.random is the Source here.

doSomething(randomPercentage); // And the doSomething function is the sink.
{% endrunkit %}

This looks very trivial and from the surface, everything looks fine but looks can be deceiving, the function appears to only add a "%" at the end of the number and displays the resulting string, But when the code is executed you will get something similar to this `17.64650669753125%`. That does not look good.

This is a classic example of what can go wrong if you don't carefully check your sources or sinks.

The reason why the percentage is not a whole number comes from the `Math.random` function because it only generates floating point numbers which we did not **Math.floor**. So let's fix that

{% runkit 

function doSomething(randomPercentage){
    const percentString = randomPercentage + "%";
    console.log(percentString);
}

%}
const randomPercentage = Math.floor(Math.random()*100);

doSomething(randomPercentage); // And our sink now receivs correct data.
{% endrunkit %}

The main point is to find data used before/by our function and work our way up the stream until we find the point where wrong/unexpected data is generated.

### 2. Avoid `undefined`

![Avoid](https://media.giphy.com/media/QA88yMhazfDI4/giphy.gif)

Sometimes we can be lazy and leave some variables undefined and expect that by the time we use them, they will be initialized. In some cases, such code is required but when the time comes to use them, it is best to have a default value.

Examples

**Wrong usage.**

```js

let laterUsed;

doAsyncTask().then(()=>{
    useVariable(laterUsed); // ❌ It could still be undefined
})


```
**Correct usage.**

```js
let laterUsed;

doAsyncTask().then(()=>{
    useVariable(laterUsed || externalAlternativeValue); 
    // ✅ Another value is used when the original value is undefined
})

```
**Even more correct usage**

```js
doAsyncTask()
  .then(result => {
    useVariable(laterUsed)
  })
  .catch(e => {
    // handle whatever happens when doAsyncTask() goes wrong
  })
```

And also, avoid
- communicating between asynchronous processes using global variables.
- using `undefined` to indicate an error state. Or an absence of value.

### 3. Know your **PASTA!**

![Pasta](https://media.giphy.com/media/ToMjGpRhf96j23aTc5i/giphy.gif)

There are many different ways to write code and these styles have pasta based categorization that you need to understand in order to know which styles to use.

#### Spaghetti code

Avoid this, it does not matter that real spaghetti is delicious 😋, spaghetti code is characterized by tangled and messy code without any real structure/pattern *you know.... like spaghetti* and this code style is prone to a lot of bugs which are very hard to solve due to the aforementioned tangled messiness that is the code base.


#### Ravioli code

This coding style is in a very nice middle ground where the program is broken down into components that work well together but can also function as good on their own. Whether or not you write Ravioli code is based on how your program is structured.

#### Lasagna code

The holy grail of javascript development, well-structured components separated into layers to perform specific tasks through well-defined interfaces. Use this whenever you can because it reduces the risks of bugs and if they occur, they will be confined to a specific layer.

Another thing to note is **please use type-checking when necessary.**


### 4. Don't do too much at once

![too much](https://media.giphy.com/media/3ohjV6xeE0OrC6QXq8/giphy.gif)

Sometimes we tend to write a lot of code without testing it each step of the way, this is very dangerous because when an error occurs you can't tell which new code caused this issue and will make you debug parts of your code that you don't need to which wastes time and can be stressing.

So each time you add a new feature or decide to route your app data differently, always run the code to make sure that part is okay.

### 4.5. Use linters

Please use linters! They really are good at helping enforce a good coding style and catch errors for you.


## Conclusion

These are some tips I have for you so you can avoid as many bugs as possible and some of them apply to other languages apart from javascript.

*Fun fact: I came up with number 4 because I wrote too much code without testing and spent 7 hours trying to debug it*

Thanks to these wonderful people for their great advice.

{% user jesuszilla_tm %}

{% user gypsydave5 %}

## Thanks for reading!!

*Consider giving me a follow on [Twitter](https://twitter.com/neutrino2211) and you can check out my previous post [here](https://dev.to/neutrino2211/avoiding-weird-javascript-behaviour-true--true--2-but-true--1-pn9)*