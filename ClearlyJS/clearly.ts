/**
 * ClearlyJS
 * @author Negev Volokita (negevvo)
 * @version 1.0-preview
 */

// Constant names for features in ClearlyJS
const CONSTS = {
    ELEMENTS: {
        COMPONENT_ELEMENT_NAME: "clrly",
        CLEAR_ELEMENT_NAME: "clear",
    },
    ELEMENT_ATTRIBUTES: {
        RENDER: "render",
    },
    INITIALIZE_NAMES: {
        TITLE: "title",
        OG_TITLE: "ogTitle",
        DESCRIPTION: "description",
        OG_DESCRIPTION: "ogDescription",
        ICON: "icon",
        OG_IMAGE: "ogImage",
        THEME_COLOR: "theme",
        DIR: "dir",
        MOBILE_FRIENDLY: "mobile",
    },
};

export default class clrly {
    // **************************** HTML ELEMENTS AND COMPONENTS ****************************

    /**
     * ClearlyJS components are reuseable DIY elements.
     * to make one - inherit from the "clrly.component" class.
     */
    static component = class {
        state = {};
        constructor(props, makeState = true) {
            if (this.constructor === clrly.component) {
                throw new Error(
                    "clrly.component is not an initializeable object, make your own component"
                );
            }

            if (makeState) {
                this.state = props;
                this.makeState();
            }
        }
        start() {}
        element() {
            throw new Error("the element function must be provided");
        }
        style() {
            return "";
        }
        /**
         * Re-render the component's content, after change.
         * May be enabled automatically with the "makeState" method
         * @param {boolean} callStart (optional) whether or not to call the "start" function while updating, default is true.
         */
        update(callStart = true) {
            const el = this.element();
            el.style = this.style();
            this.HTML.parentNode.replaceChild(el, this.HTML);
            this.HTML = el;
            if (callStart) this.start();
        }
        /**
         * Register a state object to the component.
         * A state object is an object containing the current properties of the component.
         * The state object listens to changes, and updates the component on change.
         * @param {string} stateObjName name of the state object to register - existing or new.
         * @param {boolean} callStart (optional) whether or not to call the "start" function while updating the component.
         * @param {function} callback (optional) a callback function for a state update; gets the key and value of the changed state field.
         */
        makeState(stateObjName = "state", callStart, callback) {
            const context = this;
            if (!context[stateObjName]) context[stateObjName] = {};
            return (context[stateObjName] = new Proxy(context[stateObjName], {
                set: function (object, key, value) {
                    if (object[key] !== value) {
                        object[key] = value;
                        context.update(callStart);
                        if (callback) callback(key, value);
                    }
                    return true;
                },
            }));
        }
        /**
         * Remove the update listener from the state object.
         * @param {string} stateObjName name of the state object.
         */
        destroyState(stateObjName = "state") {
            this[stateObjName] = { ...this[stateObjName] };
        }
    };

