import clrly from 'https://cdn.jsdelivr.net/npm/clearlyjs/clearly.js';
export default class Global {
  static get APP_NAME() {
    return "ClearlyJS";
  }

  static init(page, mainDir) {
    Global.maindir = mainDir || '.';
    return clrly.initialize({
      title: `${page} | ${Global.APP_NAME}`,
      icon: `${mainDir}/favicon.png`,
      theme: "#f2f2f2",
      mobile: true
    });
  }

  static mainStyle() {
    return clrly.style(`
    @import url('https://fonts.googleapis.com/css2?family=Zilla+Slab+Highlight:wght@700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300&display=swap');
    *{
        font-family: monospace;
        transition: all 1s;
    }
    body{
        margin: 0;
        text-align: center;
        background-color: #FFFFFF;
        position: relative;
    }
    ::selection{
        background: #332f00;
        color: #FFF2CC;
    }
    a{
        color: black;
        text-decoration: none;
    }
    a:hover{
        color: white;
        background: black;
    }
    .title, a{
        font-family: monospace;
        color: #332f00;
    }
    .center{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    #background{
        opacity: 0.1;
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

  static nav() {
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
      href: Global.maindir
    }, clrly.new("img", {
      src: `${Global.maindir}/icon.png`
    })));
  }

}
