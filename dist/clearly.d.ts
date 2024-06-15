/**
 * ClearlyJS (Now in TS)
 * @author Negev Volokita (negevvo)
 * @version 1.0-preview
 */
type TagNames = HTMLElementTagNameMap & {
    "": HTMLElement;
};
interface ClearlyHTMLElementBase<T extends keyof TagNames> {
    styles?: Partial<CSSStyleDeclaration> | string;
    readonly isClearlyHTML: boolean;
    readonly isClearlyComponent?: boolean;
    render?: boolean | string;
    parent?: HTMLElement | ClearlyHTMLElement | ClearlyComponent;
    readonly editAttributes: (attributes: Partial<ClearlyHTMLElementBase<T>>) => void;
}
export type ClearlyHTMLElement<T extends keyof TagNames = ""> = ClearlyHTMLElementBase<T> & Omit<(HTMLElementTagNameMap & {
    "": HTMLElement;
})[T], "style">;
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
export declare class ClearlyComponent<T = {}> {
    readonly state: ClearlyComponentProps<T>;
    readonly HTML: ClearlyHTMLElement | HTMLElement;
    readonly isClearlyComponent: boolean;
    constructor(props: ClearlyComponentProps<T>, makeState?: boolean);
    start(): void;
    element(): HTMLElement | ClearlyHTMLElement;
    style(): string;
    /**
     * Re-render the component's content, after change.
     * May be enabled automatically with the "makeState" method
     * @param callStart (optional) whether or not to call the "start" function while updating, default is true.
     */
    update(callStart?: boolean): void;
    /**
     * Register a state object to the component.
     * A state object is an object containing the current properties of the component.
     * The state object listens to changes, and updates the component on change.
     * @param stateObjName name of the state object to register - existing or new.
     * @param callStart (optional) whether or not to call the "start" function while updating the component.
     * @param callback (optional) a callback function for a state update; gets the key and value of the changed state field.
     */
    makeState(stateObjName?: string, callStart?: boolean, callback?: (key: string | symbol, value: string) => void): ClearlyComponentProps<T>;
    /**
     * Remove the update listener from the state object.
     * @param stateObjName name of the state object.
     */
    destroyState(stateObjName?: string): void;
}
/**
 * ClearlyJS components are reuseable DIY elements.
 * to make one - inherit from the "clrly.component" class or use the ClearlyFC type.
 */
