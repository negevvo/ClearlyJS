/**
 * ClearlyJS (Now in TS)
 * @author Negev Volokita (negevvo)
 * @version 1.0-preview
 */

type TagNames = HTMLElementTagNameMap & { "": HTMLElement };

interface ClearlyHTMLElementBase<T extends keyof TagNames> {
    styles?: Partial<CSSStyleDeclaration> | string;
    readonly isClearlyHTML: boolean;
    readonly isClearlyComponent?: boolean;
    render?: boolean | string;
    parent?: HTMLElement | ClearlyHTMLElement | ClearlyComponent;
    readonly editAttributes: (
        attributes: Partial<ClearlyHTMLElementBase<T>>
    ) => void;
}

export type ClearlyHTMLElement<T extends keyof TagNames = ""> =
    ClearlyHTMLElementBase<T> &
        Omit<(HTMLElementTagNameMap & { "": HTMLElement })[T], "style">;

export type ClearlyComponentProps<T = {}> = T & {
    [key: string | number | symbol]: any;
    children?: ClearlyNode[];
};

export type ClearlyInitializeOptions = {
    title?: string;
    ogTitle?: string;
    description?: string;
    ogDescription?: string;
    icon?: string;
    ogImage?: string;
    theme?: string;
    dir?: "rtl" | "ltr";
    mobile?: boolean | "app";
};

/**
 * ClearlyJS components are reuseable DIY elements.
 * to make one - inherit from the "clrly.component" class.
 */
export class ClearlyComponent<T = {}> {
    readonly state: ClearlyComponentProps<T> = {} as any;
    readonly HTML: ClearlyHTMLElement | HTMLElement = undefined as any;
    readonly isClearlyComponent: boolean = true;

    constructor(props: ClearlyComponentProps<T>, makeState: boolean = true) {
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
    start(): void {}
    element(): HTMLElement | ClearlyHTMLElement {
        throw new Error("the element function must be provided");
    }
    style(): string {
        return "";
    }
    /**
     * Re-render the component's content, after change.
     * May be enabled automatically with the "makeState" method
     * @param callStart (optional) whether or not to call the "start" function while updating, default is true.
     */
    update(callStart: boolean = true): void {
        const el = this.element();
        (el as any).style = this.style();
        this.HTML?.parentNode?.replaceChild(el, this.HTML);
        (this as any).HTML = el;
        if (callStart) this.start();
    }
    /**
     * Register a state object to the component.
     * A state object is an object containing the current properties of the component.
     * The state object listens to changes, and updates the component on change.
     * @param stateObjName name of the state object to register - existing or new.
     * @param callStart (optional) whether or not to call the "start" function while updating the component.
     * @param callback (optional) a callback function for a state update; gets the key and value of the changed state field.
     */
    makeState(
        stateObjName: string = "state",
        callStart?: boolean,
        callback?: (key: string | symbol, value: string) => void
    ): ClearlyComponentProps<T> {
        const context: any = this;
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
     * @param stateObjName name of the state object.
     */
    destroyState(stateObjName = "state"): void {
        const context: any = this;
        context[stateObjName] = { ...context[stateObjName] };
    }
}

/**
 * ClearlyJS components are reuseable DIY elements.
 * to make one - inherit from the "clrly.component" class or use the ClearlyFC type.
 */
export type ClearlyFC<T = {}> = (
    state: ClearlyComponentProps<T>,
    context: ClearlyComponent<T>,
    localContext: { [key: string | number | symbol]: any }
) => ClearlyHTMLElement | HTMLElement;

export type ClearlyNode =
    | ClearlyHTMLElement
    | ClearlyComponent
    | (ClearlyHTMLElement | ClearlyComponent)[]
    | ClearlyNode[];

type ClearlyNewElementType = keyof HTMLElementTagNameMap | (string & {});

type ClearlyNewClearType = "clear" | null;

type ClearlyNewComponentType<T = {}> =
    | "component"
    | typeof ClearlyComponent<T>
    | ClearlyFC<T>;

type ClearlyNewType<T = {}> =
    | ClearlyNewElementType
    | ClearlyNewComponentType<T>
    | ClearlyNewClearType;

type ClearlySwitcherCurrent = { name: string; props?: any };
type ClearlyRouterCurrent = {
    route: string;
    props?: any;
    browserNavigation?: boolean;
};

export class clrly {
    // **************************** HTML ELEMENTS AND COMPONENTS ****************************

    static component = ClearlyComponent;

    /**
     * Makes a new ClearlyHTML element with a type, attributes and children.
     * @param type Type of the element.
     * @param props (optional) list of the element's attributes: {id: "hello", class: "someElement", parent: document.body, innerHTML: "Hello World"} etc.
     * @param children (optional) children of the element.
     * @returns an HTML element.
     */
    static new<T extends ClearlyNewType<any>>(
        type: T,
        props?: (T extends ClearlyNewComponentType<infer P> | ClearlyFC<infer P>
            ? Partial<P & { from?: typeof ClearlyComponent<P> | ClearlyFC<P> }>
            : T extends keyof HTMLElementTagNameMap
            ? Partial<ClearlyHTMLElement<T>>
            : Partial<ClearlyHTMLElement>) & {
            [key: string]: any;
        },
        ...children: ClearlyNode[]
    ): T extends ClearlyNewComponentType<infer P> | ClearlyFC<infer P>
        ? ClearlyComponent<P>
        : T extends ClearlyNewClearType
        ? ClearlyNode
        : T extends keyof HTMLElementTagNameMap
        ? ClearlyHTMLElement<T>
        : ClearlyHTMLElement {
        const elementProps: any = props || {};
        if (
            (type === "component" || typeof type != typeof "") &&
            type !== null
        ) {
            return this.#newElementFromComponent(
                type === "component"
                    ? elementProps.from
                    : (type as ClearlyNewComponentType),
                elementProps,
                children
            ) as any;
        } else if (type == "clear" || type === null) {
            this.render(children);
            this.editAttributes(children, elementProps);
            return children as any;
        }
        const newElement = this.#newElement(
            type as string,
            elementProps.render !== false && elementProps.render !== "false"
        ) as ClearlyHTMLElement | HTMLElement;
        this.editAttributes(newElement, elementProps);
        this.#appendChildrenToElement(newElement, children);
        /**
         * Edits the element's attributes.
         * @param {{}} attributes attributes to change.
         * @returns the element.
         */
        (newElement as any).editAttributes = (
            attributes: Partial<ClearlyHTMLElement>
        ) => {
            clrly.editAttributes(newElement, attributes);
        };
        (newElement as any).isClearlyHTML = true;
        return newElement as any;
    }

