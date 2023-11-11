---
comments: 3
reactions: 19
views: 13484
published_at: 2019-03-11T19:15:38Z
devto_link: https://dev.to/neutrino2211/avoiding-weird-javascript-behaviour-true--true--2-but-true--1-pn9
cover_image: none
title: Avoiding Weird Javascript Behaviour (true + true === 2 but true !== 1)
published: true
description: Explaining some weird behavior in javascript and how to avoid it
tags: javascript nodejs
---

Every single programming language is designed to be intuitive and Javascript is no exception, but it does have some crazy quirks that make it stand out, one of which is its weird behavior with types and I am pretty sure you have seen the memes.

<img alt="javascript meme" src="https://thepracticaldev.s3.amazonaws.com/i/a2k7x6ghilt6hp5mhgd7.png" height="400" width="400"/>

This can be traumatizing the first time you see it but it does not have to be, so I want to shed a little light on it and help you avoid running into such.

## How Javascript types work

Javascript is a very very loosely typed language, this is not bad at all but in some situations, it can cause very bad head scratching. One of these moments occurred when I first saw this a few years back.

```js
true + true === 2 // => true

true !== 1 // => true
```

At first glance, it looks very *wrong* but don't fret there is nothing wrong here, that is just how javascript works. Javascript handles types in a very different way, it has only 6 primitive types and all the code you write is represented by one of them.

- `boolean`

- `number`

- `string`

- `object`

- `function`

- `undefined`

This alone is not enough to cause such strange behavior but the way they are handled does, javascript always converts types to best fit what they are being used for, this is called **Type Coercion** and sometimes it changes value types to those not intended by the developer, this is why `true + true === 2`.

The binary `+` operator is primarily meant to add numbers but when it is faced with boolean values it's forced to convert them to numbers thus `true` becomes `1` which makes `true + true` become `1 + 1` and the expression is turned into

```js
1 + 1 === 2 // => true
```

But the second expression `true !== 1` seems to defeat what I just explained above but it really makes perfect sense too. The `!==` operator performs a strict comparison so it checks both value and type but since `true` is a boolean and `1` is a number they are not strictly equal thus the expression is true.

## Truthy and Falsy

Every value in javascript has its own boolean value (truthy/falsy), these values are used in operations where a boolean is expected but not given, you have most likely used this feature before but never knew what was going under the hood. 

Example:

```js
const array = [];

if(array){
    console.log('Truthy!');
}
```

In the code above, `array` is not a boolean but because the value is "truthy", the if block will be executed.

#### Falsy vs `false`

Falsy values are values with an inherent boolean `false`, the following are falsy values.

- 0
- '' or ""
- null
- undefined
- NaN

Example:

```js
const zero = 0;
const emptyString = "";

if(!zero){
    console.log("0 is falsy");
}

if(!emptyString){
    console.log("An empty string is falsy")
}

console.log(NaN || 1); // => 1
console.log(null || 1); // => 1
console.log(undefined || 1); // => 1
```

Note that the value `false` is falsy but falsy values are not `false` and the right way to differentiate them is by using **strict comparison** operators.

Example:

```js
0 == false // => true
0 === false // => false
```

#### Truthy vs `true`

Every value that is not `falsy` is considered `truthy`, these include

- strings

- arrays

- objects

- functions

Example: 

```js
function somethingIsWrong(){
    console.log("Something went horribly wrong")
}

function callback(){
    console.log("Hello From Callback");
}

const string = "Hello world!"
const array = [1,2,3];
const object = {};

if(string){
    console.log(string) // => "Hello world!"
    const functionToCall = callback || somethingIsWrong
    functionToCall() // => "Hello From Callback"
    console.log(array || "That was not meant to happen")
    console.log(object || "This is strange")
}
```

## Type coercion

Type coercion is the process of converting one type to another and every value in javascript can be coerced.

There two types of coercion:

- implicit: This is done automatically when the need arises e.g


```js
"0" + 5 == "05" // => true
```

The above example shows implicit coercion in its most recognizable form, the `+` operator is not only used to add numbers but strings too so when it is told to add a number to a string it has to convert the number to a string first, which changes `5` to `"5"` and the expression becomes.

```js
"0" + "5" == "05" // => true
```

- explicit: This is when a developer converts types by writing the appropriate code to do so e.g

```js
"0" + String(5) == "05"
```

## Type conversions

When a value is coerced, it undergoes one of three conversions.

- ToString: This is triggered implicitly by the `+` operator and explicitly by calling the `String` function e.g

```js
const height = 5.8;
console.log("Hello I am " + height + "ft tall") // => "Hello I am 5.8ft tall"
```

The `+` operator implicitly converts the floating point number to a string before concatenating them.

```js
const height = 5.8;
console.log("Hello I am " + String(height) + "ft tall") // => "Hello I am 5.8ft tall"
```

Here we use the `String` function to explicitly convert the floating point number to a string.

- ToBoolean: This is triggered implicitly by either their context or by logical operators (`!`, `||` and `&&`) and explicitly by the `Boolean` function.

```js
if(3){
    console.log("Implicitly by context")
}

if(Boolean(1)){
    console.log("Explicitly by the 'Boolean' function")
}

console.log(!0) // => true

console.log(0 || "Hello") // => "Hello"

console.log(4 && 5) // => true
```

Note that the `||` operator does not return the truthy value of `"Hello"` but the actual string itself

- ToNumber: Numeric conversion is very tricky because it is triggered by a lot of operators `> < <= >=  | & ^ ~ - + * / % != ==`. Note, that binary `+` does not trigger numeric conversion and `==` does not trigger numeric conversion when both operands are strings.

There is a lot more on coercion that I can't explain here, so here is a link to [an excellent post](https://medium.freecodecamp.org/js-type-coercion-explained-27ba3d9a2839) on javascript type coercion.

## Avoiding this behavior

The best way to avoid this behavior is by type checking and an easy way to do this in vanilla javascript is by using a strict equality operator `===` when comparing values or checking a variable's type with the `typeof` keyword.

Example:

**without type checking**
```js
const number = 21;
const string = "21"

function add100(number){
    console.log(100 + number)
}

add100(number) // => 121
add100(string) // => "10021"
```

**with type checking**
```js
const number = 21;
const string = "21"

function add100(number){
    if(typeof number == "number"){
        console.log(100 + number)
    } else {
        console.log("Need a number, not a "+typeof number);
    }
}

add100(number) // => 121
add100(string) // => "Need a number, not a string"
```

Unfortunately, the examples above can not help you with checking classes, for that you need to use the keyword `instanceof`.

```js
class ImportantClass {
    constructor(){
        this.importantValue = 1;
    }

    doImportantStuff(){
        console.log(this.importantValue);
    }
}

function useImportantClass(value){
    if(value instanceof ImportantClass){
        value.doImportantStuff();
    } else {
        console.log("Value needs to be of type ImportantClass, not "+typeof value)
    }
}

const value = new ImportantStuff();

useImportantClass(value); // => 1
useImportantClass("Not important"); // => Value needs to be of type ImportantClass, not string
```

But by far the easiest way to avoid this is by using Typescript. If you haven't heard of it, [Typescript](https://www.typescriptlang.org/) is a typed superset of javascript that compiles to normal javascript. In short, Typescript and its compiler help you write code that is very deterministic and I encourage you to click the link if you want to know more because the site explains more than I can.

## Thanks for reading!!!

_Consider giving me a follow on [Twitter](https://twitter.com/neutrino2211)_