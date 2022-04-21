import clrly from 'https://cdn.jsdelivr.net/npm/clearlyjs'

init("Home", ".");
mainStyle();
var bg, bgTxt;
<main>
    {bg = <div id="background">{bgTxt = <h1 id="bgTxt"></h1>}</div>}
    <div class="center">
        <img src={`${maindir}/logo.png`} style="width: 50vw;" />
        <h1 class="title" style="width: 100vw;">{generateTitle()}</h1>
        <h2 class="title" style="cursor: default;"><a href="https://negevvo.gitbook.io/clearlyjs/getting-started/get-started-with-clearlyjs">Get started!</a> | <a href="https://negevvo.gitbook.io/clearlyjs/">Documentation</a> | <a href="https://github.com/negevvo/ClearlyJS" target="_blank">Github</a></h2>
        <h2 class="title" style="cursor: default;">Start in: <a target="_blank" href="https://codesandbox.io/s/clearlyjs-template-wrsjv?fontsize=14&hidenavigation=1&module=%2Fcode%2Findex.js&theme=dark">CodeSandbox</a> | <a target="_blank" href="https://codepen.io/pen/?template=KKajRxM">CodePen</a></h2>
    </div>
</main>

const FEATURES = [`${APP_NAME}`, `Simple`, `Dynamic`, `Light`, `Fast`, `JSX support`, `The new JavaScript`, `Debugging tools`, `Super Fast image loading`, `AJAX requests`, `XML tools`, `DOM tools`, `URL tools`, `Cookies`, `Blobs`, `Components`, `Vanilla JS support`, `Mobile compatible`, `Open source`];
for(var i = 0; i < 10; i++){
    FEATURES.forEach(function(feature, index){
        var className = (index + i) % 2 == 0 ? "color1" : "color2";
        <span class={className} parent={bgTxt}>{feature}. </span>
    });
}

function generateTitle(){
    const TITLE = "Welcome!";
    const TITLES = [`clrly.new("h1", {innerHTML: "${TITLE}"});`, `clrly.new("h1", {}, "${TITLE}");`, `<h1>${TITLE}</h1>`];
    return TITLES[clrly.randomInt(0, TITLES.length - 1)];
}



console.log(`Hey! What's your name?\nRespond with: myNameIs("name")`);

function myNameIs(yourName, download){
    var HTML = `
    <title>Hi!</title>
    <h1>Hello ${yourName}, Nice to meet you!</h1>
    <h2>Hope your'e enjoying ${APP_NAME}!<br/>Remember to leave some feedback on Github!</h2>
    `;
    if(download){
        clrly.download(clrly.toFile(HTML), "Hi.html");
    }else{
        clrly.go(clrly.toFile(HTML), true);
    }
}