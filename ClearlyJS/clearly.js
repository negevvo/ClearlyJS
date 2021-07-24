/**
 * ClearlyJs
 * @author Negev Volokita (negevvo)
 * @version pre2-dev (see @todo)
 * NOTE: Items starting with _ or # won't be documented
 */
export default class clrly{
	// **************************** HTML ELEMENTS AND COMPONENTS ****************************
	/**
	 * @todo DOCUMENT THIS!!!!!!!!!!!
	 */
	static get component() {
		return class component {
		  constructor(attributes) {
			if (this.constructor === clrly.component) {
			  throw new Error(
				"clrly.component is not an initializeable object, make your own constructor"
			  );
			}
		  }
		  get element() {
			throw new Error("Please make a getter for the element");
		  }
		  get style() {
			return ``;
		  }
		};
	}

	/**
	 * makes a new ClearlyHTML element with a type, attributes and children
	 * @param {string} type   Type of the element
	 * @param {*} attributes  (optional) list of the element's attributes: {id: "hello", class: "someElement", parent: document.body, innerHTML: "Hello World"} etc
	 * @param {HTML elements} children    (optional) children of the element
	 * @returns an HTML element
	 */
    static new(type, attributes, ...children){
		if(type == "clrly"){
			return this._newElementFromComponent(attributes);
		}
		var newElement = this._newElement(type);
		if (attributes){
			this.editAttributes(newElement, attributes);
		}
		for (var child of children) {
			try{
            	newElement.appendChild(child.nodeType == null ? document.createTextNode(child.toString()) : child);
			}catch(e){}
        }
		/**
		 * Edits the element's attributes
		 * @param {*} attributes attributes to change
		 * @returns the element
		 */
		newElement.editAttributes = function(attributes){
			return clrly.editAttributes(newElement, attributes);
		}
		newElement.isClearlyHTML = true;
		return newElement;
	}
	static _newElement(type){
		var newElement = document.createElement(type);
		document.body.appendChild(newElement);
		return newElement;
	}
	static _newElementFromComponent(attributes){
		var objectClass = attributes.from;
      	if (!objectClass) {
        	throw new Error("Cannot find the component");
      	}
      	var obj = new objectClass(attributes);
      	var el = obj.element;
      	el.style = obj.style;
		obj.HTML = el;
      	return obj;
	}

	/**
	 * Edits the given element's attributes (or all elements in a certain array)
	 * @param {*} element HTML element or an array of elements
	 * @param {*} attributes attributes to change
	 * @returns the element (or the array)
	 */
	static editAttributes(element, attributes){
		if(Array.isArray(element)){
			for(var el of element){
				this.editAttributes(el, attributes);
			}
			return element;
		}
		if(attributes){
			for(var attribute in attributes){
				if(attribute != "parent" && attribute != "innerHTML"){
					var type = typeof attributes[attribute];
					if(type == "function" || type == "object"){
						element[attribute] = attributes[attribute];
					}else{
						element.setAttribute(attribute, attributes[attribute]);
					}
				}
				if(attributes["parent"]){
					var parent = attributes["parent"];
					parent.appendChild(element);
				}
				if(attributes["innerHTML"]){
					element.innerHTML = attributes["innerHTML"];
				}
			}
		}
		return element;
	}

	/**
	 * adds HTML code into document
	 * @param {string} HTML HTML code to be added
	 * @param {*} parent    (optional) parent element for the code to be inserted in
	 * @returns             the HTML code
	 */
	static add(HTML, parent = document.documentElement){
		try{
			parent.innerHTML += HTML;
			return HTML;
		}catch(e){}
	}

	/**
	 * Get element by id
	 * @param {string} id id of the element
	 * @returns           DOM element with the specified id, or undefined
	 * @see Xid
	 */
	static id(id){
		return this.Xid(document, id);
	}

	/**
	 * Get elements by class name
	 * @param {string} className class name of the elements
	 * @returns                  HTML elements collection which includes all elements with the specified class name, or an empty array
	 * @see Xclass
	*/
	static class(className){
		return this.Xclass(document, className);
	}

	/**
	 * Get elements by tag name
	 * @param {string} tagName tag name of the elements
	 * @returns                HTML elements collection which includes all elements with the specified tag name, or an empty array
	 * @see Xtag
	 */
	static tag(tagName){
		return this.Xtag(document, tagName);
	}