    /**
     * Makes a new ClearlyHTML element with a type, attributes and children.
     * @param {string} type Type of the element.
     * @param {{}} attributes (optional) list of the element's attributes: {id: "hello", class: "someElement", parent: document.body, innerHTML: "Hello World"} etc.
     * @param {HTMLElement} children (optional) children of the element.
     * @returns an HTML element.
     */
    static new(type = "div", attributes, ...children) {
        attributes = attributes || {};
        if (
            (type == CONSTS.ELEMENTS.COMPONENT_ELEMENT_NAME ||
                typeof type != typeof "") &&
            type !== null
        ) {
            if (typeof type != typeof "") attributes.from = type;
            return this.#newElementFromComponent(attributes, children);
        } else if (
            type == CONSTS.ELEMENTS.CLEAR_ELEMENT_NAME ||
            type === null
        ) {
            this.render(children);
            this.editAttributes(children, attributes);
            return children;
        }
        const newElement = this.#newElement(
            type,
            attributes[CONSTS.ELEMENT_ATTRIBUTES.RENDER] !== false &&
                attributes[CONSTS.ELEMENT_ATTRIBUTES.RENDER] !== "false"
        );
        this.editAttributes(newElement, attributes);
        this.#appendChildrenToElement(newElement, children);
        /**
         * Edits the element's attributes.
         * @param {{}} attributes attributes to change.
         * @returns the element.
         */
        newElement.editAttributes = function (attributes) {
            return clrly.editAttributes(newElement, attributes);
        };
        newElement.isClearlyHTML = true;
        return newElement;
    }

    static #appendChildrenToElement(element, children) {
        if (children) {
            for (let child of children) {
                if (Array.isArray(child)) {
                    this.#appendChildrenToElement(element, child);
                } else {
                    try {
                        if (child.isClearlyComponent) {
                            child = child.HTML;
                        }
                        element.appendChild(
                            child.nodeType == null
                                ? document.createTextNode(child.toString())
                                : child
                        );
                    } catch (e) {}
                }
            }
        }
    }

    /**
     * Shows or removes an element from the screen.
     * @param {HTMLElement} toRender an element to render or remove.
     * @param {Boolean} render (optional) render or remove from page?
     * @param {HTMLElement} parent (optional) parent to render to.
     */
    static render(toRender, render = true, parent = document.body) {
        if (Array.isArray(toRender)) {
            for (const element of toRender)
                this.render(element, render, parent);
            return;
        }
        const el = toRender.isClearlyComponent ? toRender.HTML : toRender;
        if (render) parent.appendChild(el);
        else el.remove();
    }

    static #newElement(type, render = true) {
        const newElement = document.createElement(type);
        if (render) this.render(newElement, render);
        return newElement;
    }

    static #newElementFromComponent(attributes, children) {
        let objectClass = attributes.from;
        if (!objectClass || typeof objectClass !== "function") {
            throw new Error("Cannot find the component");
        }

        attributes.children = children;

        if (!/^\s*class\s+/.test(objectClass.toString())) {
            const elementFunc = objectClass;
            const localContext = {};
            objectClass = class extends clrly.component {
                element() {
                    return elementFunc(this.state, this, localContext);
                }
            };
        }

        let obj = new objectClass(attributes);
        const el = obj.element();

        const style = obj.style();
        if (style) el.style = style;

        obj.HTML = el;
        obj.isClearlyComponent = true;
        if (obj.start) obj.start(attributes);
        return obj;
    }

    /**
     * Edits the given element's attributes (or all elements in a certain array).
     * @param {HTMLElement | Array<HTMLElement>} element HTML element or an array of elements.
     * @param {{}} attributes attributes to change.
     * @returns the element (or the array).
     */
    static editAttributes(element, attributes) {
        if (Array.isArray(element)) {
            for (const el of element) {
                this.editAttributes(el, attributes);
            }
            return element;
        }
        if (attributes) {
            const isComponent = element.isClearlyComponent;
            for (const attribute in attributes) {
                if (attribute != "parent" && attribute != "innerHTML") {
                    const type = typeof attributes[attribute];
                    if (
                        type === "function" ||
                        type === "object" ||
                        isComponent
                    ) {
                        element[attribute] = attributes[attribute];
                    } else {
                        element.setAttribute(attribute, attributes[attribute]);
                    }
                }
                if (attributes["parent"]) {
                    const parent = attributes["parent"];
                    parent.appendChild(element);
                }
                if (attributes["innerHTML"]) {
                    element.innerHTML = attributes["innerHTML"];
                }
            }
        }
        return element;
    }

    /**
     * adds HTML code into document.
     * @param {string} HTML HTML code to be added.
     * @param {HTMLElement} parent (optional) parent element for the code to be inserted in.
     * @returns the HTML code.
     */
    static add(HTML, parent = document.documentElement) {
        try {
            parent.innerHTML += HTML;
            return HTML;
        } catch (e) {}
    }

    /**
     * Get element by id.
     * @param {string} id id of the element.
     * @returns	DOM element with the specified id, or undefined.
     * @see xid
     */
    static id(id) {
        return this.xid(document, id);
    }

    /**
     * Get elements by class name.
     * @param {string} className class name of the elements.
     * @returns all elements with the specified class name, or an empty array.
     * @see xclass
     */
    static class(className) {
        return this.xclass(document, className);
    }

    /**
     * Get elements by tag name.
     * @param {string} tagName tag name of the elements.
     * @returns all elements with the specified tag name, or an empty array.
     * @see xtag
     */
    static tag(tagName) {
        return this.xtag(document, tagName);
    }

    /**
     * Get elements by Query selector.
     * @param {string} selector Query selector.
     * @returns all elements with the specified Query selector, or an empty array.
     * @see x$
     */
    static $(selector) {
        return this.x$(document, selector);
    }

    /**
     * Get elements by attribute.
     * @param {string} attribute attribute name of the elements.
     * @param {string} value value of the attribute.
     * @returns all elements with the specified attribute and attribute value, or an empty array.
     * @see xattribute
     */
    static attribute(attribute, value) {
        return this.xattribute(document, attribute, value);
    }

    /**
     * Import style / script.
     * @param {string | Array<string>} toImport resources to import (as an array of strings or a single string).
     * @param {{}} attributes {defer: true, type: "module"} etc...
     * @param {function} callback a function to be called after all resources loaded.
     * @returns An array with all imported resources
     */
    static import(toImport, attributes, callback) {
        if (!Array.isArray(toImport)) toImport = [toImport];
        this.#importRec(toImport, attributes, callback, 0);
        return toImport;
    }

    static #importRec(toImport, attributes, callback, i) {
        const link = toImport[i];
        let element;
        if (link.includes(".css")) {
            element = clrly.new("link", {
                parent: document.head,
                href: link,
                rel: "stylesheet",
            });
        } else {
            element = clrly.new("script", { parent: document.head, src: link });
        }
        for (const attribute in attributes) {
            element.setAttribute(attribute, attributes[attribute]);
        }
        element.onload = load;

        function load() {
            if (i === toImport.length - 1) {
                if (callback) {
                    callback();
                }
            } else {
                clrly.#importRec(toImport, attribute, callback, i + 1);
            }
        }
    }

    /**
     * Set the document's title.
     * @param {string} title the new title.
     * @returns the page's title
     */
    static title(title) {
        return (document.title = title);
    }

    /**
     * Set the OG (Open Graph) title - for social media.
     * @param {string} title the new title.
     * @returns the page's OG title.
     */
    static ogTitle(title) {
        Array.from(clrly.attribute("property", "og:title")).forEach(function (
            element
        ) {
            element.remove();
        });
        clrly.new("meta", {
            parent: document.head,
            property: "og:title",
            content: title,
        });
        return clrly.attribute("property", "og:title")[0].href;
    }

    /**
     * Set the document's description.
     * @param {string} description the new description.
     * @returns the page's description.
     */
    static description(description) {
        Array.from(clrly.attribute("name", "description")).forEach(function (
            element
        ) {
            element.remove();
        });
        clrly.new("meta", {
            parent: document.head,
            name: "description",
            content: description,
        });
        return clrly.attribute("name", "description")[0].href;
    }

    /**
     * Set the OG (Open Graph) description - for social media.
     * @param {string} description the new description.
     * @returns the page's OG description.
     */
    static ogDescription(description) {
        Array.from(clrly.attribute("property", "og:description")).forEach(
            function (element) {
                element.remove();
            }
        );
        clrly.new("meta", {
            parent: document.head,
            property: "og:description",
            content: description,
        });
        return clrly.attribute("property", "og:description")[0].href;
    }

    /**
     * Set the document's icon.
     * @param {string} src URL of the new icon.
     * @returns the page's icon src.
     */
    static icon(src) {
        Array.from(clrly.attribute("rel", "icon")).forEach(function (element) {
            element.remove();
        });
        clrly.new("link", { parent: document.head, rel: "icon", href: src });
        return clrly.attribute("rel", "icon")[0].href;
    }

    /**
     * Set the OG (Open Graph) image (cover image) - for social media.
     * @param {string} src URL of the new OG image.
     * @returns the page's OG image src.
     */
    static ogImage(src) {
        Array.from(clrly.attribute("property", "og:image")).forEach(function (
            element
        ) {
            element.remove();
        });
        clrly.new("meta", {
            parent: document.head,
            property: "og:image",
            content: src,
        });
        return clrly.attribute("property", "og:image")[0].href;
    }

    /**
     * Set the document's theme color.
     * @param {string} color theme color (in hex).
     * @returns the page's theme color.
     */
    static theme(color) {
        Array.from(clrly.attribute("name", "theme-color"))
            .concat(
                Array.from(
                    clrly.attribute(
                        "name",
                        "apple-mobile-web-app-status-bar-style"
                    )
                )
            )
            .forEach(function (element) {
                element.remove();
            });
        clrly.new("meta", {
            parent: document.head,
            name: "theme-color",
            content: color,
        });
        clrly.new("meta", {
            parent: document.head,
            name: "apple-mobile-web-app-status-bar-style",
            content: color,
        });
        return clrly.attribute("name", "theme-color")[0].content;
    }

    /**
     * Change the dir attribute of the body element.
     * @param {*} dir direction: RTL or LTR.
     */
    static dir(dir) {
        document.body.dir = dir;
    }

    /**
     * Make the app more usable to mobile devices.
     * @param {boolean | string} value true (default) - only mobile friendly, "app" - app mode (not user scalable).
     * @returns the viewport HTML element.
     */
    static mobileFriendly(value = true) {
        const scalable = value == "app" ? ", user-scalable=no" : "";
        return clrly.new("meta", {
            parent: document.head,
            name: "viewport",
            content: `width=device-width, initial-scale=1.0${scalable}`,
        });
    }

    /**
     * Initialize the app - set a title, icon, theme color, direction and mobile friendliness.
     * @param {{ title?: string; ogTitle?: string; description?: string; ogDescription?: string; icon?: string; ogImage?: string; theme?: string; dir?: string; mobile?: boolean; }} options {title: "title of the app", description: "welcome to my app", icon: "icon.png", ogImage: "og.png", theme: "#99ff99", dir: "RTL", mobile: true}.
     * @returns an array of results from the requested options.
     */
    static initialize(options) {
        const result = [];
        const OPTIONS = [
            [CONSTS.INITIALIZE_NAMES.TITLE, this.title],
            [CONSTS.INITIALIZE_NAMES.OG_TITLE, this.ogTitle],
            [CONSTS.INITIALIZE_NAMES.DESCRIPTION, this.description],
            [CONSTS.INITIALIZE_NAMES.OG_DESCRIPTION, this.ogDescription],
            [CONSTS.INITIALIZE_NAMES.ICON, this.icon],
            [CONSTS.INITIALIZE_NAMES.OG_IMAGE, this.ogImage],
            [CONSTS.INITIALIZE_NAMES.THEME_COLOR, this.theme],
            [CONSTS.INITIALIZE_NAMES.DIR, this.dir],
            [CONSTS.INITIALIZE_NAMES.MOBILE_FRIENDLY, this.mobileFriendly],
        ];
        for (const option of OPTIONS) {
            if (options[option[0]]) result.push(option[1](options[option[0]]));
        }
        return result;
    }

    // **************************** STYLES AND COLORS ****************************

    /**
     * Add a CSS style.
     * @param {string} style style to be added.
     * @returns the style element created.
     */
    static style(style) {
        return clrly.new("style", { parent: document.head, innerHTML: style });
    }

    /**
     * Converts HEX colors to RGB.
     * @param {string | { h: number; s: number; l: number; }} color HEX or HSL color to convert.
     * @returns an object contains the r (red), g (green) and b (blue) values of the color.
     */
    static toRGB(color) {
        if (typeof color == "string") {
            const hex =
                color.length == 3 ? color.replace(/(.)/g, "$1$1") : color;
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
                hex
            );
            return result
                ? {
                      r: parseInt(result[1], 16),
                      g: parseInt(result[2], 16),
                      b: parseInt(result[3], 16),
                  }
                : { r: 0, g: 0, b: 0 };
        } else if (
            typeof color == "object" &&
            color.h !== undefined &&
            color.s !== undefined &&
            color.l !== undefined
        ) {
            const h = color.h;
            const s = color.s / 100;
            const l = color.l / 100;

            const c = s * Math.min(l, 1 - l);

            const t = (n) => (n + h / 30) % 12;
            const intermediate = (x) =>
                l - c * Math.max(-1, Math.min(t(x) - 3, Math.min(9 - t(x), 1)));

            return {
                r: Math.round(255 * intermediate(0)),
                g: Math.round(255 * intermediate(8)),
                b: Math.round(255 * intermediate(4)),
            };
        } else if (
            typeof color == "object" &&
            color.r !== undefined &&
            color.g !== undefined &&
            color.b !== undefined
        ) {
            return color;
        }
        return { r: 0, g: 0, b: 0 };
    }

    /**
     * Converts RGB or HSL colors to HEX.
     * @param {{ r: number; g: number; b: number; } | { h: number; s: number; l: number; }} color RGB or HSL color to convert, as an object (for example: {r: 204, g: 153, b: 255}).
     * @returns the color as a HEX string.
     */
    static toHEX(color) {
        if (typeof color == "string") return color;

        if (
            typeof color == "object" &&
            color.h !== undefined &&
            color.s !== undefined &&
            color.l !== undefined
        )
            color = this.toRGB(color);

        const convert = (value) => {
            value = value.toString(16);
            return value.length == 1 ? "0" + value : value;
        };
        return "#" + convert(color.r) + convert(color.g) + convert(color.b);
    }

    /**
     * Converts RGB and HEX colors to HSL.
     * @param {string | { r: number; g: number; b: number; }} color color to convert; HEX string or RGB object (for example: {r: 204, g: 153, b: 255}).
     * @returns the color as an HSL object.
     */
    static toHSL(color) {
        if (
            typeof color == "object" &&
            color.h !== undefined &&
            color.s !== undefined &&
            color.l !== undefined
        )
            return color;

        if (typeof color == "string") color = this.toRGB(color);

        const r = color.r / 255;
        const g = color.g / 255;
        const b = color.b / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);

        const d = max - min;

        let h =
            d == 0
                ? 0
                : max == r
                ? ((g - b) / d) % 6
                : max == g
                ? (b - r) / d + 2
                : (r - g) / d + 4;

        h = Math.round(h * 60);
        if (h < 0) h += 360;

        let l = (max + min) / 2;
        let s = d == 0 ? 0 : d / (1 - Math.abs(2 * l - 1));

        s = +(s * 100).toFixed(1);
        l = +(l * 100).toFixed(1);

        return {
            h: h,
            s: s,
            l: l,
        };
    }

    /**
     * Changes the brightness of a HEX or RGB color.
     * @param {string | { r: number; g: number; b: number; }} color HEX color or RGB color object (for example {r: 10, g: 100, b: 255}) to change the brightness of.
     * @param {number} level a number between 0 (darkest) to 100 (brightest).
     * @returns the new color, as the input type.
     */
    static colorBrightness(color, level) {
        const returnFunc =
            typeof color == "object"
                ? color.r !== undefined &&
                  color.g !== undefined &&
                  color.b !== undefined
                    ? (x) => this.toRGB(x)
                    : (x) => x
                : (x) => this.toHEX(x);

        const hsl = this.toHSL(color);

        hsl.l = level;
        return returnFunc(hsl);
    }

    // **************************** URLS ****************************

    /**
     * The current URL.
     */
    static get url() {
        return window.location.href;
    }

    /**
     * The current URL, but without the search and hash elements.
     */
    static get pageUrl() {
        return this.url
            .replace(window.location.search, "")
            .replace(window.location.hash, "");
    }

    /**
     * URL hash (#)
     */
    static get hash() {
        return decodeURI(window.location.hash.substring(1));
    }

    /**
     * URL search (?) (AKA QueryString)
     * to get a value, use: clrly.search.get('parameter')
     */
    static get search() {
        return new URL(window.location.href).searchParams;
    }

    /**
     * Reloads the page.
     */
    static reload() {
        window.location.reload();
    }

    /**
     * Redirects to another URL.
     * @param {string} URL URL to be redirected to.
     */
    static redirectTo(URL) {
        window.location.replace(URL);
    }

    /**
     * Go to another url.
     * @param {string} URL URL to go to.
     * @param {boolean} newWindow (optional) open in a new window, default is false.
     */
    static go(URL, newWindow = false) {
        if (newWindow) {
            window.open(URL);
        } else {
            window.location.href = URL;
        }
    }

    /**
     * Opens a new window with the same URL.
     */
    static duplicateWindow() {
        this.go(this.url, true);
    }

    // **************************** AJAX AND WEB REQUESTS ****************************

    /**
     * Starts a new AJAX request.
     * @param {string} url URL to send the request to.
     * @param {{}} params configuration of the request: {method: "GET", mode: "cors"}.
     * @param {function} callback a callback function that gets the response text.
     */
    static ajax(url, params, callback) {
        fetch(url, params)
            .then((response) => response.text())
            .then((response) => callback(response))
            .catch((e) => callback(null));
    }

    /**
     * Starts a new AJAX request for a JSON file.
     * @param {string} url JSON file URL.
     * @param {{}} params configuration of the request: {method: "GET", mode: "cors"}.
     * @param {function} callback a callback function that gets the formatted JSON.
     */
    static jsonAjax(url, params, callback) {
        fetch(url, params)
            .then((response) => response.json())
            .then((response) => callback(response))
            .catch((e) => callback(null));
    }

    /**
     * Starts a new AJAX request for a file.
     * @param {string} url file URL.
     * @param {{}} params configuration of the request: {method: "GET", mode: "cors"}.
     * @param {function} callback a callback function that gets the blob object that represents the file.
     */
    static blobAjax(url, params, callback) {
        fetch(url, params)
            .then((response) => response.blob())
            .then((response) => callback(response))
            .catch((e) => callback(null));
    }

    // **************************** XML ELEMENTS ****************************

    /**
     * Get XML element by id.
     * @param {Element} xml parent XML element.
     * @param {string} id id of the XML element.
     * @returns XML element with the specified id, or undefined.
     */
    static xid(xml, id) {
        return xml.getElementById(id) || undefined;
    }

    /**
     * Get XML elements by class name.
     * @param {Element} xml parent XML element.
     * @param {string} className class name of the XML elements.
     * @returns all elements with the specified class name, or an empty array.
     */
    static xclass(xml, className) {
        return xml.getElementsByClassName(className) || [];
    }

    /**
     * Get XML elements by tag name.
     * @param {Element} xml parent XML element.
     * @param {string} tagName tag name of the XML elements.
     * @returns all XML elements with the specified tag name, or an empty array.
     */
    static xtag(xml, tagName) {
        return xml.getElementsByTagName(tagName) || [];
    }

    /**
     * Get XML elements by Query selector.
     * @param {Element} xml parent XML element.
     * @param {string} selector Query selector.
     * @returns all elements with the specified Query selector, or an empty array.
     */
    static x$(xml, selector) {
        try {
            return xml.querySelectorAll(selector) || [];
        } catch (e) {
            return [];
        }
    }

    /**
     * Get XML elements by attribute
     * @param {Element} xml parent XML element.
     * @param {string} attribute attribute name of the XML elements.
     * @param {string} value value of the attribute.
     * @returns all XML elements with the specified attribute and attribute value, or an empty array.
     */
    static xattribute(xml, attribute, value) {
        return this.x$(xml, `[${attribute}="${value}"]`);
    }

    /**
     * Get the value of an XML element.
     * @param {Element} element XML element.
     * @returns the value inside the XML element.
     */
    static xvalue(element) {
        return element.firstChild.nodeValue;
    }

    // **************************** MATH ****************************

    /**
     * Get a random float between two values (min < x < max when x is the random number).
     * @param {number} min the minimal number.
     * @param {number} max the maximal number.
     * @returns a random float between the two values.
     */
    static random(min, max) {
        return Math.random() * (max - min) + min;
    }

    /**
     * Get a random integer between two values (min ≤ x ≤ max when x is the random number).
     * @param {number} min the minimal number.
     * @param {number} max the maximal number.
     * @returns a random number between the two values.
     */
    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // **************************** FILES AND BLOBS ****************************

    /**
     * Generates a link to the content as a blob.
     * @param {*} content content to store as blob.
     * @param {string} type MIME type (default: "text/html;charset=utf-8").
     * @param {boolean} bom whether or not to add a BOM signature to the file; default is false.
     * @returns URL of the blob.
     */
    static toFile(content, type = "text/html", bom = false) {
        const contentArr = [];
        if (bom) contentArr.push(new Uint8Array([0xef, 0xbb, 0xbf]));
        contentArr.push(content);
        return URL.createObjectURL(new Blob(contentArr, { type: type }));
    }

    /**
     * Downloads a file from a specified URL.
     * @param {string} URL file URL.
     * @param {string} fileName name of the downloaded file (For example: "MyFile.txt").
     */
    static download(URL, fileName) {
        const a = clrly.new("a", { href: URL, download: fileName });
        a.click();
        a.remove();
    }
}

