---
comments: 6
reactions: 66
views: 10202
published_at: 2019-04-28T17:33:04Z
devto_link: https://dev.to/neutrino2211/what-is-concurrency-in-node-js-3lgo
title: What Is Concurrency In Node JS?
published: true
description: A look at concurrency in nodejs and how to use it
tags: webdev javascript showdev nodejs
cover_image: https://thepracticaldev.s3.amazonaws.com/i/v8dqa0xnqe6p4so6zs6o.jpg
---

Javascript is a single-threaded language, this in certain situations can be very limiting because the process is stuck executing on one thread and can't fully utilize the CPU it is running on but thanks to concurrency, it's single-threaded nature is less of a problem.

***But wait, what is concurrency !?***

I am glad you asked (_Even if you didn't ask just pretend you did and we will move on_ 😉)

### Basics

Concurrency means two or more processes running together in one thread but not at the same time, a lot of us have come across concurrency in Node JS but might not have noticed it (_Prime example = me_ 😅).

Example:

You can run this code!!

{% runkit %}

const fs = require('fs');

fs.writeFile('./file.txt', 'Hello World!!', function(){
    console.log('Wrote "Hello World!!" into file.txt');
});

console.log('Writing "Hello World!!" into file.txt');

{% endrunkit %}

The code in the example above must be familiar to most of us, but did you know this is a prime example of concurrency?. We all agree that line 7 is executed before line 5 right, __Well that is concurrency!__, multiple separate processes running in the same thread by taking turns to execute code. 

These are the steps taken during execution.

- fs.writeFile calls an underlying function which acts as a proxy between JS and C++

- The function calls C++ code which creates a process on the event loop that will handle the write operation

- console.log('Writing "Hello World!!" into file.txt')

- The process writes content to `file.txt`

- The process returns and our callback is executed

- console.log('Wrote "Hello World!!" into file.txt')

This is great and all but there is one side effect to writing code with concurrent behavior and it is affectionately called the **"Callback Hell"**

Example:

Writing a file and then reading from it.

{% runkit %}

const fs = require('fs');

fs.writeFile('./file.txt', 'Hello World!!', function(){
    console.log('Wrote "Hello World!!" into file.txt');
    fs.readFile('./file.txt', function(err, data){
        if(err){
            throw new Error(err);
        }
        console.log('Read "', data.toString(), '" from ./file.txt')
    })

});

console.log('Writing "Hello World!!" into file.txt');
{% endrunkit %}

This gets exponentially worse the more you need to use data provided by such a function but the entire ordeal can be avoided when you use **Promises**.

### Promises

Promises are javascript structures that "Promise" the resolution/failure of asynchronous code and help us handle their successes/failures in a **syntactically** synchronous manner.

Example:

{% runkit %}

const fs = require('fs');

const readPromise = function(){
    return new Promise(function(resolve, reject){
        fs.readFile('./file.txt', function(err, data){
            if(err){
                reject(err);
            }
            resolve(data);
        })
    });
}

const writePromise = function(){
    return new Promise(function(resolve, reject){
        fs.writeFile('./file.txt', 'Hello world!!', function(err){
            if(err){
                reject(err);
            }
            resolve();
        })
    });
}

writePromise()
.then(() => {
    return readPromise()
})
.then(data => 
 console.log(data.toString()))
.catch(err => console.log(err));

{% endrunkit %}

The above code does not look that much better but with promises also come along the async/await keywords which will be extra helpful in cleaning up our code.

The `await` keyword helps us retrieve data resolved by a promise as if it were directly returned from a synchronous function, but `await` only works from within an asynchronous function and this is where the `async` keyword comes in, it helps us define asynchronous functions where we can use `await`.

Example:

{% runkit %}

const fs = require('fs');

const readPromise = function(){
    return new Promise(function(resolve, reject){
        fs.readFile('./file.txt', function(err, data){
            if(err){
                reject(err);
            }
            resolve(data);
        })
    });
}

const writePromise = function(){
    return new Promise(function(resolve, reject){
        fs.writeFile('./file.txt', 'Hello world!!', function(err){
            if(err){
                reject(err);
            }
            resolve();
        })
    });
}

async function start(){
    await writePromise();
    // `data` returned as if it were from a synchronous function
    const data = await readPromise();
    console.log(data.toString());
};

start()

{% endrunkit %}

Now that is clean asynchronous code!!

### Taking it further

Now that we can create promises and `await` them, we no longer need to use callbacks. Here are some general examples.

__Note: The default libraries in Node JS don't have great support for promises so we will be using third-party libraries for the async examples__

#### API calls

Using callbacks

{% runkit %}

const http = require('http');

http.request('http://jsonplaceholder.typicode.com/todos/1', function(res) {
    let data = '';
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
        data += chunk;
    });
    res.on('end', function(){
        console.log(JSON.parse(data));
    })

}).end();

{% endrunkit %}

Using promises

{% runkit %}

const fetch = require('node-fetch');

async function start(){
    const response = await fetch('http://jsonplaceholder.typicode.com/todos/1');
    const data = await response.text();
    console.log(JSON.parse(data));
}

start();

{% endrunkit %}

#### Spawn processes

Using callbacks

{% runkit %}

const { spawn } = require('child_process');
const ls = spawn('echo', ['Hello World!!']);
let data = '';
ls.stdout.on('data', (_data) => {
    data += _data;
});

ls.on('close', (code) => {
    console.log(data);
});

{% endrunkit %}

Using promises

{% runkit %}

const spawn = require('spawn-promise');

async function start(){
    const out = await spawn('echo',['Hello World!!']);
    console.log(out.toString());
}

start();

{% endrunkit %}

## Conclusion

Concurrency is a beautiful thing, especially in large scale applications where speed is a huge priority and I hope this post helped you learn a bit more about it and how best to apply it.

## Thanks for reading!!!

*Consider giving me a follow on [Twitter](https://twitter.com/neutrino2211) and you can check out my previous post [here](https://dev.to/neutrino2211/how-to-avoid-javascript-bugs-31pm)*