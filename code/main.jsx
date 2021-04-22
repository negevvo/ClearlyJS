init("Home", ".");
mainStyle();
var bg, bgTxt;
<main>
    {bg = <div id="background">{bgTxt = <h1 id="bgTxt"></h1>}</div>}
    <div class="center">
        <img src={`${maindir}/icon.png`} style="height: 100px; filter: drop-shadow(0 0px 8px #2d2e1536);" />
        <h1 class="title" style="width: 100vw;">{generateTitle()}</h1>
        <h2 class="title">
            {APP_NAME}
        <br/>a JavaScript library by <a href="https://twitter.com/negevvo" target="_blank">negevvo</a>
        </h2>
        <h2 class="title"><a href="pages/start">Get started!</a> | <a href="#">Documentation (soon)</a> | <a href="https://github.com/negevvo/ClearlyJS" target="_blank">Github</a></h2>
    </div>
</main>

const FEATURES = [`${APP_NAME}`, `Simple`, `Dynamic`, `Light`, `Fast`, `JSX support`, `The new JavaScript`, `Debugging tools`, `Super Fast image loading`, `AJAX requests`, `XML tools`, `DOM tools`, `URL tools`, `Cookies`, `Components`, `Vanilla JS support`, `Mobile compatible`, `Open source`];
for(var i = 0; i < 10; i++){
    FEATURES.forEach(function(feature, index){
        var className = (index + i) % 2 == 0 ? "color1" : "color2";
        <span class={className} parent={bgTxt}>{feature}. </span>
    });
}

function generateTitle(){
    const TITLE = "Make it simple";
    const TITLES = [`clrly.new("h1", {innerHTML: "${TITLE}"});`, `clrly.new("h1", {}, "${TITLE}");`, `<h1>${TITLE}</h1>`];
    return TITLES[clrly.randomInt(0, TITLES.length - 1)];
}