export type ClearlyFC<T = {}> = (state: ClearlyComponentProps<T>, context: ClearlyComponent<T>, localContext: {
    [key: string | number | symbol]: any;
}) => ClearlyHTMLElement | HTMLElement;
export type ClearlyNode = ClearlyHTMLElement | ClearlyComponent | (ClearlyHTMLElement | ClearlyComponent)[] | ClearlyNode[];
type ClearlyNewElementType = keyof HTMLElementTagNameMap | (string & {});
type ClearlyNewClearType = "clear" | null;
type ClearlyNewComponentType<T = {}> = "component" | typeof ClearlyComponent<T> | ClearlyFC<T>;
type ClearlyNewType<T = {}> = ClearlyNewElementType | ClearlyNewComponentType<T> | ClearlyNewClearType;
type ClearlySwitcherCurrent = {
    name: string;
    props?: any;
};
type ClearlyRouterCurrent = {
    route: string;
    props?: any;
    browserNavigation?: boolean;
};
export declare class clrly {
    #private;
    static component: typeof ClearlyComponent;
    /**
     * Makes a new ClearlyHTML element with a type, attributes and children.
     * @param type Type of the element.
     * @param props (optional) list of the element's attributes: {id: "hello", class: "someElement", parent: document.body, innerHTML: "Hello World"} etc.
     * @param children (optional) children of the element.
     * @returns an HTML element.
     */
    static new<T extends ClearlyNewType<any>>(type: T, props?: (T extends ClearlyNewComponentType<infer P> | ClearlyFC<infer P> ? Partial<P & {
        from?: typeof ClearlyComponent<P> | ClearlyFC<P>;
    }> : T extends keyof HTMLElementTagNameMap ? Partial<ClearlyHTMLElement<T>> : Partial<ClearlyHTMLElement>) & {
        [key: string]: any;
    }, ...children: ClearlyNode[]): T extends ClearlyNewComponentType<infer P> | ClearlyFC<infer P> ? ClearlyComponent<P> : T extends ClearlyNewClearType ? ClearlyNode : T extends keyof HTMLElementTagNameMap ? ClearlyHTMLElement<T> : ClearlyHTMLElement;
    /**
     * Shows or removes an element from the screen.
     * @param toRender an element to render or remove.
     * @param render (optional) render or remove from page?
     * @param parent (optional) parent to render to.
     */
    static render(toRender: ClearlyNode | HTMLElement, render?: boolean, parent?: HTMLElement | ClearlyHTMLElement): void;
    /**
     * Edits the given element's attributes (or all elements in a certain array).
     * @param element HTML element or an array of elements.
     * @param attributes attributes to change.
     * @returns the element (or the array).
     */
    static editAttributes(element: ClearlyNode | HTMLElement | (ClearlyNode | HTMLElement)[], attributes: Partial<ClearlyHTMLElement | ClearlyComponentProps>): HTMLElement | ClearlyHTMLElement<""> | ClearlyComponent<{}> | (HTMLElement | ClearlyNode)[];
    /**
     * adds HTML code into document.
     * @param HTML HTML code to be added.
     * @param parent (optional) parent element for the code to be inserted in.
     * @returns the HTML code.
     */
    static add(HTML: string, parent?: HTMLElement): string | undefined;
    /**
     * Get an element by Query selector.
     * @param selector Query selector.
     * @returns the first element that matches the selector, or null.
     */
    static $(selector: string): Element | null;
    /**
     * Get elements by Query selector.
     * @param selector Query selector.
     * @returns all elements with the specified Query selector, or an empty array.
     */
    static $$(selector: string): NodeListOf<Element>;
    /**
     * Get elements by attribute.
     * @param attribute attribute name of the elements.
     * @param value value of the attribute.
     * @returns all elements with the specified attribute and attribute value, or an empty array.
     * @see xattribute
     */
    static byAttribute(attribute: string | keyof HTMLElement, value: any): NodeListOf<Element>;
    /**
     * Import style / script.
     * @param toImport resources to import (as an array of strings or a single string).
     * @param attributes {defer: true, type: "module"} etc...
     * @param callback a function to be called after all resources loaded.
     * @returns An array with all imported resources
     */
    static import(toImport: string | string[], attributes?: Partial<HTMLScriptElement & HTMLLinkElement>, callback?: () => void): string[];
    /**
     * Set the document's title.
     * @param title the new title.
     * @returns the page's title
     */
    static title(title: string): string;
    /**
     * Set the OG (Open Graph) title - for social media.
     * @param title the new title.
     */
    static ogTitle(title: string): void;
    /**
     * Set the document's description.
     * @param description the new description.
     */
    static description(description: string): void;
    /**
     * Set the OG (Open Graph) description - for social media.
     * @param description the new description.
     */
    static ogDescription(description: string): void;
    /**
     * Set the document's icon.
     * @param src URL of the new icon.
     */
    static icon(src: string): void;
    /**
     * Set the OG (Open Graph) image (cover image) - for social media.
     * @param src URL of the new OG image.
     */
    static ogImage(src: string): void;
    /**
     * Set the document's theme color.
     * @param color theme color (in hex).
     */
    static theme(color: string): void;
    /**
     * Change the dir attribute of the body element.
     * @param dir direction: RTL or LTR.
     */
    static dir(dir: "rtl" | "ltr"): void;
    /**
     * Make the app more usable to mobile devices.
     * @param value true (default) - only mobile friendly, "app" - app mode (not user scalable).
     * @returns the viewport HTML element.
     */
    static mobileFriendly(value?: boolean | "app"): ClearlyHTMLElement<"meta">;
    /**
     * Initialize the app - set a title, icon, theme color, direction and mobile friendliness.
     * @param options {title: "title of the app", description: "welcome to my app", icon: "icon.png", ogImage: "og.png", theme: "#99ff99", dir: "RTL", mobile: true}.
     * @returns an array of results from the requested options.
     */
    static initialize(options: ClearlyInitializeOptions): {
        title?: any;
        ogTitle?: any;
        description?: any;
        ogDescription?: any;
        icon?: any;
        ogImage?: any;
        theme?: any;
        dir?: any;
        mobile?: any;
    };
    /**
     * Add a CSS style.
     * @param {string} style style to be added.
     * @returns the style element created.
     */
    static style(style: string): ClearlyHTMLElement<"style">;
    /**
     * Converts HEX colors to RGB.
     * @param color HEX or HSL color to convert.
     * @returns an object contains the r (red), g (green) and b (blue) values of the color.
     */
    static toRGB(color: string | {
        h: number;
        s: number;
        l: number;
    }): {
        r: number;
        g: number;
        b: number;
    };
    /**
     * Converts RGB or HSL colors to HEX.
     * @param color RGB or HSL color to convert, as an object (for example: {r: 204, g: 153, b: 255}).
     * @returns the color as a HEX string.
     */
    static toHEX(color: {
        r: number;
        g: number;
        b: number;
    } | {
        h: number;
        s: number;
        l: number;
    }): string;
    /**
     * Converts RGB and HEX colors to HSL.
     * @param color color to convert; HEX string or RGB object (for example: {r: 204, g: 153, b: 255}).
     * @returns the color as an HSL object.
     */
    static toHSL(color: string | {
        r: number;
        g: number;
        b: number;
    }): {
        h: number;
        s: number;
        l: number;
    };
    /**
     * Changes the brightness of a HEX or RGB color.
     * @param color HEX color or RGB color object (for example {r: 10, g: 100, b: 255}) to change the brightness of.
     * @param {number} level a number between 0 (darkest) to 100 (brightest).
     * @returns the new color, as the input type.
     */
    static colorBrightness(color: string | {
        r: number;
        g: number;
        b: number;
    }, level: number): any;
    /**
     * The current URL.
     */
    static get url(): string;
    /**
     * The current URL, but without the search and hash elements.
     */
    static get pageUrl(): string;
    /**
     * URL hash (#)
     */
    static get hash(): string;
    /**
     * URL search (?) (AKA QueryString)
     * to get a value, use: clrly.search.get('parameter')
     */
    static get search(): URLSearchParams;
    /**
     * Reloads the page.
     */
    static reload(): void;
    /**
     * Redirects to another URL.
     * @param URL URL to be redirected to.
     */
    static redirectTo(URL: string): void;
    /**
     * Go to another url.
     * @param URL URL to go to.
     * @param newWindow (optional) open in a new window, default is false.
     */
    static go(URL: string, newWindow?: boolean): void;
    /**
     * Opens a new window with the same URL.
     */
    static duplicateWindow(): void;
    /**
     * Starts a new AJAX request.
     * @param url URL to send the request to.
     * @param params configuration of the request: {method: "GET", mode: "cors"}.
     * @param callback a callback function that gets the response text.
     */
    static request(url: string, params?: RequestInit, callback?: (response: string | null) => void): void;
    /**
     * Starts a new AJAX request for a JSON file.
     * @param {string} url JSON file URL.
     * @param {{}} params configuration of the request: {method: "GET", mode: "cors"}.
     * @param {function} callback a callback function that gets the formatted JSON.
     */
    static jsonRequest(url: string, params?: RequestInit, callback?: (response: any | null) => void): void;
    /**
     * Starts a new AJAX request for a file.
     * @param url file URL.
     * @param params configuration of the request: {method: "GET", mode: "cors"}.
     * @param callback a callback function that gets the blob object that represents the file.
     */
    static blobRequest(url: string, params?: RequestInit, callback?: (response: Blob | null) => void): void;
    /**
     * Get a random float between two values (min < x < max when x is the random number).
     * @param min the minimal number.
     * @param max the maximal number.
     * @returns a random float between the two values.
     */
    static random(min: number, max: number): number;
    /**
     * Get a random integer between two values (min ≤ x ≤ max when x is the random number).
     * @param min the minimal number.
     * @param max the maximal number.
     * @returns a random number between the two values.
     */
    static randomInt(min: number, max: number): number;
    /**
     * Generates a link to the content as a blob.
     * @param content content to store as blob.
     * @param type MIME type (default: "text/html;charset=utf-8").
     * @param bom whether or not to add a BOM signature to the file; default is false.
     * @returns URL of the blob.
     */
    static toFile(content: any, type?: string, bom?: boolean): string;
    /**
     * Downloads a file from a specified URL.
     * @param URL file URL.
     * @param fileName name of the downloaded file (For example: "MyFile.txt").
     */
    static download(URL: string, fileName: string): void;
}
/**
 * The base class for a switchable component - for the ClearlyJS Switcher and Router.
 * Inherit from this class and override the constructor, "element", and "onSwitch" methods to make your own switchable pages and parts.
 */
