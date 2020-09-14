
var Cookies = {

	set : function(key, value, expiresInDays) {

		if (!key)
			return;

		if (!value)
			value = "";

		if (expiresInDays === undefined)
			expiresInDays = 7;

		var expires = new Date(new Date() * 1 + expires * 864e5).toUTCString();

		return (document.cookie = key + '=' + value + ';expires=' + expires)
	},
	get : function(key) {

		// To prevent the for loop in the first place assign an empty array
		// in case there are no cookies at all.
		var cookies = document.cookie ? document.cookie.split('; ') : [];
		var cookie = "";
		for( var i = 0, ii = cookies.length; i < ii; i++) {
			
			var parts = cookies[i].split('=');
			var name  = parts[0];
			var value = parts.slice(1).join('=');

			if (key === name) {
				cookie = value;
				break;
			}
		};

		return cookie;
	}
}

function DsgvoCookieOptIn() {

	// PROPERTIES

	var _scripts = [];

	var cookieDecidedName    = "dsgvoCookieOptinDecided";
	var cookieApprovedName   = "dsgvoCookieOptinApproved";
	var cookieDurationInDays = 30;

	var cookieBannerClassName       = "dsgvo-cookie-optin-banner";
	var cookieButtonOptInClassName  = "opt-in";
	var cookieButtonOptOutClassName = "opt-out";

	var isDebugMode = true;

	// PRIVATE METHODS

	var debugLog = function(message) {

		if (isDebugMode)
			console.log(message);
	}

	var implementTrackingScripts = function() {
		debugLog("implementTrackingScripts");

		for( var i = 0, ii = _scripts.length; i < ii; i++) {
			
			var script = _scripts[i];

			if (script !== undefined) {
				script();
			}
		};
	}

	var hideCookieBanner = function() {
		debugLog("hideCookieBanner");

		var banner = document.getElementsByClassName(cookieBannerClassName);
		for( var i = 0, ii = banner.length; i < ii; i++) {
			
			var bannerEntity = banner[i];
			bannerEntity.style.display = "none";
		};
	}

	var setCookie = {

		decided : function() {
			debugLog("setCookie.decided");

			Cookies.set(cookieDecidedName, "1", cookieDurationInDays);
		},

		approved : function() {
			debugLog("setCookie.approved");
			
			Cookies.set(cookieApprovedName, "1", cookieDurationInDays);
		},

		denied : function() {
			debugLog("setCookie.denied");
			
			Cookies.set(cookieApprovedName, "0", cookieDurationInDays);
		}
	}

	var isCookie = {

		decided : function() {
			debugLog("isCookie.decided");

			var cookieConsentValue = Cookies.get(cookieDecidedName);

			return cookieConsentValue == "1";
		},

		approved : function() {
			debugLog("isCookie.approved");

			var cookieConsentValue = Cookies.get(cookieApprovedName);

			return cookieConsentValue === "1";
		}
	}


	// PUBLIC METHODS

	this.registerTrackingScript = function(initScriptFunction) {
		debugLog("registerTrackingScript");

		_scripts.push( initScriptFunction );
	}

	this.unregisterTrackingScript = function(initScriptFunction) {
		debugLog("unregisterTrackingScript");

		_scripts = _scripts.filter(function(element, index, source) {

			return element != initScriptFunction;
		});
	}

	this.getTrackingScripts = function() {
		debugLog("getTrackingScripts");

		return _scripts;
	}

	this.init = function() {
		debugLog("init");

		// INITIALIZE COOKIE-OPTIN
		// prerequisite: tracker must have been registered by the dev by now

		// check if cookie already has been consented
		if (isCookie.decided()) {

			// hide cookie banner
			hideCookieBanner();

			// check if cookies are approved
			if (isCookie.approved()) {

				// implement tracking-scripts
				implementTrackingScripts();
			}
		}

		// init buttons
		var banners = document.getElementsByClassName(cookieBannerClassName);
		for( var i = 0, ii = banners.length; i < ii; i++) {

			var n, nn;
			
			var banner = banners[i];

			var optInButtons = banner.getElementsByClassName(cookieButtonOptInClassName);
			var optOutButtons = banner.getElementsByClassName(cookieButtonOptOutClassName);

			for( n = 0, nn = optInButtons.length; n < nn; n++) {
				
				var optInButton = optInButtons[n];
				optInButton.addEventListener("click", this.approveCookies);
			};

			for( n = 0, nn = optOutButtons.length; n < nn; n++) {
				
				var optOutButton = optOutButtons[n];
				optOutButton.addEventListener("click", this.denyCookies);
			};
		};
	}

	this.approveCookies = function() {
		debugLog("approveCookies");

		// USER CLICKS "APPROVE"
		
		// set decided-cookie to 1
		setCookie.decided();

		// set approved-cookie to 1
		setCookie.approved();

		// hide cookie-banner
		hideCookieBanner();

		// implement tracking-scripts
		implementTrackingScripts();
	}
	
	this.denyCookies = function() {
		debugLog("denyCookies");

		// USER CLICKS "DENY"
		
		// set decided-cookie to 1
		setCookie.decided();

		// set approved-cookie to 0
		setCookie.denied();

		// hide cookie-banner
		hideCookieBanner();
	}
}
