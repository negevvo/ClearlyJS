/**
 * ClearlyJs
 * @author Negev Volokita (negevvo)
 * @version 1
 * NOTE: Since private class members is new and not fully supported in JavaScript, they'll be public and start with _, but won't be documented
 */
class clrly {
	// **************************** CLEARLYJS ****************************
	/**
	 * Imports a clearlyJs tool (LABS - may not work as expected)
	 * @param {string} toolName Name of the tool to import, for example: "debug"
	 * @returns HTML element of the tool's file
	 */
	static using(toolName){
		var url = "https://cdn.jsdelivr.net/gh/negevvo/ClearlyJS@main/ClearlyJS/clearly.js";
		url = url.replace(url.substring(url.lastIndexOf("/")), "");
		switch(toolName.toLowerCase()){
			case "debug":
				url += "/clearlyDebug.js";
				break;
			case "fast":
				url += "/clearlyFast.js";
				break;
			default:
				console.error(new Error(`There is no ClearlyJs tool named ${toolName}`));
		}
		return this.import(url, "js", {defer: true});
	}
	// **************************** HTML ELEMENTS ****************************
	/**
	 * makes a new HTML element with a type, attributes and children
	 * @param {string} type   Type of the element
	 * @param {*} attributes  (optional) list of the element's attributes: {id: "hello", class: "someElement", parent: document.body, innerHTML: "Hello World"} etc
	 * @param {HTML elements} children    (optional) children of the element
	 * @returns an HTML element
	 */
    static new(type, attributes, ...children){
		var newElement;
		if(attributes == null){
			attributes = "";
		}
		if (typeof(attributes) != "undefined"){
			newElement = this._newElementWithAttributes(type, attributes);
		}else{
			newElement = this._newElement(type);
		}
		for (var i = 2; i < arguments.length; i++) {
            var child = arguments[i];
            newElement.appendChild(child.nodeType == null ? document.createTextNode(child.toString()) : child);
        }
		/**
		 * Edits the element's attributes
		 * @param {*} attributes attributes to change
		 * @returns the element
		 */
		newElement.editAttributes = function(attributes){
			return clrly.editAttributes(newElement, attributes);
		}
		return newElement;
	}
	static _newElementWithAttributes(type, attributes){
		var newElement = document.createElement(type);
		for(var attribute in attributes){
			if(attribute != "parent" && attribute != "innerHTML"){
				newElement.setAttribute(attribute, attributes[attribute]);
			}
		}
		var parent = document.body;
		if(attributes["parent"]){
			parent = attributes["parent"];
		}
		if(attributes["innerHTML"]){
			newElement.innerHTML = attributes["innerHTML"];
		}
		parent.appendChild(newElement);
		return newElement;
	}
	static _newElement(type){
		var newElement = document.createElement(type);
		document.body.appendChild(newElement);
		return newElement;
	}

