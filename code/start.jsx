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
        white-space: pre-wrap;
        word-break: break-word;
    }
`);
nav();
<main>
    <h1 id="start" class="title">Get Started with {APP_NAME}</h1>
    <h2>This page will guide you in creating your first {APP_NAME} single-page app!</h2>
    <h2 class="title" style="color: #800000">CLEARLY IS NOT OFFICIALY OUT YET! THIS PAGE CAN CHANGE!</h2>
    <br/>
    <h2 id="whatIs" class="title">What is {APP_NAME}?</h2>
    <p>{APP_NAME} is a simple and open source JavaScript library, made for making small-scale apps in no time - and without learning a new language!
    <br/>{APP_NAME} uses the latest JavaScript features (Such as <a href="https://reactjs.org/docs/introducing-jsx.html" target="_blank">JSX</a>), combined with the legacy HTML and Vanilla JS to make the best of both worlds.
    <br/>{APP_NAME} contains functions for DOM elements, URLs, cookies, XML elements and more, and even has tools and add-ins to help you build stable and fast apps!</p>
    <br/>
    <h1 id="firstApp" class="title">Make your first {APP_NAME} app</h1>
    <h2>{APP_NAME} lets you write your page in multiple ways - or to do it in your way!</h2>
    <h3>A part of the {APP_NAME} syntax is similar to React - so if you're moving from / to React, It'll be an easy change!</h3>
    <br/>
    <h2 id="import" class="title">1. Import {APP_NAME} to your project</h2>
    <h3>To start using {APP_NAME}, open a new HTML page and add this line as the first line of your head tag:</h3>
    <xmp id="importCode">
        {`<script src="${CLEARLYJS_URL}"></script>`}
    </xmp>
    <h3>It is recommended to use ClearlyDebug:</h3>
    <xmp id="importCode">
        {`<script src="${CLEARLYJS_URL}"></script>`}
        <br/>
        {`<script src="${CLEARLYDEBUG_URL}" defer></script>`}
    </xmp>
    <h3>That's it! your project is now connected to {APP_NAME}</h3>
    <h2 class="title">2. Optional: Set-up Babel and JSX</h2>
    <h3><a href="https://reactjs.org/docs/introducing-jsx.html" target="_blank">JSX</a> lets you write HTML code - and use it in React and in {APP_NAME}!
    <br/>JSX files need to be compiled by a JavaScript compiler named <a href="https://babeljs.io/" target="_blank">Babel</a> in order to use them.</h3>
    <h3 class="title"><a href="https://nodejs.org/en/download/">Download NodeJs and npm here</a></h3>
    <h3>After downloading, go to your terminal and type:</h3>
    <xmp>
        {`npm install @babel/cli @babel/core @babel/plugin-transform-react-jsx`}
    </xmp>
    <h3>(this will download Babel and the React JSX plugin)</h3>
    <h3>That's it!</h3>
    <h3 class="title">Compile a .jsx file</h3>
    <h4 class="title">On Windows</h4>
    <h4>You can use an automated tool to start compiling faster:</h4>
    <h4>Download <a href={`${maindir}/res/compile-jsx.zip`}>This zip file</a>, extract it and drag the .bat file to your project's folder and run it. you'll be asked to specify the folder with the jsx files and the output folder. Closing the window will stop the compilation.</h4>
    <h4>You can edit the batch file to match your needs.</h4>
    <h4 class="title">On any other OS (including Windows ;)</h4>
    <h4>First, extract <a href={`${maindir}/res/babelrc.zip`}>This zip file</a> and put the .babelrc file in your project.</h4>
    <h4>Open your terminal and type:</h4>
    <xmp>
        npx babel <span class="title">JSX-FILE-OR-FOLDER</span> --watch --out-dir <span class="title">OUTPUT-FOLDER</span> --out-file-extension .js --ignore "$folder/**/*.js"
    </xmp>
    <h4>(replace the JSX-FILE-OR-FOLDER and OUTPUT-FOLDER parameters with your directories)</h4>
    <h4>Closing the terminal window will stop the compilation.</h4>
    <h2 class="title">3. Hello World</h2>
    <h3>We'll now make a simple Hello World app.</h3>
    <h3>Start a new project with two files: <span class="title">index.html</span> and <span class="title">index.js</span> (or index.jsx).
    <br/>In the index.html file - we'll <a href="#import">import {APP_NAME}</a> then import our script as defer:</h3>
    <xmp>
        {clrly.id('importCode').innerHTML}
        <br/>
        {`<script src="index.js" defer></script> <!-- Remember that if you use JSX, you need to import the compiled js file! -->`}
    </xmp>
    <h3>In the <span class="title">index.js</span> we'll write:</h3>
    <xmp>
        {`clrly.new("h1", {innerHTML: "Hello World!"}) // the first parameter is the element's type, then the element's attributes`}
    </xmp>
    <h3>Or in JSX:</h3>
    <xmp>
        {`<h1>Hello World!</h1>`}
    </xmp>
    <h3>Try running the HTML file.</h3>
</main>