// **************************** SWITCHER AND ROUTER ****************************

/**
 * The base class for a switchable component - for the ClearlyJS Switcher and Router.
 * Inherit from this class and override the constructor, "element", and "onSwitch" methods to make your own switchable pages and parts.
 */
class Switchable extends clrly.component {
    constructor(props) {
        super(props);
    }
    appendTo(parent, props = {}) {
        this.switcherParent = parent;
        this.sProps = props;
        this.start();
        this.update();
    }
    start() {
        this.HTML.editAttributes({
            parent: this.switcherParent,
        });
    }
    onSwitch() {}
    get isSwitchable() {
        return true;
    }
}

/**
 * The base class of the Switcher and Router features in ClearlyJS.
 * This is an internal class that cannot be used inside your code.
 */
class SwitcherRouterBase extends clrly.component {
    constructor(props) {
        super(props, true);
        this.clear();
    }
    element() {
        const PARENT = clrly.new("div");
        const current = this.state.current;
        if (this._switchables == {} || current == null) return PARENT;
        const rc = this._get(
            this instanceof Router ? current.route : current.name
        );
        if (rc && rc.isSwitchable) {
            if (this instanceof Router && !current.browserNavigation)
                window.history.pushState({}, "", current.route);
            rc.appendTo(PARENT, current.props);
            rc.onSwitch();
        }
        return PARENT;
    }
    /**
     * Add a new Switchable to the Switchables collection.
     * @param {string} identifier a unique name for the switchable, or a unique URL path for the Router.
     * @param {Switchable} switchable Switchable to add.
     * @returns the identifier.
     */
    add(identifier, switchable) {
        this._switchables[identifier] = switchable;
        switchable.HTML.remove();
        return identifier;
    }
    /**
     * Set the current switchable to the one with the specified identifier (name or route).
     * You can also pass parameters to the switchable to show with "props".
     * @param {{ name: string; props?: {}; } | { route: string; props?: {}; }} current an object containing the name or path (route) of the switchable, and the parameters (props) to pass.
     */
    set current(current) {
        this.state.current = current;
    }
    clear() {
        this._switchables = {};
    }
}

