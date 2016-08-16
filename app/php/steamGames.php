<?php
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$url = 'http://steamcommunity.com/id/disable-xml/games?tab=all&xml=1';
$player = $request->player;

$xml = @simplexml_load_file($url);
//$xml = simplexml_load_string($xml);

$output = array();


if (count($player) > 0) {
    for ($i = 0; $i < count($player); $i++) {
        $url = 'http://steamcommunity.com/' . $player[$i]->profile . '/games?tab=all&xml=1';
        $xml = @simplexml_load_file($url);

        if (!boolval($xml->error)) {
            foreach ($xml->games->game as $game) {
                if ((string)$game->globalStatsLink) {
                    $output[] = array(
                        'api' => (float)$game->appID,
                        'achievement' => str_replace(array('http://steamcommunity.com/stats/', '/achievements/'), '', (string)$game->globalStatsLink),
                        'name' => (string)$game->name,
                        'logo' => (string)$game->logo,
                        'storeLink' => (string)$game->storeLink,
                        'globalStatsLink' => (string)$game->globalStatsLink
                    );
                }
            }
        }
    }
}

$output = array_map("unserialize", array_unique(array_map("serialize", $output)));

$return = array(
    $output,
    date('d.m.y H:i')
);

//echo '<pre>'; print_r($output);
file_put_contents('test.json', json_encode($return));
echo json_encode($return);
?>