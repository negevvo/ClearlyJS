/**
 * ClearlyDebug - a debugging tool for ClearlyJs
 * @author Negev Volokita (negevvo)
 * @version 1
 */
class clrlyDebug{
	/**
	 * starts a debugging session
	 */
	static debug(){
		clrly.style(`
			#clearlyErrorButton, #clearlyErrorButtonBadge{
				color: white !important;
				position: fixed !important;
				left: 15px !important;
				bottom: 15px !important;
				z-index: 1000 !important;
				background-color: #ff4d4d !important;
				filter: drop-shadow(0 0 8px #ff4d4d) !important;
				height: 50px !important;
				width: 50px !important;
				border: 0 !important;
				outline: none !important;
				font-size: 30px !important;
				transition: all 1s !important;
				display: none;
				border-radius: 10px !important;
				font-family: sans-serif !important;
			}
			#clearlyErrorButton:hover{
				filter: drop-shadow(0 0 20px #ff4d4d) !important;
				cursor: pointer !important;
			}
			#clearlyErrorsBack{
				display: none;
				position: fixed !important;
				z-index: 1001 !important;
				height: 100% !important;
				width: 100% !important;
				top: 0 !important;
				bottom: 0 !important;
				left: 0 !important;
				right: 0 !important;
				background-color: rgba(0, 0, 0, 0.3) !important;
				backdrop-filter: blur(5px) !important;
				border-radius: 0 !important;
			}
			#clearlyErrors{
				margin: auto !important;
				display: none;
				position: fixed !important;
				top: 50% !important;
				left: 50% !important;
				transform: translate(-50%, -50%) !important;
				z-index: 1002 !important;
				height: 80% !important;
				width: 80% !important;
				border-radius: 20px !important;
				background-color: rgba(255, 255, 255, 0.7) !important;
				backdrop-filter: blur(2px) !important;
				-webkit-backdrop-filter: blur(2px) !important;
				padding: 15px !important;
				overflow: auto !important;
				font-family: sans-serif !important;
				text-align: left;
			}
			#clearlyErrors h1{
				font-family: sans-serif !important;
				font-size: 20px !important;
				word-break: break-word !important;
			}
			#clearlyErrors a{
				font-family: sans-serif !important;
			}
			#clearlyErrors a{
				text-decoration: none !important;
				color: #003399;
			}
		`);
		var btn = clrly.new("button", {id: "clearlyErrorButton", innerHTML: "!", onclick: "clrlyDebug.showErrors()"});
		clrly.new("div", {id: "clearlyErrorsBack", onclick: "clrlyDebug.hideErrors()"});
		var div = clrly.new("div", {id: "clearlyErrors"});
		window.onerror = function(message, url, line, column, error) {
			var inFileTxt = "<br/>In file: ";
			var lineTxt = "<br/>Line: ";
			var columnTxt = ", Column: ";
			var errorTxt = "<br/>";
			switch(undefined || null || ""){
				case message:
					message = "";
				case url:
					url = "";
					inFileTxt = "";
				case line:
					line = "";
					lineTxt = "";
				case column:
					column = "";
					columnTxt = "";
				case error:
					error = "";
			}
			clrly.new("h1", {parent: div, innerHTML: `${message}${inFileTxt}${url}${lineTxt}${line}${columnTxt}${column}${errorTxt}${error}`});
			clrly.new("a", {parent: div, innerHTML: "Search error on Google", href: `https://www.google.com/search?q=${message}`, target: "_blank"});
			clrly.new("br", {parent: div});
			clrly.new("a", {parent: div, innerHTML: "Search error on Bing", href: `https://www.bing.com/search?q=${message}`, target: "_blank"});
			clrly.new("br", {parent: div});
			clrly.new("br", {parent: div});
			btn.style.display = "unset";
		};
		var error = console.error;
		console.error = function(message){
			window.onerror(message);
			error.apply(console, arguments);
		};
	}
	/**
	 * Show the Errors
	 */
	static showErrors(){
		clrly.id("clearlyErrors").style.display = "unset";
		clrly.id("clearlyErrorsBack").style.display = "unset";
	}
	/**
	 * Hide the Errors
	 */
	static hideErrors(){
		clrly.id("clearlyErrors").style.display = "none";
		clrly.id("clearlyErrorsBack").style.display = "none";
	}
}

//Starts debugging when file loads
clrlyDebug.debug();