export declare class Switchable<T = {}> extends ClearlyComponent<T> {
    /**
     * Sprops is an object with additional properties that is passed on switch.
     */
    sProps: {
        [key: string | number | symbol]: any;
    };
    private switcherParent;
    appendTo(parent: HTMLElement | ClearlyHTMLElement, props?: any): void;
    start(): void;
    onSwitch(): void;
    get isSwitchable(): boolean;
}
/**
 * The base class of the Switcher and Router features in ClearlyJS.
 * This is an internal class that cannot be used inside your code.
 */
declare abstract class SwitcherRouterBase<T extends ClearlySwitcherCurrent | ClearlyRouterCurrent, P = {}> extends ClearlyComponent<{
    current: T;
} & P> {
    protected _switchables: {
        [key: string]: Switchable;
    };
    constructor(props: ClearlyComponentProps<any>);
    element(): ClearlyHTMLElement<"div">;
    /**
     * Add a new Switchable to the Switchables collection.
     * @param identifier a unique name for the switchable, or a unique URL path for the Router.
     * @param switchable Switchable to add.
     * @returns the identifier.
     */
    add(identifier: string, switchable: Switchable): string;
    /**
     * Set the current switchable to the one with the specified identifier (name or route).
     * You can also pass parameters to the switchable to show with "props".
     * @param current an object containing the name or path (route) of the switchable, and the parameters (props) to pass.
     */
    set current(current: T);
    clear(): void;
    abstract _get(name: string): Switchable;
}
/**
 * The clearlyJS Switcher - a container of multiple Switchable components that shows one switchable at a time.
 * The Switcher links each Switchable to an identifier.
 */
export declare class Switcher extends SwitcherRouterBase<ClearlySwitcherCurrent> {
    _get(name: string): Switchable<{}>;
    get currentName(): string;
}
/**
 * The clearlyJS Router - a  container of multiple Switchable components that shows one switchable at a time.
 * The Router links each Switchable to a URL path - to make the effect of moving between actual pages.
 */
export declare class Router extends SwitcherRouterBase<ClearlyRouterCurrent, {
    notFound: Switchable<any>;
}> {
    static get NOT_FOUND_PATH(): string;
    constructor(props: ClearlyComponentProps<any>);
    _get(route: string): Switchable<{}>;
    get currentRoute(): string;
    clear(): void;
    _navigate(browserNavigation?: boolean): Promise<void>;
    initialize(): Promise<void>;
}
/**
 * A pre-made Switchable div element - to use in Switcher and Router.
 * Currently, Sdiv doesn't support properties.
 */
export declare class Sdiv extends Switchable<HTMLDivElement> {
    element(): ClearlyHTMLElement<"div">;
    onSwitch(): void;
}
export default clrly;
//# sourceMappingURL=clearly.d.ts.map