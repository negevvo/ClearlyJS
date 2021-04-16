const APP_NAME = "ClearlyJS";
var maindir = ".";

function init(page, mainDir) {
  maindir = mainDir;
  return clrly.initialize({
    title: `${page} | ${APP_NAME}`,
    icon: `${mainDir}/favicon.png`,
    theme: "#f2f2f2",
    mobile: true
  });
}

function mainStyle() {
  return clrly.style(`
    @import url('https://fonts.googleapis.com/css2?family=Zilla+Slab+Highlight:wght@700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300&display=swap');
    *{
        font-family: 'Nunito', sans-serif;
        transition: all 1s;
    }
    body{
        margin: 0;
        text-align: center;
        background-color: #f2f2f2;
        position: relative;
    }
    ::selection{
        background: #332f00;
        color: #e6e6e6;
    }
    a{
        color: black;
    }
    a:hover{
        color: #4d3900;
    }
    .title, a{
        font-family: 'Zilla Slab Highlight', cursive;
    }
    .center{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    #background{
        opacity: 0.15;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        overflow: hidden;
        z-index: -1;
    }
    #background h1{
        margin: 0;
    }
    #bgTxt .color1{
        color: #9b997d;
    }
    #bgTxt .color2{
        color: #9c9c9c;
    }
`);
}

function nav() {
  return clrly.new("nav", null, clrly.style(`
                nav{
                    background-color: rgba(255, 255, 255, 0.7);
                    backdrop-filter: blur(5px);
                    padding: 10px;
                    position: sticky;
                    top: 0;
                }
                nav img{
                    height: 70px;
                }
                nav img:hover{
                    filter: drop-shadow(0 0px 8px #2d2e1536);
                }
            `), clrly.new("a", {
    href: maindir
  }, clrly.new("img", {
    src: `${maindir}/icon.png`
  })));
}