/**
 * The clearlyJS Switcher - a container of multiple Switchable components that shows one switchable at a time.
 * The Switcher links each Switchable to an identifier.
 */
class Switcher extends SwitcherRouterBase {
    constructor(props) {
        super(props);
    }
    _get(name) {
        return this._switchables[name];
    }
    get currentName() {
        return this.state.current.name;
    }
}

/**
 * The clearlyJS Router - a  container of multiple Switchable components that shows one switchable at a time.
 * The Router links each Switchable to a URL path - to make the effect of moving between actual pages.
 * EXPERIMENTAL: MAY NOT WORK AS EXPECTED
 */
class Router extends SwitcherRouterBase {
    static get NOT_FOUND_PATH() {
        return "/404";
    }
    constructor(props) {
        super(props);
        const context = this;
        window.onpopstate = async () => await context._navigate(true);
    }
    _get(route) {
        route = route.match(/^\/?([^?#]+?)\/?(?=\?|#|$)/)[1];
        for (const expectedRoute in this._switchables) {
            if (expectedRoute.match(`^\/?${route}\/?$`)) {
                return this._switchables[expectedRoute];
            }
        }
        return this._switchables[Router.NOT_FOUND_PATH];
    }
    get currentRoute() {
        return this.state.current.route;
    }
    clear() {
        super.clear();
        this.add(Router.NOT_FOUND_PATH, this.state.notFound);
    }
    async _navigate(browserNavigation = true) {
        this.current = {
            route:
                window.location.pathname +
                window.location.search +
                window.location.hash,
            props: {},
            browserNavigation: browserNavigation,
        };
    }
    async initialize() {
        await this._navigate(true);
    }
}

/**
 * A pre-made Switchable div element - to use in Switcher and Router.
 * Currently, Sdiv doesn't support properties.
 */
class Sdiv extends Switchable {
    element() {
        return clrly.new("div", {}, ...this.state.children);
    }
    onSwitch() {
        if (this.state.onSwitch) this.state.onSwitch();
    }
}

export { clrly, Switchable, Switcher, Router, Sdiv };