    static #appendChildrenToElement(
        element: HTMLElement | ClearlyHTMLElement,
        children?: (ClearlyNode | undefined)[]
    ) {
        if (children) {
            for (let child of children) {
                if (Array.isArray(child)) {
                    this.#appendChildrenToElement(element, child);
                } else {
                    try {
                        if ((child as ClearlyComponent).isClearlyComponent) {
                            child = (child as ClearlyComponent).HTML as any;
                        }
                        element.appendChild(
                            (child as Node).nodeType == null
                                ? document.createTextNode(
                                      (child as Node).toString()
                                  )
                                : (child as Node)
                        );
                    } catch (e) {}
                }
            }
        }
    }

    /**
     * Shows or removes an element from the screen.
     * @param toRender an element to render or remove.
     * @param render (optional) render or remove from page?
     * @param parent (optional) parent to render to.
     */
    static render(
        toRender: ClearlyNode | HTMLElement,
        render: boolean = true,
        parent: HTMLElement | ClearlyHTMLElement = document.body
    ) {
        if (Array.isArray(toRender)) {
            for (const element of toRender)
                this.render(element, render, parent);
            return;
        }
        const el: HTMLElement = (toRender as ClearlyComponent)
            .isClearlyComponent
            ? ((toRender as ClearlyComponent).HTML as HTMLElement)
            : (toRender as HTMLElement);
        if (render) parent.appendChild(el);
        else el.remove();
    }

    static #newElement(type: string, render = true) {
        const newElement = document.createElement(type);
        if (render) this.render(newElement, render);
        return newElement;
    }

    static #newElementFromComponent(
        from: ClearlyNewComponentType,
        props: ClearlyComponentProps,
        children: ClearlyNode[]
    ) {
        let objectClass = from;
        if (!objectClass || typeof objectClass !== "function") {
            throw new Error("Cannot find the component");
        }

        props.children = children;

        if (!/^\s*class\s+/.test(objectClass.toString())) {
            const elementFunc = objectClass;
            const localContext = {};
            objectClass = class extends ClearlyComponent {
                element(): HTMLElement | ClearlyHTMLElement {
                    return (elementFunc as ClearlyFC)(
                        this.state,
                        this,
                        localContext
                    );
                }
            };
        }

        let obj = new (objectClass as typeof ClearlyComponent)(props);
        const el = obj.element();

        const style = obj.style();
        if (style) (el as any).style = style;

        (obj as any).HTML = el;
        (obj as any).isClearlyComponent = true;
        if (obj.start) obj.start();
        return obj;
    }

    /**
     * Edits the given element's attributes (or all elements in a certain array).
     * @param element HTML element or an array of elements.
     * @param attributes attributes to change.
     * @returns the element (or the array).
     */
    static editAttributes(
        element: ClearlyNode | HTMLElement | (ClearlyNode | HTMLElement)[],
        attributes: Partial<ClearlyHTMLElement | ClearlyComponentProps>
    ) {
        if (Array.isArray(element)) {
            for (const el of element) {
                this.editAttributes(el, attributes);
            }
            return element;
        }
        if (attributes) {
            const isComponent = (element as ClearlyComponent)
                .isClearlyComponent;
            for (const attribute in attributes) {
                if (attribute !== "parent" && attribute !== "innerHTML") {
                    const type = typeof (attributes as any)[attribute];
                    if (
                        type === "function" ||
                        type === "object" ||
                        isComponent
                    ) {
                        (element as any)[attribute] = (attributes as any)[
                            attribute
                        ];
                    } else {
                        (element as HTMLElement).setAttribute(
                            attribute,
                            (attributes as any)[attribute]
                        );
                    }
                }
                if (attributes["parent"]) {
                    const parent = attributes["parent"];
                    parent.appendChild(element);
                }
                if (attributes["innerHTML"]) {
                    (element as HTMLElement).innerHTML =
                        attributes["innerHTML"];
                }
            }
        }
        return element;
    }

    /**
     * adds HTML code into document.
     * @param HTML HTML code to be added.
     * @param parent (optional) parent element for the code to be inserted in.
     * @returns the HTML code.
     */
    static add(HTML: string, parent: HTMLElement = document.documentElement) {
        try {
            parent.innerHTML += HTML;
            return HTML;
        } catch (e) {}
    }

    /**
     * Get an element by Query selector.
     * @param selector Query selector.
     * @returns the first element that matches the selector, or null.
     */
    static $(selector: string) {
        return document.querySelector(selector);
    }

    /**
     * Get elements by Query selector.
     * @param selector Query selector.
     * @returns all elements with the specified Query selector, or an empty array.
     */
    static $$(selector: string) {
        return document.querySelectorAll(selector);
    }

    /**
     * Get elements by attribute.
     * @param attribute attribute name of the elements.
     * @param value value of the attribute.
     * @returns all elements with the specified attribute and attribute value, or an empty array.
     * @see xattribute
     */
    static byAttribute(attribute: string | keyof HTMLElement, value: any) {
        return this.$$(`[${attribute}="${value}"]`);
    }

    /**
     * Import style / script.
     * @param toImport resources to import (as an array of strings or a single string).
     * @param attributes {defer: true, type: "module"} etc...
     * @param callback a function to be called after all resources loaded.
     * @returns An array with all imported resources
     */
    static import(
        toImport: string | string[],
        attributes?: Partial<HTMLScriptElement & HTMLLinkElement>,
        callback?: () => void
    ) {
        if (!Array.isArray(toImport)) toImport = [toImport];
        this.#importRec(toImport, attributes, callback, 0);
        return toImport;
    }

    static #importRec(
        toImport: string | string[],
        attributes: Partial<HTMLScriptElement & HTMLLinkElement> | undefined,
        callback: (() => void) | undefined,
        i: number
    ) {
        const link = toImport[i];
        let element;
        if (link.includes(".css")) {
            element = clrly.new("link", {
                parent: document.head,
                href: link,
                rel: "stylesheet",
            });
        } else {
            element = clrly.new("script", {
                parent: document.head,
                src: link,
                ...attributes,
            });
        }
        element.onload = load;

        function load() {
            if (i === toImport.length - 1) {
                callback?.();
            } else {
                clrly.#importRec(toImport, attributes, callback, i + 1);
            }
        }
    }

    /**
     * Set the document's title.
     * @param title the new title.
     * @returns the page's title
     */
    static title(title: string) {
        return (document.title = title);
    }

    /**
     * Set the OG (Open Graph) title - for social media.
     * @param title the new title.
     */
    static ogTitle(title: string) {
        Array.from(clrly.byAttribute("property", "og:title")).forEach(
            (element) => {
                (element as HTMLElement).remove();
            }
        );
        clrly.new("meta", {
            parent: document.head,
            property: "og:title",
            content: title,
        });
    }

    /**
     * Set the document's description.
     * @param description the new description.
     */
    static description(description: string) {
        Array.from(clrly.byAttribute("name", "description")).forEach(
            (element) => {
                (element as HTMLElement).remove();
            }
        );
        clrly.new("meta", {
            parent: document.head,
            name: "description",
            content: description,
        });
    }

    /**
     * Set the OG (Open Graph) description - for social media.
     * @param description the new description.
     */
    static ogDescription(description: string) {
        Array.from(clrly.byAttribute("property", "og:description")).forEach(
            (element) => {
                (element as HTMLElement).remove();
            }
        );
        clrly.new("meta", {
            parent: document.head,
            property: "og:description",
            content: description,
        });
    }

    /**
     * Set the document's icon.
     * @param src URL of the new icon.
     */
    static icon(src: string) {
        Array.from(clrly.byAttribute("rel", "icon")).forEach((element) => {
            (element as HTMLElement).remove();
        });
        clrly.new("link", { parent: document.head, rel: "icon", href: src });
    }

    /**
     * Set the OG (Open Graph) image (cover image) - for social media.
     * @param src URL of the new OG image.
     */
    static ogImage(src: string) {
        Array.from(clrly.byAttribute("property", "og:image")).forEach(
            (element) => {
                (element as HTMLElement).remove();
            }
        );
        clrly.new("meta", {
            parent: document.head,
            property: "og:image",
            content: src,
        });
    }

    /**
     * Set the document's theme color.
     * @param color theme color (in hex).
     */
    static theme(color: string) {
        Array.from(clrly.byAttribute("name", "theme-color"))
            .concat(
                Array.from(
                    clrly.byAttribute(
                        "name",
                        "apple-mobile-web-app-status-bar-style"
                    )
                )
            )
            .forEach(function (element) {
                (element as HTMLElement).remove();
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
    }

    /**
     * Change the dir attribute of the body element.
     * @param dir direction: RTL or LTR.
     */
    static dir(dir: "rtl" | "ltr") {
        document.body.dir = dir;
    }

    /**
     * Make the app more usable to mobile devices.
     * @param value true (default) - only mobile friendly, "app" - app mode (not user scalable).
     * @returns the viewport HTML element.
     */
    static mobileFriendly(value: boolean | "app" = true) {
        const scalable = value === "app" ? ", user-scalable=no" : "";
        return clrly.new("meta", {
            parent: document.head,
            name: "viewport",
            content: `width=device-width, initial-scale=1.0${scalable}`,
        });
    }

    /**
     * Initialize the app - set a title, icon, theme color, direction and mobile friendliness.
     * @param options {title: "title of the app", description: "welcome to my app", icon: "icon.png", ogImage: "og.png", theme: "#99ff99", dir: "RTL", mobile: true}.
     * @returns an array of results from the requested options.
     */
    static initialize(options: ClearlyInitializeOptions) {
        const result: { [k in keyof ClearlyInitializeOptions]: any } = {};
        const OPTIONS: { [k in keyof ClearlyInitializeOptions]-?: Function } = {
            title: this.title,
            ogTitle: this.ogTitle,
            description: this.description,
            ogDescription: this.ogDescription,
            icon: this.icon,
            ogImage: this.ogImage,
            theme: this.theme,
            dir: this.dir,
            mobile: this.mobileFriendly,
        };
        for (const optionName in OPTIONS) {
            const option = (OPTIONS as any)[optionName];

            if ((options as any)[optionName])
                (result as any)[optionName] = option(
                    (options as any)[optionName]
                );
        }
        return result;
    }

    // **************************** STYLES AND COLORS ****************************

    /**
     * Add a CSS style.
     * @param {string} style style to be added.
     * @returns the style element created.
     */
    static style(style: string) {
        return clrly.new("style", { parent: document.head, innerHTML: style });
    }

    /**
     * Converts HEX colors to RGB.
     * @param color HEX or HSL color to convert.
     * @returns an object contains the r (red), g (green) and b (blue) values of the color.
     */
    static toRGB(color: string | { h: number; s: number; l: number }) {
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

            const t = (n: number) => (n + h / 30) % 12;
            const intermediate = (x: number) =>
                l - c * Math.max(-1, Math.min(t(x) - 3, Math.min(9 - t(x), 1)));

            return {
                r: Math.round(255 * intermediate(0)),
                g: Math.round(255 * intermediate(8)),
                b: Math.round(255 * intermediate(4)),
            };
        }

        return { r: 0, g: 0, b: 0 };
    }

    /**
     * Converts RGB or HSL colors to HEX.
     * @param color RGB or HSL color to convert, as an object (for example: {r: 204, g: 153, b: 255}).
     * @returns the color as a HEX string.
     */
    static toHEX(
        color:
            | { r: number; g: number; b: number }
            | { h: number; s: number; l: number }
    ) {
        let c = color as any;
        if (c.h !== undefined && c.s !== undefined && c.l !== undefined)
            c = this.toRGB(c);

        const convert = (value: number) => {
            const hexValue = value.toString(16);
            return hexValue.length == 1 ? "0" + hexValue : hexValue;
        };
        return "#" + convert(c.r) + convert(c.g) + convert(c.b);
    }

    /**
     * Converts RGB and HEX colors to HSL.
     * @param color color to convert; HEX string or RGB object (for example: {r: 204, g: 153, b: 255}).
     * @returns the color as an HSL object.
     */
    static toHSL(color: string | { r: number; g: number; b: number }) {
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
     * @param color HEX color or RGB color object (for example {r: 10, g: 100, b: 255}) to change the brightness of.
     * @param {number} level a number between 0 (darkest) to 100 (brightest).
     * @returns the new color, as the input type.
     */
    static colorBrightness(
        color: string | { r: number; g: number; b: number },
        level: number
    ) {
        const returnFunc =
            typeof color === "object"
                ? color.r !== undefined &&
                  color.g !== undefined &&
                  color.b !== undefined
                    ? (x: any) => this.toRGB(x)
                    : (x: any) => x
                : (x: any) => this.toHEX(x);

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
     * @param URL URL to be redirected to.
     */
    static redirectTo(URL: string) {
        window.location.replace(URL);
    }

    /**
     * Go to another url.
     * @param URL URL to go to.
     * @param newWindow (optional) open in a new window, default is false.
     */
    static go(URL: string, newWindow = false) {
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

    // **************************** WEB REQUESTS ****************************

    /**
     * Starts a new AJAX request.
     * @param url URL to send the request to.
     * @param params configuration of the request: {method: "GET", mode: "cors"}.
     * @param callback a callback function that gets the response text.
     */
    static request(
        url: string,
        params?: RequestInit,
        callback?: (response: string | null) => void
    ) {
        fetch(url, params)
            .then((response) => response.text())
            .then((response) => callback?.(response))
            .catch((e) => callback?.(null));
    }

    /**
     * Starts a new AJAX request for a JSON file.
     * @param {string} url JSON file URL.
     * @param {{}} params configuration of the request: {method: "GET", mode: "cors"}.
     * @param {function} callback a callback function that gets the formatted JSON.
     */
    static jsonRequest(
        url: string,
        params?: RequestInit,
        callback?: (response: any | null) => void
    ) {
        fetch(url, params)
            .then((response) => response.json())
            .then((response) => callback?.(response))
            .catch((e) => callback?.(null));
    }

    /**
     * Starts a new AJAX request for a file.
     * @param url file URL.
     * @param params configuration of the request: {method: "GET", mode: "cors"}.
     * @param callback a callback function that gets the blob object that represents the file.
     */
    static blobRequest(
        url: string,
        params?: RequestInit,
        callback?: (response: Blob | null) => void
    ) {
        fetch(url, params)
            .then((response) => response.blob())
            .then((response) => callback?.(response))
            .catch((e) => callback?.(null));
    }

    // **************************** MATH ****************************

    /**
     * Get a random float between two values (min < x < max when x is the random number).
     * @param min the minimal number.
     * @param max the maximal number.
     * @returns a random float between the two values.
     */
    static random(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }

    /**
     * Get a random integer between two values (min ≤ x ≤ max when x is the random number).
     * @param min the minimal number.
     * @param max the maximal number.
     * @returns a random number between the two values.
     */
    static randomInt(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // **************************** FILES AND BLOBS ****************************

    /**
     * Generates a link to the content as a blob.
     * @param content content to store as blob.
     * @param type MIME type (default: "text/html;charset=utf-8").
     * @param bom whether or not to add a BOM signature to the file; default is false.
     * @returns URL of the blob.
     */
    static toFile(
        content: any,
        type: string = "text/html",
        bom: boolean = false
    ) {
        const contentArr = [];
        if (bom) contentArr.push(new Uint8Array([0xef, 0xbb, 0xbf]));
        contentArr.push(content);
        return URL.createObjectURL(new Blob(contentArr, { type: type }));
    }

    /**
     * Downloads a file from a specified URL.
     * @param URL file URL.
     * @param fileName name of the downloaded file (For example: "MyFile.txt").
     */
    static download(URL: string, fileName: string) {
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
export class Switchable<T = {}> extends ClearlyComponent<T> {
    /**
     * Sprops is an object with additional properties that is passed on switch.
     */
    sProps: { [key: string | number | symbol]: any } = {};
    private switcherParent: HTMLElement | ClearlyHTMLElement | undefined =
        undefined;

    appendTo(parent: HTMLElement | ClearlyHTMLElement, props: any = {}) {
        this.switcherParent = parent;
        this.sProps = props;
        this.start();
        this.update();
    }
    start() {
        (this.HTML as ClearlyHTMLElement).editAttributes({
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
abstract class SwitcherRouterBase<
    T extends ClearlySwitcherCurrent | ClearlyRouterCurrent,
    P = {}
> extends ClearlyComponent<{ current: T } & P> {
    protected _switchables: { [key: string]: Switchable } = {};
    constructor(props: ClearlyComponentProps<any>) {
        super(props, true);
        this.clear();
    }
    element() {
        const PARENT = clrly.new("div");
        const current = this.state.current;
        if (current == null) return PARENT;
        const rc = this._get(
            this instanceof Router
                ? (current as ClearlyRouterCurrent).route
                : (current as ClearlySwitcherCurrent).name
        );
        if (rc && rc.isSwitchable) {
            if (
                this instanceof Router &&
                !(current as ClearlyRouterCurrent).browserNavigation
            )
                window.history.pushState(
                    {},
                    "",
                    (current as ClearlyRouterCurrent).route
                );
            rc.appendTo(PARENT, current.props);
            rc.onSwitch();
        }
        return PARENT;
    }
    /**
     * Add a new Switchable to the Switchables collection.
     * @param identifier a unique name for the switchable, or a unique URL path for the Router.
     * @param switchable Switchable to add.
     * @returns the identifier.
     */
    add(identifier: string, switchable: Switchable) {
        this._switchables[identifier] = switchable;
        switchable.HTML.remove();
        return identifier;
    }
    /**
     * Set the current switchable to the one with the specified identifier (name or route).
     * You can also pass parameters to the switchable to show with "props".
     * @param current an object containing the name or path (route) of the switchable, and the parameters (props) to pass.
     */
    set current(current: T) {
        this.state.current = current;
    }
    clear() {
        this._switchables = {};
    }
    abstract _get(name: string): Switchable;
}

/**
 * The clearlyJS Switcher - a container of multiple Switchable components that shows one switchable at a time.
 * The Switcher links each Switchable to an identifier.
 */
export class Switcher extends SwitcherRouterBase<ClearlySwitcherCurrent> {
    _get(name: string) {
        return this._switchables[name];
    }
    get currentName() {
        return this.state.current.name;
    }
}

/**
 * The clearlyJS Router - a  container of multiple Switchable components that shows one switchable at a time.
 * The Router links each Switchable to a URL path - to make the effect of moving between actual pages.
 */
export class Router extends SwitcherRouterBase<
    ClearlyRouterCurrent,
    { notFound: Switchable<any> }
> {
    static get NOT_FOUND_PATH() {
        return "/404";
    }
    constructor(props: ClearlyComponentProps<any>) {
        super(props);
        const context = this;
        window.onpopstate = async () => await context._navigate(true);
    }
    _get(route: string) {
        route = route.match(/^\/?([^?#]+?)\/?(?=\?|#|$)/)?.[1] as string;
        if (route) {
            for (const expectedRoute in this._switchables) {
                if (expectedRoute.match(`^\/?${route}\/?$`)) {
                    return this._switchables[expectedRoute];
                }
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
export class Sdiv extends Switchable<Partial<HTMLDivElement>> {
    element() {
        const { children, ...props } = this.state;
        return clrly.new("div", props, ...(children as any));
    }
    onSwitch() {
        this.state.onSwitch?.();
    }
}

export default clrly;
