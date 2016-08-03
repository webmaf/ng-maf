<?php
/**
 * === CONFIG 
 * ------------------------------------------------
 **/
error_reporting(E_ALL | E_STRICT);
ini_set("display_errors", 1);
/*
if ($_SERVER['SERVER_NAME'] == 'localhost') {
  
  include 'php/class/ConfigLocDB.class.php';
  $params['bases'] = 'http://localhost/webmaf/v010/';
  $params['theme'] = 'black-tie';
  require_once 'php/ITX.php';
}
elseif ($_SERVER['SERVER_NAME'] == 'webmaf.de') {
  
  include 'php/class/ConfigWebDB.class.php';
  $params['bases'] = 'http://webmaf.de/';
  $params['theme'] = 'black-tie';
  require_once 'pear/PEAR/HTML/Template/ITX.php';
}*/

/**
 * === KONSTANTE 
 * ------------------------------------------------
 **/

// Allgemein

define('DEBUG', false);

// Formulare
//===========================
define('FORMULAR_LEER', 'Das Formular ist nicht vollständig ausgefüllt.');
define('BENUTZER_NICHT_GEFUNDEN', 'Es wurde kein Benutzer mit den angegebenen Namen gefunden.');
define('PASSWORT_FALSCH', 'Das eingegebene Passwort ist ungültig.');
define('EMAIL_FALSCH', 'Die angegebene Email ist leider ungültig.');

// Kontakt
//===========================
define('KONTAKT_DIALOG', 'Ich freue mich über Feedback, Anregungen und Verbesserungsvorschläge von Ihnen! Sie können dafür das Formular auf dieser Seite benutzen.');
define('KONTAKT_FEHLER', 'Fehler:');
define('KONTAKT_GESENDET', 'Vielen Dank für Ihre Nachricht, Sie wurde soeben weitergeleitet.');
define('FORMULAR_SPAM', 'Sie können zur Zeit keine neue Nachricht verfassen, da Sie erst vor kurzem eine abgeschickt haben.');
define('ANREDE_NURABC', 'Es sind nur Buchstaben in der Anrede erlaubt. Bsp.: Frau Musterfrau');

// Datei
//===========================
define('DATEI_NOTFOUND', 'Die angeforderte Datei ist nicht gefunden oder freigegeben worden');
define('DATEI_KEINRECHT', 'Sie haben leider nicht genügend Rechte um auf die Datei zuzugreifen!');

?>