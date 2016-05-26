<?php
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$url = 'http://steamcommunity.com/id/disable-xml/games?tab=all&xml=1';
$url = $request->url;

$xml = @simplexml_load_file($url);
//$xml = simplexml_load_string($xml);

$gather = array();

if (!boolval($xml->error)) {
    foreach ($xml->games->game as $game) {
        if ((string)$game->globalStatsLink) {
            $gather[] = array(
                'api' => (float)$game->appID,
                'achievement' => str_replace(array('http://steamcommunity.com/stats/', '/achievements/'), '', (string)$game->globalStatsLink),
                'name' => (string)$game->name,
                'logo' => (string)$game->logo,
                'storeLink' => (string)$game->storeLink,
                'globalStatsLink' => (string)$game->globalStatsLink
            );
        }
    }
} else {
    $gather[] = null;
}

//echo '<pre>'; print_r($gather);
echo json_encode($gather);
?>