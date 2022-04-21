import clrly from 'https://cdn.jsdelivr.net/npm/clearlyjs';
import Global from './global.js';
Global.init("Home", ".");
Global.mainStyle();
const APP_NAME = Global.APP_NAME;
var bg, bgTxt;
clrly.new("main", null, bg = clrly.new("div", {
  id: "background"
}, bgTxt = clrly.new("h1", {
  id: "bgTxt"
})), clrly.new("div", {
  class: "center"
}, clrly.new("img", {
  src: `${maindir}/logo.png`,
  style: "width: 50vw;"
}), clrly.new("h1", {
  class: "title",
  style: "width: 100vw;"
}, generateTitle()), clrly.new("h2", {
  class: "title",
  style: "cursor: default;"
}, clrly.new("a", {
  href: "https://negevvo.gitbook.io/clearlyjs/getting-started/get-started-with-clearlyjs"
}, "Get started!"), " | ", clrly.new("a", {
  href: "https://negevvo.gitbook.io/clearlyjs/"
}, "Documentation"), " | ", clrly.new("a", {
  href: "https://github.com/negevvo/ClearlyJS",
  target: "_blank"
}, "Github")), clrly.new("h2", {
  class: "title",
  style: "cursor: default;"
}, "Start in: ", clrly.new("a", {
  target: "_blank",
  href: "https://codesandbox.io/s/clearlyjs-template-wrsjv?fontsize=14&hidenavigation=1&module=%2Fcode%2Findex.js&theme=dark"
}, "CodeSandbox"), " | ", clrly.new("a", {
  target: "_blank",
  href: "https://codepen.io/pen/?template=KKajRxM"
}, "CodePen"))));
const FEATURES = [`${APP_NAME}`, `Simple`, `Dynamic`, `Light`, `Fast`, `JSX support`, `The new JavaScript`, `Debugging tools`, `Super Fast image loading`, `AJAX requests`, `XML tools`, `DOM tools`, `URL tools`, `Cookies`, `Blobs`, `Components`, `Vanilla JS support`, `Mobile compatible`, `Open source`];

for (var i = 0; i < 10; i++) {
  FEATURES.forEach(function (feature, index) {
    var className = (index + i) % 2 == 0 ? "color1" : "color2";
    clrly.new("span", {
      class: className,
      parent: bgTxt
    }, feature, ". ");
  });
}

function generateTitle() {
  const TITLE = "Welcome!";
  const TITLES = [`clrly.new("h1", {innerHTML: "${TITLE}"});`, `clrly.new("h1", {}, "${TITLE}");`, `<h1>${TITLE}</h1>`];
  return TITLES[clrly.randomInt(0, TITLES.length - 1)];
}

console.log(`Hey! What's your name?\nRespond with: myNameIs("name")`);

function myNameIs(yourName, download) {
  var HTML = `
    <title>Hi!</title>
    <h1>Hello ${yourName}, Nice to meet you!</h1>
    <h2>Hope your'e enjoying ${APP_NAME}!<br/>Remember to leave some feedback on Github!</h2>
    `;

  if (download) {
    clrly.download(clrly.toFile(HTML), "Hi.html");
  } else {
    clrly.go(clrly.toFile(HTML), true);
  }
}