	/**
	 * Edits the given element's attributes
	 * @param {*} element HTML element
	 * @param {*} attributes attributes to change
	 * @returns the element
	 */
	static editAttributes(element, attributes){
		for(var attribute in attributes){
			if(attribute != "parent" && attribute != "innerHTML"){
				element.setAttribute(attribute, attributes[attribute]);
			}
			if(attributes["parent"]){
				var parent = attributes["parent"];
				parent.appendChild(element);
			}
			if(attributes["innerHTML"]){
				element.innerHTML = attributes["innerHTML"];
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
	static add(HTML, parent){
		if(typeof(parent) == "undefined"){
			parent = document.documentElement;
		}
		parent.innerHTML += HTML;
		return HTML;
	}

	/**
	 * Get element by id
	 * @param {string} id id of the element
	 * @returns           DOM element with the specified id, or null
	 * @see Xid
	 */
	static id(id){
		try{
		return this.Xid(document, id);
		}catch(e){
			return null;
		}
	}

	/**
	 * Get elements by class name
	 * @param {string} className class name of the elements
	 * @returns                  HTML elements collection which includes all elements with the specified class name, or null
	 * @see Xclass
	*/
	static class(className){
		try{
			return this.Xclass(document, className);
		}catch(e){
			return null;
		}
	}

	/**
	 * Get elements by tag name
	 * @param {string} tagName tag name of the elements
	 * @returns                HTML elements collection which includes all elements with the specified tag name, or null
	 * @see Xtag
	 */
	static tag(tagName){
		try{
			return this.Xtag(document, tagName);
		}catch(e){
			return null;
		}
	}

	/**
	 * Get elements by Query selector (CSS selector)
	 * @param {string} selector Query selector
	 * @returns                HTML elements collection which includes all elements with the specified Query selector, or null
	 * @see Xselect
	 */
	 static select(selector){
		try{
			return this.Xselect(document, selector);
		}catch(e){
			return null;
		}
	}

	/**
	 * Get elements by attribute
	 * @param {string} attribute attribute name of the elements
	 * @param {string} value     value of the attribute
	 * @returns                  HTML elements collection which includes all elements with the specified attribute and attribute value, or null
	 * @see Xattribute
	 */
	 static attribute(attribute, value){
		try{
			return this.Xattribute(document, attribute, value);
		}catch(e){
			return null;
		}
	}

	/**
	 * Add CSS style
	 * @param {string} style style to be added
	 * @returns              the style element in the HTML
	 */
	static style(style){
		return this.new("style", {parent: document.head, innerHTML: style});
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
	 * Initialize the app - set a title, icon, theme color, direction and mobile compatibility
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
		if(options["mobile"] && options["mobile"] == true){
		this.new("meta", {parent: document.head, name: "viewport", content: "width=device-width, initial-scale=1.0"});
		}
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
		return new URL(location.href).searchParams;
	}
	/**
	 * Reloads the page
	 */
	static reload(){
		location.reload();
	}
	/**
	 * Redirects to another URL
	 * @param {string} URL URL to be redirected to
	 */
	static redirect(URL){
		location.replace(URL);
	}
	/**
	 * Go to another url
	 * @param {string} URL        URL to go to
	 * @param {boolean} newWindow (optional) open in a new window
	 */
	static go(URL, newWindow){
		if(typeof(newWindow) != "undefined" && newWindow){
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
	 * @param {int} day        (optional) Expiration day
	 * @param {int} month      (optional) Expiration month
	 * @param {int} year       (optional) Expiration year
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
	 * @returns           XML element with the specified id, or null
	 */
	 static Xid(xml, id){
		try{
		return xml.getElementById(id);
		}catch(e){
			return null;
		}
	}

	/**
	 * Get XML elements by class name
	 * @param {*} xml XML element @see getXML
	 * @param {string} className class name of the XML elements
	 * @returns                  all elements with the specified class name, or null
	 */
	static Xclass(xml, className){
		try{
			return xml.getElementsByClassName(className);
		}catch(e){
			return null;
		}
	}

	/**
	 * Get XML elements by tag name
	 * @param {*} xml XML element @see getXML
	 * @param {string} tagName tag name of the XML elements
	 * @returns                all XML elements with the specified tag name, or null
	 */
	static Xtag(xml, tagName){
		try{
			return xml.getElementsByTagName(tagName);
		}catch(e){
			return null;
		}
	}

	/**
	 * Get XML elements by Query selector (CSS selector)
	 * @param {*} xml XML element @see getXML
	 * @param {string} selector Query selector
	 * @returns                HTML elements collection which includes all elements with the specified Query selector, or null
	 */
	 static Xselect(xml, selector){
		try{
			return xml.querySelectorAll(selector);
		}catch(e){
			return null;
		}
	}

	/**
	 * Get XML elements by attribute
	 * @param {*} xml XML element @see getXML
	 * @param {string} attribute attribute name of the XML elements
	 * @param {string} value     value of the attribute
	 * @returns                  all XML elements with the specified attribute and attribute value, or null
	 */
	 static Xattribute(xml, attribute, value){
		try{
			return this.Xselect(xml, '['+attribute+'="'+value+'"]');
		}catch(e){
			return null;
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
	 * @param {int} min the minimal number
	 * @param {int} max the maximal number
	 * @returns a random number between the two values
	 */
	 static random(min, max){
		return Math.random() * (max - min) + min;
	}
	/**
	 * Get a random integer between two values (min ≤ x ≤ max when x is the random number)
	 * @param {int} min the minimal number
	 * @param {int} max the maximal number
	 * @returns a random number between the two values
	 */
	static randomInt(min, max){
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}


	// **************************** FILES ****************************
	/**
	 * Generates a link to the content as a blob
	 * @param {*} content content to store as blob
	 * @param {*} type MIME type (default: "text/html")
	 * @returns URL of the blob
	 */
	static toFile(content, type = "text/html"){
		return URL.createObjectURL(new Blob([content], {type : type}));
	}

	/**
	 * Downloads a file from a specified URL
	 * @param {*} URL file URL
	 * @param {*} fileName name of the downloaded file (For example: MyFile.txt)
	 */
	static download(URL, fileName){
		var a = this.new("a", {href: URL, download: fileName});
		a.click();
		a.remove();
	}
}