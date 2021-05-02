# Get Started with ClearlyJS

## What is ClearlyJS?

ClearlyJS is a simple and open source JavaScript library, made for making small-scale apps in no time - and without learning a new language!  
ClearlyJS uses the latest JavaScript features \(Such as [JSX](https://reactjs.org/docs/introducing-jsx.html)\), combined with the legacy HTML and Vanilla JS to make the best of both worlds.  
ClearlyJS contains functions for DOM elements, URLs, cookies, XML elements and more, and even has tools and add-ins to help you build stable and fast apps!

## Make your first ClearlyJS app

ClearlyJS lets you write your page in multiple ways - or to do it in your way!

{% hint style="info" %}
The ClearlyJS syntax is similar to React - so if you're moving from or to React, It'll be an easy move!
{% endhint %}

### 1. Import ClearlyJS to your project

To start using ClearlyJS, open a new HTML page and add this line as the first line of your head tag:

{% code title="index.html" %}
```markup
<script src="https://cdn.jsdelivr.net/gh/negevvo/ClearlyJS@main/ClearlyJS/clearly.js"></script>
```
{% endcode %}

It is recommended to use ClearlyDebug:

{% code title="index.html" %}
```markup
<script src="https://cdn.jsdelivr.net/gh/negevvo/ClearlyJS@main/ClearlyJS/clearly.js"></script>
<script src="https://cdn.jsdelivr.net/gh/negevvo/ClearlyJS@main/ClearlyJS/clearlyDebug.js" defer></script>
```
{% endcode %}

That's it! your project is now connected to ClearlyJS!

### 2. Optional: Set-up Babel and JSX

[JSX](https://reactjs.org/docs/introducing-jsx.html) lets you write HTML code - and use it in React and in ClearlyJS!  
JSX files need to be compiled by a JavaScript compiler named [Babel](https://babeljs.io/) in order to use them.

\*\*\*\*[**Download NodeJs and npm here**](https://nodejs.org/en/download/)

After downloading, go to your terminal and type:

```bash
npm install @babel/cli @babel/core @babel/plugin-transform-react-jsx
```

\(this will download Babel and the React JSX plugin\)

That's it!

#### **Compile a .jsx file**

**On Windows**

You can use an automated tool to start compiling faster:

Download the zip file below, extract it and drag the .bat file to your project's folder and run it. you'll be asked to specify the folder with the jsx files and the output folder. Closing the window will stop the compilation. You can edit the batch file to match your needs.

{% file src="../.gitbook/assets/compile-jsx \(1\).zip" %}

**On any other OS \(including Windows ;\)**

First, extract the zip file below and put the .babelrc file in your project.

{% file src="../.gitbook/assets/babelrc.zip" %}

Open your terminal and type:

```bash
npx babel JSX-FILE-OR-FOLDER --watch --out-dir OUTPUT-FOLDER --out-file-extension .js --ignore "$folder/**/*.js"
```

\(replace the JSX-FILE-OR-FOLDER and OUTPUT-FOLDER parameters with your directories\)

{% hint style="warning" %}
Closing the terminal window will stop the compilation.
{% endhint %}

### 3. Hello World

We'll now make a simple Hello World app.

Start a new project with two files: index.html and index.js \(or index.jsx\).

In the index.html file - we'll [import ClearlyJS](./#import) then import our script as defer:

{% code title="index.html" %}
```markup
<script src="https://cdn.jsdelivr.net/gh/negevvo/ClearlyJS@main/ClearlyJS/clearly.js"></script>
<script src="index.js" defer></script> <!-- Remember that if you use JSX, you need to import the compiled js file! -->
```
{% endcode %}

In the index.js we'll write:

{% tabs %}
{% tab title="index.js" %}
{% code title="index.js" %}
```javascript
clrly.new("h1", {innerHTML: "Hello World!"}) // the first parameter is the element's type, then the element's attributes
```
{% endcode %}
{% endtab %}

{% tab title="index.jsx" %}
{% code title="index.jsx" %}
```jsx
<h1>Hello World!</h1>
```
{% endcode %}
{% endtab %}
{% endtabs %}

Try running the HTML file.

