# DSGVO | Cookie OptIn

[README EN](README_EN.md)

Ein einfaches Script, um Tracking-Scripte DSGVO-konform einzubinden.
Der Nutzer hat die Wahl, ob er (Tracking-)Cookie erlauben möchte oder nicht. Erst, wenn er seine Zustimmung erteilt hat, werden die vorher registrierten Tracking-Tools geladen.

Die Entscheidung wird 30 Tage lang gespeichert.

## Voraussetzung

Der Banner, der den Infotext und die Links enthält, benötigt die Klasse `dsgvo-cookie-optin-banner` - über diese Klasse wird der Banner nach abgegebener Entscheidung ausgeblendet.

Innerhalb des Banners liegen zwei Elemente (z.B. Buttons), die jeweils mit den Klassen `opt-in` und `opt-out` erhalten. Hierüber wird die Entscheidung, die der Nutzer trifft, tatsächlich ausgelöst.
Alternativ können die Funktionen `.approveCookies()` und `.denyCookies()` (s.u.) manuell aufgerufen werden.

Das Script ist stand-alone; es bestehen keine weiteren Abhängigkeiten zu anderen JavaScript-Frameworks.

## Nutzung

### 1. DSGVO-Cookie-OptIn-Script einbinden

Wenn die Scripte nicht gebundled werden, wird der DSGVO-Cookie-OptIn als ScriptTag auf der Seite eingebunden:

```html
<script src="js/dsgvo-cookie-optin.js"></script>
```

Das CSS ist nur für die Demo relevant und sollte nicht übernommen werden.

### 2. Initialisieren

Der DSGVO-Cookie-OptIn wird als neues JavaScript-Objekt erstellt:

```javascript
var dsgvoCookieOptIn = new DsgvoCookieOptIn();
```

### 3. Tracking-Scripte registrieren

Über die Funktion `.registerTrackingScript()` kann ein Tracking-Script registriert werden. Dieses wird gespeichert und erst initialisiert, wenn der Nutzer seine Zustimmung gegeben hat. Über mehrfachen Aufruf der Funktion können mehrere Scripte registriert werden.

Beispiel: Einbinden von Google Analytics.

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

### 4. Cookie-Check starten

Via `.init()` wird der eigentliche Prozess gestartet. Das geschieht am besten nach `document.ready`.

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

## Methoden

### `.registerTrackingScript()`

Registriert Scripte, die ausgeführt werden, wenn der User seine Zustimmung gegeben hat.

Wichtig: Die Funktion `registerTrackingScript` muss __vor__ der Funktion `init` ausgeführt werden.

### `.unregisterTrackingScript()`

Meldet Scripte wieder ab, die zuvor registriert wurden.
In diesem Kontext hat die Funktion eigentlich keinen Nutzen, aber für das [Observer Design Pattern](https://www.geeksforgeeks.org/observer-pattern-set-1-introduction/) gehört es dazu :-)

### `.getTrackingScripts()`

Gibt alle registrierten Scripte zurück, um sie z.B. in der DevTools-Console auszugeben.

### `.init()`

Startet den Cookie-Check. Die gesetzten Cookies werden validiert und - je nachdem - der Banner ausgeblendet und ggf. die registrierten Scripte ausgeführt.

Wichtig: Die Funktion `init` muss __nach__ der Funktion `registerTrackingScript` ausgeführt werden.

### `.approveCookies()`

Setzt die entsprechenden Cookies, um die Entscheidung für den nächsten Seitenaufruf zu speichern, und führt die registrierten Scripte aus.

### `.denyCookies()`

Setzt die entsprechenden Cookies, um die Entscheidung für den nächsten Seitenaufruf zu speichern. Die registrierten Scripte werden demnach nicht ausgeführt.

## Abgrenzung

* _Keine Löschung von bereits existierenden Cookies_
  Der DSGVO-Cookie-OptIn reguliert nur, ob die registrierten Scripte ausgeführt werden oder nicht. Ein Löschen von bereits gesetzten Cookies wird nicht unterstützt.

* _Script-Tags müssen selbst erstellt werden_
  Da einige Tracking-Tools Funktionen benötigen, die über das einfache erstellen eine Script-Tags mit gegebener `src` hinaus gehen, wird das Erstellen dieser Tags nicht unterstützt und muss vom registrierten Script selbst übernommen werden.
  * Das einfache Erstellen eines Scriptes funktioniert z.B. über folgende Funktion: 
  ```javascript
  function loadJS(u) { var r = document.getElementsByTagName('script')[0], s = document.createElement('script'); s.src = u; r.parentNode.insertBefore(s, r); }
  loadJS('/js/vendor/tracking.min.js');
  ```

* _Keine Möglichkeit für custom Einstellungen_
  Das Script nimmt zur Zeit keine Parameter entgegen und kann entsprechend nicht über Parameter o.ä. gesteuert werden.

* _Nutzt eigene Cookies_
  Ein Script, das Cookies verhindern soll, kommt selbst leider nicht ohne Cookies aus. Das Script nutzt eigene Cookies, um die Nutzerentscheidung für nächste Seitenbesuche zu speichern. Das sollte so auch entsprechend in der Formulierung der Cookie-Richtlinie berücksichtigt werden.
  Die verwendeten Cookies sind `dsgvoCookieOptinDecided` und `dsgvoCookieOptinApproved`.