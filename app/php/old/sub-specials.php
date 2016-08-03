<?php

$datei = 'specials';

/**
 * === ITX - BLOCKS
 * ------------------------------------------------
 **/
// Lade Datei-Informationen
$result = sucheDateiInSQL($datei);

// Datei - F E H L E R
if (!$result['okay']) {
  include 'php/include/pages/all-error.php';
}
// Datei - N O R M A L
else {  
  $tpl = new HTML_Template_ITX('./templates');
  $tpl->loadTemplatefile($datei.'.tpl.html', true, true);
  include 'php/include/pages/all-header.php';
  
  $tpl->touchBlock('Content');
  
  $themen = array(
    array('show' => 1, 
          'name' => 'Steamportal für Freunde', 
          'bild' => 'specials/steam.jpg', 
          'link' => 'steam/profil/',
          'text' => 'Steam Accounts von Freunden und deren Computerspiele'),
    array('show' => 1, 
          'name' => 'Anno Warenrechner', 
          'bild' => 'specials/anno1404.jpg', 
          'link' => 'anno1404/',
          'text' => 'Ein Kalkulationsrechner für das PC-Spiel Anno1404')
  );
  
  $tpl->setCurrentBlock('ThemaBlock');
  foreach ($themen as $key => $value) {
    if (1 == $value['show']) {
      $tpl->setVariable('themename',$value['name']);
      $tpl->setVariable('themebild',$value['bild']);
      $tpl->setVariable('themelink',$value['link']);
      $tpl->setVariable('themetext',$value['text']);
      $tpl->parse('ThemaBlock');
    }
  }
}
include 'php/include/pages/all-template.php';

// zeig das zeug
$tpl->show();

?>