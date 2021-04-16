/**
 * ClearlyFast - making images load faster with ClearlyJs
 * @author Negev Volokita (negevvo)
 * @version 1
 */
class clrlyFast{
    static get _clearlyFast(){
        return this.__clearlyFast;
    }
    static set _clearlyFast(clearlyFast){
        this.__clearlyFast = clearlyFast;
    }

    /**
     * Initialize the tool
     */
    static init(){
        this._clearlyFast = clrly.new("clearlyFastElement")
        clrly.style(`
            clearlyFastElement{
                display: none;
            }
        `);
    }
    /**
     * The clearlyFastElement where all the images are loaded
     */
    static get element(){
        return this._clearlyFast;
    }
    /**
     * Loads a new image
     * @param {*} src src of the image
     * @returns src of the image
     */
    static image(src){
        var img = clrly.new("img", {parent: this.element, src: src});
        return img.src;
    }
}

clrlyFast.init();