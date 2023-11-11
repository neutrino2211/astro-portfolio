---
comments: 5
reactions: 16
views: 2895
published_at: 2019-02-18T15:04:16Z
devto_link: https://dev.to/neutrino2211/the-js-developers-view-of-wasm-in-2019-36og
cover_image: none
title: The JS developer's view of WASM in 2019
published: true
description: A look at WASM from the javascript developer's perspective
tags: javascript webassembly webdev
---
<!-- ![](https://thepracticaldev.s3.amazonaws.com/i/x5seu1k4dx2ihu2h9kto.png) -->

Webassembly is a great innovation but the majority of modules are made with C++, Rust or GO, and as javascript developers having to maintain two codebases for one project is hard, fortunately that is where [AssemblyScript](https://github.com/AssemblyScript/assemblyscript) comes in, assemblyscript compiles typescript to wasm and this opens up webassembly to all javascript developers.

Before assemblyscript arrived we had to learn C++ before we could use webassembly but now we have the means of getting into the webassembly ecosystem.

To better understand this environment we will need to ask ourselves a few questions.

### 1: What can we gain from webassembly?

A huge plus we get from webassembly is the performance boost, webassembly is up to 32x faster than javascript and this allows javascript apps to run at near-native performance.

Native apps made with javascript are often criticized for being slow and unresponsive, especially in low power devices despite the constant performance improvements being shipped by the developers, so having webassembly will allow these apps to run a lot faster.

### 2: What can we do with webassembly?

There are a lot of things that can be done with webassembly, some of which include

- Data Science.

- Graphic Design.

- Game Development.

- Virtual Reality.

- Platform Emulation. _There is a Windows 2000 virtual machine that is written in webassembly_

This list can go on for a while but that will make this post too long, so here is a [link](https://webassembly.org/docs/use-cases/) to its use cases.

### 3: How is support for webassembly?

Webassembly has a very active community behind it, there are a lot of developers working on great projects like.

- [ASM-DOM](https://github.com/mbasso/asm-dom): A webassembly virtual DOM for building C++ SPAs

- [Blazor](https://github.com/aspnet/blazor): An experimental web UI framework using C#/Razor

- [Yew](https://github.com/DenisKolodin/yew): A rust framework for making web apps

- [go-vdom-wasm](https://github.com/mfrachet/go-vdom-wasm): An experimental virtual DOM for golang and WASM

- [Asmble](https://github.com/cretz/asmble): Webassembly to JVM bytecode compiler

- [Wasmer](https://github.com/wasmerio/wasmer): A standalone JIT WebAssembly runtime _A similar project is [wasmjit](https://github.com/rianhunter/wasmjit)_

- [pywasm](https://github.com/mohanson/pywasm): A webassembly interpreter written in python

- [wac](https://github.com/kanaka/wac): A webassembly interpreter written in C. _Supports SDL!_

This means our modules can also fit into a bigger picture and practically run **everywhere**

### 4: How do we get started?

The only way to get started is by using assemblyscript and it is very easy to set up.

##### Step 1: install

We install assemblyscript by running
```sh
$ npm i AssemblyScript/assemblyscript -g
```
This installs a few commands.

- asc: This is the assemblyscript compiler, it compiles typescript files to wasm binaries.

```sh
$ asc -h
SYNTAX
  asc [entryFile ...] [options]

EXAMPLES
  asc hello.ts
  asc hello.ts -b hello.wasm -t hello.wat
  asc hello1.ts hello2.ts -b -O > hello.wasm
```

- asinit: Sets up a new assemblyscript project or updates an existing one

```sh
$ asinit -h
Sets up a new AssemblyScript project or updates an existing one.
For example, to create a new project in the current directory:

  asinit .

```

#####Step 2: Initialize project

To initialize a project we run
```sh
$ asinit my-project
```
This creates a new project for us, but we have to manually install dependencies
```sh
$ cd my-project && npm install
```

#####Step 3: Build

The `asinit` command takes care of adding build scripts to our project so all we have to do is run
```sh
$ npm run asbuild
```

## Examples

### 1: Pointers

Web assembly uses a stack-based virtual machine and this means it uses an array-like structure called a *stack* to store variables, a problem with this is that we will eventually run into pointers and javascript does not play well with pointers.

Scenario: We have a wasm library compiled from assemblyscript that returns a very important string.

```ts
export function return_string(): string{
    return "Important stuff";
}
```
And we use it in our javascript file like this

```js
const wasmModule = await WebAssembly.instantiateStreaming(fetch('simple.wasm'), {})
const importantResult = wasmModule.instance.exports.return_string();

console.log(importantResult); //=> 8
```
The code above will run with no issues but what gets logged in the console is not the string but a pointer to the string and if we look at our memory, we will find that it looks like this.

```js
"\0f\00\00\00I\00m\00p\00o\00r\00t\00a\00n\00t\00 \00s\00t\00u\00f\00f";
```
Instead of loading the wasm binary directly via `WebAssembly.instantiateStreaming`, we can load it with assemblyscript itself and that will help us with those pesky pointers.

```js
import { instantiateStreaming } from "assemblyscript/lib/loader";
const wasmModule = await instantiateStreaming(fetch('simple.wasm'), {})
const importantResult = wasmModule.getString(wasmModule.return_string());

console.log(importantResult); //=> Important stuff
```



### Example 2: DOM

As a javascript developer, using the DOM is essential but webassembly has no straight forward way of doing this, so different languages have different ways of getting around the problem.

- C++ (emscripten)

```cpp
auto root = emscripten::val::global("document").call<emscripten::val>(
      "getElementById",
      std::string("root")
    );
```

- GO (syscall/js)

```go
var root = js.Global().Get("document").Call("getElementById", "root")
```

- Rust (wasm_bindgen)

```rust
let document = web_sys::window().unwrap().document().unwrap();
let root = document.get_element_by_id("root").unwrap();
```

We can also achieve this but it will take a bit more effort. The first thing we need to do is provide the module a method it can use to manipulate the DOM.

```js
import { instantiateStreaming } from "assemblyscript/lib/loader";
const wasmModule = await instantiateStreaming(fetch('simple.wasm'), {
    index: {
        changeDiv: (id, value)=>{
            var div = document.getElementById(wasmModule.getString(id));
            div.innerHTML = wasmModule.getString(value);
        }
    }
})
```
Then use it in our module

```ts
declare function changeDiv(id: string, value: string): void;
export function set_hello_message(): void {
    changeDiv("helloDiv","Hello from WASM");
}
```

##Conclusion

WASM is fast, safe and reliable so having a way to use it without leaving our comfort zone is very encouraging.

#Thanks for reading!!!!

_The original version of this post was, in all honesty, a very sour look at the situation and I am glad @jtenner pointed that out. I hope this shows a better view_

