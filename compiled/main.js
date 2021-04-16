init("Home", ".");
mainStyle();
var bg, bgTxt;
clrly.new("main", null, bg = clrly.new("div", {
  id: "background"
}, bgTxt = clrly.new("h1", {
  id: "bgTxt"
})), clrly.new("div", {
  class: "center"
}, clrly.new("img", {
  src: `${maindir}/icon.png`,
  style: "height: 100px; filter: drop-shadow(0 0px 8px #2d2e1536);"
}), clrly.new("h1", {
  class: "title",
  style: "width: 100vw;"
}, generateTitle()), clrly.new("h2", {
  class: "title"
}, APP_NAME, clrly.new("br", null), "a JavaScript library by ", clrly.new("a", {
  href: "https://twitter.com/negevvo",
  target: "_blank"
}, "negevvo")), clrly.new("h2", {
  class: "title"
}, "COMING SOON.")));
const FEATURES = [`${APP_NAME}`, `Simple`, `Dynamic`, `Light`, `Fast`, `JSX support`, `The new JavaScript`, `Debugging tools`, `Super Fast image loading`, `XML tools`, `DOM tools`, `URL tools`, `Cookies`, `Components`, `Vanilla JS support`, `Mobile compatible`, `Open source`];

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
  const TITLE = "Make it simple";
  const TITLES = [`clrly.new("h1", {innerHTML: "${TITLE}"});`, `clrly.new("h1", {}, "${TITLE}");`, `<h1>${TITLE}</h1>`];
  return TITLES[clrly.randomInt(0, TITLES.length - 1)];
}