	/**
	 * Get elements by Query selector (CSS selector)
	 * @param {string} selector Query selector
	 * @returns                HTML elements collection which includes all elements with the specified Query selector, or an empty array
	 * @see Xselect
	 */
	 static select(selector){
		return this.Xselect(document, selector);
	}

	/**
	 * Get elements by attribute
	 * @param {string} attribute attribute name of the elements
	 * @param {string} value     value of the attribute
	 * @returns                  HTML elements collection which includes all elements with the specified attribute and attribute value, or an empty array
	 * @see Xattribute
	 */
	 static attribute(attribute, value){
		return this.Xattribute(document, attribute, value);
	}

	/**
	 * Import style / script
	 * @param {string} link  link to import
	 * @param {string} type  css / js
	 * @param {*} attributes {defer: true} etc...
	 * @returns				 HTML element of the imported file
	 */
	static import(link, type, attributes){
		var element = null;
		switch(type.toLowerCase()){
			case "css":
				element = this.new("link", {parent: document.head, href: link, rel: "stylesheet"});
				break;
			case "js":
				element = this.new("script", {parent: document.head, src: link});
				break;
		}
		for(var attribute in attributes){
			element.setAttribute(attribute, attributes[attribute]);
		}
		return element;
	}

	/**
	 * Set the document's title
	 * @param {string} title the new title
	 * @returns              the page's title
	 */
	static title(title){
		return document.title = title;
	}

	/**
	 * Set the document's icon
	 * @param {string} src URL of the new icon
	 * @returns            the page's icon src
	 */
	static icon(src){
		Array.from(this.attribute("rel", "icon")).forEach(function(element){
			element.remove();
		});
		this.new("link", {parent: document.head, rel: "icon", href: src});
		return this.attribute("rel", "icon")[0].href;
	}

	/**
	 * Set the document's theme color
	 * @param {string} color theme color (in hex)
	 * @returns              the page's theme color
	 */
	 static theme(color){
		Array.from(this.attribute("name", "theme-color")).concat(Array.from(this.attribute("name", "apple-mobile-web-app-status-bar-style"))).forEach(function(element){
			element.remove();
		});
		this.new("meta", {parent: document.head, name: "theme-color", content: color});
		this.new("meta", {parent: document.head, name: "apple-mobile-web-app-status-bar-style", content: color});
		return this.attribute("name", "theme-color")[0].content;
	}

	/**
	 * Change the dir attribute of the body element
	 * @param {*} dir direction: RTL or LTR
	 */
	static dir(dir){
		document.body.dir = dir;
	}

	/**
	 * Makes the app more usable to mobile devices
	 * @param {*} value true (default) - only mobile friendly, "app" - app mode (not user scalable)
	 * @returns 
	 */
	 static mobileFriendly(value = true){
		var scalable = value == "app" ? `, user-scalable="no"` : "";
		return this.new("meta", {parent: document.head, name: "viewport", content: `width=device-width, initial-scale=1.0${scalable}`});
	}

	/**
	 * Initialize the app - set a title, icon, theme color, direction and mobile friendliness
	 * @param {*} options {title: "title of the app", icon: "icon.png", theme: "#99ff99", dir: "RTL", mobile: true, using: "debug"}
	 */
	static initialize(options){
		if(options["title"]){
			this.title(options["title"]);
		}
		if(options["icon"]){
			this.icon(options["icon"]);
		}
		if(options["theme"]){
			this.theme(options["theme"]);
		}
		if(options["dir"]){
			this.dir(options["dir"]);
		}
		if(options["using"]){
			this.using(options["using"]);
		}
		if(options["mobile"]){
			this.mobileFriendly(options["mobile"]);
		}
	}


	// **************************** STYLES ****************************
	/**
	 * Add CSS style
	 * @param {string} style style to be added
	 * @returns              the style element in the HTML
	 */
	 static style(style){
		return this.new("style", {parent: document.head, innerHTML: style});
	}

