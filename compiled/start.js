const CLEARLYJS_URL = `https://cdn.jsdelivr.net/gh/negevvo/ClearlyJS@main/ClearlyJS/clearly.js`;
const CLEARLYDEBUG_URL = `https://cdn.jsdelivr.net/gh/negevvo/ClearlyJS@main/ClearlyJS/clearlyDebug.js`;
init("Get Started", "../..");
mainStyle();
clrly.style(`
    main{
        margin: 10px;
    }
    p, xmp{
        font-size: 17px;
    }
    xmp{
        background-color: white;
        border-radius: 10px;
        max-width: 100vw;
        white-space: pre-wrap
    }
`);
nav();
clrly.new("main", null, clrly.new("h1", {
  id: "start",
  class: "title"
}, "Get Started with ", APP_NAME), clrly.new("h2", null, "This page will guide you in creating your first ", APP_NAME, " single-page app!"), clrly.new("h2", {
  class: "title",
  style: "color: #800000"
}, "CLEARLY IS NOT OFFICIALY OUT YET! THIS PAGE CAN CHANGE!"), clrly.new("br", null), clrly.new("h2", {
  id: "whatIs",
  class: "title"
}, "What is ", APP_NAME, "?"), clrly.new("p", null, APP_NAME, " is a simple and open source JavaScript library, made for making small-scale apps in no time - and without learning a new language!", clrly.new("br", null), APP_NAME, " uses the latest JavaScript features (Such as ", clrly.new("a", {
  href: "https://reactjs.org/docs/introducing-jsx.html",
  target: "_blank"
}, "JSX"), "), combined with the legacy HTML and Vanilla JS to make the best of both worlds.", clrly.new("br", null), APP_NAME, " contains functions for DOM elements, URLs, cookies, XML elements and more, and even has tools and add-ins to help you build stable and fast apps!"), clrly.new("br", null), clrly.new("h1", {
  id: "firstApp",
  class: "title"
}, "Make your first ", APP_NAME, " app"), clrly.new("h2", null, APP_NAME, " lets you write your page in multiple ways - or to do it in your way!"), clrly.new("h3", null, "A part of the ", APP_NAME, " syntax is similar to React - so if you're moving from / to React, It'll be an easy change!"), clrly.new("br", null), clrly.new("h2", {
  id: "import",
  class: "title"
}, "1. Import ", APP_NAME, " to your project"), clrly.new("h3", null, "To start using ", APP_NAME, ", open a new HTML page and add this line as the first line of your head tag:"), clrly.new("xmp", {
  id: "importCode"
}, `<script src="${CLEARLYJS_URL}"></script>`), clrly.new("h3", null, "It is recommended to use ClearlyDebug:"), clrly.new("xmp", {
  id: "importCode"
}, `<script src="${CLEARLYJS_URL}"></script>`, clrly.new("br", null), `<script src="${CLEARLYDEBUG_URL}" defer></script>`), clrly.new("h3", null, "That's it! your project is now connected to ", APP_NAME), clrly.new("h2", {
  class: "title"
}, "2. Optional: Set-up Babel and JSX"), clrly.new("h3", null, clrly.new("a", {
  href: "https://reactjs.org/docs/introducing-jsx.html",
  target: "_blank"
}, "JSX"), " lets you write HTML code - and use it in React and in ", APP_NAME, "!", clrly.new("br", null), "JSX files need to be compiled by a JavaScript compiler named ", clrly.new("a", {
  href: "https://babeljs.io/",
  target: "_blank"
}, "Babel"), " in order to use them."), clrly.new("h3", {
  class: "title"
}, clrly.new("a", {
  href: "https://nodejs.org/en/download/"
}, "Download NodeJs and npm here")), clrly.new("h3", null, "After downloading, go to your terminal and type:"), clrly.new("xmp", null, `npm install @babel/cli @babel/core @babel/plugin-transform-react-jsx`), clrly.new("h3", null, "(this will download Babel and the React JSX plugin)"), clrly.new("h3", null, "That's it!"), clrly.new("h3", {
  class: "title"
}, "Compile a .jsx file"), clrly.new("h4", {
  class: "title"
}, "On Windows"), clrly.new("h4", null, "You can use an automated tool to start compiling faster:"), clrly.new("h4", null, "Download ", clrly.new("a", {
  href: `${maindir}/res/compile-jsx.zip`
}, "This zip file"), ", extract it and drag the .bat file to your project's folder and run it. you'll be asked to specify the folder with the jsx files and the output folder. Closing the window will stop the compilation."), clrly.new("h4", null, "You can edit the batch file to match your needs."), clrly.new("h4", {
  class: "title"
}, "On any other OS (including Windows ;)"), clrly.new("h4", null, "First, extract ", clrly.new("a", {
  href: `${maindir}/res/babelrc.zip`
}, "This zip file"), " and put the .babelrc file in your project."), clrly.new("h4", null, "Open your terminal and type:"), clrly.new("xmp", null, "npx babel ", clrly.new("span", {
  class: "title"
}, "JSX-FILE-OR-FOLDER"), " --watch --out-dir ", clrly.new("span", {
  class: "title"
}, "OUTPUT-FOLDER"), " --out-file-extension .js --ignore \"$folder/**/*.js\""), clrly.new("h4", null, "(replace the JSX-FILE-OR-FOLDER and OUTPUT-FOLDER parameters with your directories)"), clrly.new("h4", null, "Closing the terminal window will stop the compilation."), clrly.new("h2", {
  class: "title"
}, "3. Hello World"), clrly.new("h3", null, "We'll now make a simple Hello World app."), clrly.new("h3", null, "Start a new project with two files: ", clrly.new("span", {
  class: "title"
}, "index.html"), " and ", clrly.new("span", {
  class: "title"
}, "index.js"), " (or index.jsx).", clrly.new("br", null), "In the index.html file - we'll ", clrly.new("a", {
  href: "#import"
}, "import ", APP_NAME), " then import our script as defer:"), clrly.new("xmp", null, clrly.id('importCode').innerHTML, clrly.new("br", null), `<script src="index.js" defer></script> <!-- Remember that if you use JSX, you need to import the compiled js file! -->`), clrly.new("h3", null, "In the ", clrly.new("span", {
  class: "title"
}, "index.js"), " we'll write:"), clrly.new("xmp", null, `clrly.new("h1", {innerHTML: "Hello World!"}) // the first parameter is the element's type, then the element's attributes`), clrly.new("h3", null, "Or in JSX:"), clrly.new("xmp", null, `<h1>Hello World!</h1>`), clrly.new("h3", null, "Try running the HTML file."));