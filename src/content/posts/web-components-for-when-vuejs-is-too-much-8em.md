---
comments: 8
reactions: 87
views: 4464
published_at: 2019-02-11T16:40:26Z
devto_link: https://dev.to/neutrino2211/web-components-for-when-vuejs-is-too-much-8em
cover_image: none
title: Web Components, for when VueJS is too much
published: true
description: How to make reactive/stateful components without a framework or library
tags: javascript vuejs webdevelopment webcomponents
---


These days when you want to make a website you just can't avoid the words "VueJS" or "ReactJS" and for very good reasons, these libraries make developing a website much easier thanks to their component-based architecture and how they handle data/properties and update the relevant parts of your site accordingly _it's like magic!!_ ✨.

But for times when I need a simple component or the element I want does not have dynamic data, I ask myself "Do I really need React/Vue for this? 🤔", well that is where web components come in.

Web components are features (not the elements themselves) that help you do a lot of things, one of which is to create a custom element that can be used just like `input`, `div` and the rest.

Let's start!.


### Step 1: Define our component

One way to do this is by creating a class that implements the `HTMLElement` interface and give it a tag name by using the `customElements.define` function.

According to [MDN.](https://developer.mozilla.org/)
>The HTMLElement interface represents any HTML element. Some elements directly implement this interface, while others implement it via an interface that inherits it.

```js
//component.js

class MyComponent extends HTMLElement {
    constructor(){
        super();
        console.log("My component works!");
    }
}

customElements.define("my-component", MyComponent); //Register the new element
```

_Notice that the component name is hyphenated, this is because we are not allowed to make a component called something like `coolcomponent`, the name needs to resemble `x-cool-component` or `cool-component`_

Now when we include `component.js` in our HTML file we can use the component we've just created.

```html
<!-- index.html -->

<body>
    <h1>Hello world!</h1>
    <my-component></my-component>
</body>
```

And if we check the console we will see the message `"My component works!"`, That means our component is working fine.

### Step 2: Element lifecycle

Just like in Vue there are lifecycle callbacks namely

- `connectedCallback`: this is called just after our element has been rendered.

- `disconnectedCallback`: this is called when our element is about to be removed.

```js
//component.js

class MyComponent extends HTMLElement {
    constructor(){
        super();
        console.log("My component works!");
    }

    connectedCallback(){
        console.log("Mounted!")
    }

    disconnectedCallback(){
        console.log("Unmounted!")
    }
}

customElements.define("my-component", MyComponent);
```

We now add a button to index.html which removes our element so we can test all the lifecycle callbacks.

```html
<!-- index.html -->

<body>
    <h1>Hello world!</h1>
    <my-component id="mycomponent"></my-component>
    <button onclick="document.getElementById('mycomponent').remove()">Remove Component</button>
</body>
```

Now when we press the button our component is removed and we see the message `"Unmounted!"` in the console.

### Step 3: Let's make something 

Now that we have the basic knowledge on how to make a custom element let's use it!. A good example of this is a clock element.

_Warning!!!!, **CODE BOMB INCOMING!!!!!**_ 💣💣💣


```js
//component.js

class ClockElement extends HTMLElement {
    constructor(){
        super();
        // Time update interval id
        this.intervalID = 0;
    }
    
    pad(str){
        if(str.length == 1){
            str = "0"+str
        }
        return str;
    }

    //Check if hour is pm or am
    pmOrAm(hour){
        return Number(hour) < 12 ? "am" : "pm";
    }

    getTimeString(){
        const date = new Date();
        const seconds = date.getSeconds().toString()
        const hours = date.getHours().toString()
        const minutes = date.getMinutes().toString()

        var hoursNumber = Number(hours)
        var regularHOurs = hoursNumber-12<=0? hoursNumber : hoursNumber-12;
        return this.pad(regularHOurs.toString())+":"+this.pad(minutes)+":"+this.pad(seconds)+" "+this.pmOrAm(hours)
    }

    disconnectedCallback(){
        //Clear the timer interval
        clearInterval(this.intervalID);
        console.log("Unmounted")
    }

    connectedCallback(){
        //Start the timer
        this.intervalID = setInterval(()=>{
            this.innerHTML = this.getTimeString()
        },1000);
        console.log("Mounted")
    }
}

customElements.define("x-clock",ClockElement)
```

Let me explain what is going on here,

- We have renamed the element to `ClockElement` and registered it as `x-clock`

- There is now an interval id used to identify and eventually clear the interval declared in `connectedCallback`

- The `pad` method is used to add a 0 to numbers that are single digit, this makes the time look like `00:09:16` when it would look like `0:9:16`

- The `pmOrAm` method returns the appropriate suffix for the time based on the hour

- The `getTimeString` method looks complicated but it actually is not, we just get the current hour, minute and second and convert it into a nice string showing the time in 12-hour format

- In the `connectedCallback`, we start a timer that sets the innerHTML of our element to the current time every 1000ms (1 second)

- In the `disconnectedCallback` we clear the timer.


Now that we understand that code, let's add the element to our website.


```html
<!-- index.html -->

<body>
    <h1>Hello world!</h1>
    <x-clock></x-clock>
</body>
```



### Step 4: Attributes

Our clock looks good so far but it can be better, we will now make it display either 24-hour or 12-hour format based on an attribute of our choice. I personally like this syntax :
>`<x-clock military></x-clock>`

so we will aim at using the existence of the attribute as a boolean.




```js
    getTimeString(military){
        const date = new Date();
        const seconds = date.getSeconds().toString()
        const hours = date.getHours().toString()
        const minutes = date.getMinutes().toString()

        if(typeof military == "string"){
            return this.pad(hours)+":"+this.pad(minutes)+":"+this.pad(seconds)
        } else {
            var hoursNumber = Number(hours)
            var regularHOurs = hoursNumber-12<=0? hoursNumber : hoursNumber-12;
            return this.pad(regularHOurs.toString())+":"+this.pad(minutes)+":"+this.pad(seconds)+" "+this.pmOrAm(hours)
        }
    }

    disconnectedCallback(){
        //Clear the timer interval
        clearInterval(this.intervalID);
        console.log("Unmounted")
    }

    connectedCallback(){
        const military = this.getAttribute("military")
        this.innerHTML = this.getTimeString(military)
        this.intervalID = setInterval(()=>{
            this.innerHTML = this.getTimeString(military)
        },1000);
        console.log("Mounted")
    }
```



_If you pay attention to the new code added in `getTimeString` you will see a very strange statement `typeof military == "string"`, this is there because when we set the attribute like this_: 
```html
<x-clock military></x-clock>
```
_we get the value of the attribute as `""` which in javascript is equivalent to false, so `if(military)` will return false even if the attribute exists_

Now we can now choose to display either in 12-hour or 24-hour format by adding an attribute !!

```html
<!-- index.html -->

<body>
    <h1>Hello world!</h1>
    <x-clock></x-clock>
    <x-clock military></x-clock>
</body>
```

### Step 5: Reactive state

Our element currently does not change state in runtime even if our attribute has, that looks like it can be improved upon. So we will now make the element reactive to attribute changes.

To do this we use a `MutationObserver`, this helps us watch for any changes to our element.

A good place to put this is in the element constructor. The `MutationObserver` constructor returns a MutationObserver that invokes a specified callback whenever there are changes to our element.

```js
    constructor(){
        super();
        // Time update interval id
        this.intervalID = 0;
        this.observer = new MutationObserver((mutations)=>{
            for(var mutation of mutations){
                if(mutation.type == "attribute"){
                    // React to changes
                }
            }
        });

        this.observer.observe(this,{
            attributes: true // Only listen for attribute changes
        });
    }
```

We assign the observer to `this.observer` instead of `const observer` because we need to clean up the listener in our `disconnectedCallback`.

```js
    disconnectedCallback(){
        //Disconnect observer
        this.observer.disconnect();

        //Clear the timer interval
        clearInterval(this.intervalID);

        console.log("Unmounted")
    }
```

When the attribute changes we need to display the accurate time format, and for that, we also need to change `const military` to `this.military` so we can access the variable from the MutationObserver.

```js
    constructor(){
        super();
        // Time update interval id
        this.intervalID = 0;
        this.observer = new MutationObserver((mutations)=>{
            for(var mutation of mutations){
                if(mutation.type == "attribute"){
                    // React to changes
                    this.military = this.getAttribute("military");
                }
            }
        });

        this.observer.observe(this,{
            attributes: true // Only listen for attribute changes
        });
    }

    //Other code

    connectedCallback(){
        this.military = this.getAttribute("military")
        this.innerHTML = this.getTimeString(this.military);
        this.intervalID = setInterval(()=>{
            this.innerHTML = this.getTimeString(this.military);
        },1000);
        console.log("Mounted");
    }
```



### We are done 🎉🎉🎉🎉🎉🎉🎉🎉

Not only have we just made our custom element but we made it react dynamically to changes. This only scratches the surface of what web components can do and I can't wait to see the great things you guys will use it for.

_Once again this is not a replacement for VueJS (Or it's counterparts), it is only an alternative for when **Vue is overkill**_

## Thanks For Reading!!