	/**
	 * Converts HEX colors to RGB
	 * @param {String} hex HEX color to covert (for example: #cc99ff)
	 * @returns an object contains the r (red), g (green) and b (blue) values of the HEX color
	 */
	static toRGB(hex) {
		hex = hex.length == 3 ? hex.replace(/(.)/g, '$1$1') : hex;
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		}: "";
	}

	/**
	 * Converts RGB colors to HEX
	 * @param {*} rgb RGB color to convert as an object (for example: {r: 204, g: 153, b: 255})
	 * @returns the color as hex
	 */
	static toHEX(rgb) {
		function conv(value){
		  value = value.toString(16);
		  return value.length == 1 ? "0" + value : value;
		}
		return "#" +
		conv(rgb.r) +
		conv(rgb.g) +
		conv(rgb.b);
	}

	/**
	 * Changes the brightness of a HEX color
	 * @param {String} hex HEX color to change the brightness of
	 * @param {number} level a number between -100 (darkest) to 100 (brightest), 0 is the color itself
	 * @returns 
	 */
	static colorBrightness(hex, level) {
		var rgb = this.toRGB(hex);
		level = (level + 100) / 100;
		return this.toHEX({
			r: Math.min(255,Math.floor(rgb.r*level)),
			g: Math.min(255,Math.floor(rgb.g*level)),
			b: Math.min(255,Math.floor(rgb.b*level))
		});
	}


	// **************************** URL ****************************
	/**
	 * Current URL
	 */
	static get url(){
		return window.location.href;
	}

	/**
	 * The same URL, but without the search and hash elements
	 */
	static get pageUrl(){
		return this.url.replace(window.location.search, "").replace(window.location.hash, "");
	}

	/**
	 * URL hash (#)
	 */
	static get hash(){
		return decodeURI(window.location.hash.substring(1));
	}

	/**
	 * URL search (?) (AKA QueryString)
	 * to get a value, use clrly.search.get('parameter')
	 */
	static get search(){
		return new URL(window.location.href).searchParams;
	}

	/**
	 * Reloads the page
	 */
	static reload(){
		window.location.reload();
	}

	/**
	 * Redirects to another URL
	 * @param {string} URL URL to be redirected to
	 */
	static redirect(URL){
		window.location.replace(URL);
	}

	/**
	 * Go to another url
	 * @param {string} URL        URL to go to
	 * @param {boolean} newWindow (optional) open in a new window
	 */
	static go(URL, newWindow){
		if(newWindow){
			window.open(URL);
		}else{
			window.location.href = URL;
		}
	}

	/**
	 * Opens a new window with the same URL
	 */
	static duplicate(){
		this.go(this.url, true);
	}

	/**
	 * Goes to the same URL, but without the search and hash elements
	 * @see pageUrl
	 */
	static pageURL(){
		this.go(this.pageUrl);
	}


	// **************************** COOKIES ****************************
	static get _MONTHS(){
		return ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
	}

	/**
	 * Makes a new cookie
	 * @param {string} name    name of the cookie
	 * @param {string} content content of the cookie
	 * @param {number} day        (optional) Expiration day
	 * @param {number} month      (optional) Expiration month
	 * @param {number} year       (optional) Expiration year
	 * @returns content
	 */
	static cookie(name, content, day, month, year){
		var date = "31 Dec 2036";
		if(typeof(day) != "undefined" && typeof(month) != "undefined" && typeof(year) != "undefined"){
			month = this._MONTHS[month-1];
			date = (day) + ' ' + month + ' ' + year;
		}
		document.cookie = name+'='+content+'; expires=' + date + ' 23:59:59 UTC; path=/';
		return content;
	}

	/**
	 * Deletes a cookie
	 * @param {string} cookieName cookie name to be deleted
	 */
	static deleteCookie(cookieName){
		document.cookie = cookieName+'=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
	}

	/**
	 * Gets the content of the cookie
	 * @param {string} cookieName name of the cookie
	 * @returns content of the cookie
	 */
	static getCookie(cookieName){
		var name = cookieName + "=";
    	var decodedCookie = decodeURIComponent(document.cookie);
    	var ca = decodedCookie.split(';');
    	for (var i = 0; i < ca.length; i++) {
        	var c = ca[i];
        	while (c.charAt(0) == ' ') {
            	c = c.substring(1);
        	}
        	if (c.indexOf(name) == 0) {
            	return c.substring(name.length, c.length);
        	}
    	}
    	return "";
	}


	// **************************** AJAX ****************************
	/**
	 * Starts a new AJAX request
	 * @param {string} url URL to send the request to
	 * @param {*} params configuration of the request: {method: "GET", mode: "cors"}
	 * @param {function} callback a callback function that gets the response text
	 */
	static ajax(url, params, callback){
		fetch(url, params).then(response => response.text()).then(response => callback(response));
	}

	/**
	 * Starts a new AJAX request for a JSON file
	 * @param {string} url JSON file URL
	 * @param {*} params configuration of the request: {method: "GET", mode: "cors"}
	 * @param {function} callback a callback function that gets the formated JSON
	 */
	static json(url, params, callback){
		fetch(url, params).then(response => response.json()).then(response => callback(response));
	}

	/**
	 * Opens an xml file
	 * @param {sttring} URL URL of the XML file
	 * @param {function} callback a callback function that gets the xml
	 */
	static getXML(URL, callback) {
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				callback(this.responseXML);
			}
		};
		xmlhttp.open("GET", URL, true);
		xmlhttp.send();
	}


	// **************************** XML ELEMENTS ****************************
	/**
	 * Get XML element by id
	 * @param {*} xml XML element @see getXML
	 * @param {string} id id of the XML element
	 * @returns           XML element with the specified id, or undefined
	 */
	 static Xid(xml, id){
		try{
		return xml.getElementById(id);
		}catch(e){
			return undefined;
		}
	}

	/**
	 * Get XML elements by class name
	 * @param {*} xml XML element @see getXML
	 * @param {string} className class name of the XML elements
	 * @returns                  all elements with the specified class name, or an empty array
	 */
	static Xclass(xml, className){
		try{
			return xml.getElementsByClassName(className);
		}catch(e){
			return [];
		}
	}

	/**
	 * Get XML elements by tag name
	 * @param {*} xml XML element @see getXML
	 * @param {string} tagName tag name of the XML elements
	 * @returns                all XML elements with the specified tag name, or an empty array
	 */
	static Xtag(xml, tagName){
		try{
			return xml.getElementsByTagName(tagName);
		}catch(e){
			return [];
		}
	}

	/**
	 * Get XML elements by Query selector (CSS selector)
	 * @param {*} xml XML element @see getXML
	 * @param {string} selector Query selector
	 * @returns                HTML elements collection which includes all elements with the specified Query selector, or an empty array
	 */
	 static Xselect(xml, selector){
		try{
			return xml.querySelectorAll(selector);
		}catch(e){
			return [];
		}
	}

	/**
	 * Get XML elements by attribute
	 * @param {*} xml XML element @see getXML
	 * @param {string} attribute attribute name of the XML elements
	 * @param {string} value     value of the attribute
	 * @returns                  all XML elements with the specified attribute and attribute value, or an empty array
	 */
	 static Xattribute(xml, attribute, value){
		try{
			return this.Xselect(xml, '['+attribute+'="'+value+'"]');
		}catch(e){
			return [];
		}
	}

	/**
	 * Get the value of an XML element
	 * @param {*} element XML element
	 * @returns the value of the xml element
	 */
	static Xvalue(XMLelement){
		return XMLelement.firstChild.nodeValue;
	}


	// **************************** MATH ****************************
	/**
	 * Get a random float between two values (min < x < max when x is the random number)
	 * @param {number} min the minimal number
	 * @param {number} max the maximal number
	 * @returns a random number between the two values
	 */
	 static random(min, max){
		return Math.random() * (max - min) + min;
	}
	
	/**
	 * Get a random integer between two values (min ≤ x ≤ max when x is the random number)
	 * @param {number} min the minimal number
	 * @param {number} max the maximal number
	 * @returns a random number between the two values
	 */
	static randomInt(min, max){
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}


	// **************************** FILES ****************************
	/**
	 * Generates a link to the content as a blob
	 * @param {*} content content to store as blob
	 * @param {string} type MIME type (default: "text/html")
	 * @returns URL of the blob
	 */
	static toFile(content, type = "text/html"){
		return URL.createObjectURL(new Blob([content], {type : type}));
	}

	/**
	 * Downloads a file from a specified URL
	 * @param {string} URL file URL
	 * @param {string} fileName name of the downloaded file (For example: MyFile.txt)
	 */
	static download(URL, fileName){
		var a = this.new("a", {href: URL, download: fileName});
		a.click();
		a.remove();
	}
}
