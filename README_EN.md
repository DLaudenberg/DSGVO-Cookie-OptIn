# DSGVO | Cookie OptIn

[README DE](README.md)

A simple script to include Tracking-Scripts according to GDPR (german: DSGVO).
The user can choose whether he wants to allow (Tracking-)Cookies or not. Only if he approves, the previously regsitered Tracking-Tools are loaded.

The decision is saved for 30 days.

## Prerequisites

The banner that contains the infotext and the links needs to hold the classname `dsgvo-cookie-optin-banner` - by this class the banner gets hidden after the user has sent his decision.

Inside the banner there are to elements (e.g. buttons) that receive the class `opt-in` and `opt-out` respectively. By these, the user's decision is effectively triggered.
Alternativly, the functions `.approveCookies()` and `.denyCookies()` (see below) can be triggered manually.

The Script is stand-alone; there are no dependencies to other JavaScript-Frameworks.

## Usage

### 1. Include the DSGVO-Cookie-OptIn-Script

If your Script-Files aren't bundled, you include the DSGVO-Cookie-OptIn as a script-tag on the website:

```html
<script src="js/dsgvo-cookie-optin.js"></script>
```

The CSS-file is only relevant for the demo and should not be included in your page.

### 2. Initialisation

The DSGVO-Cookie-OptIn is created as a new JavaScript-Object:

```javascript
var dsgvoCookieOptIn = new DsgvoCookieOptIn();
```

### 3. Tracking-Scripte registrieren

By the function `.registerTrackingScript()` a tracking-script can be registered. It will be stored and only initialised if the user has approved. By calling the function several times, multiple Scripts can be registered.

Example: Registration of Google Analytics.

```javascript
var googleAnalytics = function() {
	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
	ga('create', 'XX-xxxxxxxx-x', 'none');
	ga('set', 'anonymizeIp', true);
	ga('send', 'pageview');
}
dsgvoCookieOptIn.registerTrackingScript(googleAnalytics);

dsgvoCookieOptIn.registerTrackingScript(function() {
	// ...
});
```

### 4. Start Cookie-Check

Via `init` the actual process is startet. Optimally this happens after `document.ready`.

```javascript
function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(function() {
  dsgvoCookieOptIn.init();
})
```

## Methods

### `.registerTrackingScript()`

Registers Scripts that should be implemented when the user gives his approval.

Important: The function `registerTrackingScript` must be executed __before__ the function `init`.

### `.unregisterTrackingScript()`

Unregisters scripts that have been registered before.
In this context it is kind of useless, but the [Observer Design Pattern](https://www.geeksforgeeks.org/observer-pattern-set-1-introduction/) includes it :-)

### `.getTrackingScripts()`

Returns all registered scripts, for example to review them in the der DevTools-Console.

### `.init()`

Starts the Cookie-Check. the available Cookies are validated. Depending in their values the banner gets hidden and - if needed - the registered scripts are implemented.

Important: The function `init` must be executed __after__ the function `registerTrackingScript`.

### `.approveCookies()`

Sets the relevant cookies to store the decision for the next visits and executes the regsitered scripts.

### `.denyCookies()`

Sets the relevant cookies to store the decision for the next visits. Accordingly, the registered scripts are _not_ executed.

## Limitations

* _No deletion of existing Cookies_
  DSGVO-Cookie-OptIn only regulates whether the registriered scripts should be executed. A Deletion of existing cookies is not supported.

* _Script-Tags have to be created_
  Some tracking-tools use functions that are more complex than creating a simple script-tags with a given `src`. Thus the creation of such tags is not supported and has to be handled by the registered script.
  * The plain creation of a script-tag can, for example, be done by the following function:
  ```javascript
  function loadJS(u) { var r = document.getElementsByTagName('script')[0], s = document.createElement('script'); s.src = u; r.parentNode.insertBefore(s, r); }
  loadJS('/js/vendor/tracking.min.js');
  ```

* _No custom settingsKeine Möglichkeit für custom Einstellungen_
  Currently the script does not take any parameters and so can't be controlled by them.

* _Cookies are used_
  A Script that should prevent cookies can't be developed without cookies. It uses its own cookies to store the user's decision. This shoul be considered in the text of the cookie-guideline.
  The used cookies are `dsgvoCookieOptinDecided` and `dsgvoCookieOptinApproved`.
