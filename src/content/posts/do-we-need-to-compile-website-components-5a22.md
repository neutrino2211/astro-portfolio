---
comments: 5
reactions: 16
views: 29
published_at: 2019-02-26T15:33:35Z
devto_link: https://dev.to/neutrino2211/do-we-need-to-compile-website-components-5a22
cover_image: none
title: Do We Need To Compile Website Components?
published: true
description: A discussion on the state of component-based rendering and if compilers don't need to be a part of the process.
tags: discuss javascript html
---

Using components as building blocks for a website is very popular these days because of tools like `@angular/cli`, `@vue/cli` and `create-react-app` but all these tools can only be used from the command-line.

This is acceptable because the syntax these libraries use is not supported in browsers and need to be compiled but what if we could use these building blocks without the need of a compiler.

I personally created a proof-of-concept [library](https://github.com/neutrino2211/rx) that does this and I want to know if such an approach needs to be taken to solve the issues that compilers bring like unreadable minified code, complex build processes, and poor debugging experiences or even if compilers bring issues to begin with.

Really hope to hear from the community.


_My proof-of-concept contains some documentation_