<?php
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$url = 'http://steamcommunity.com/id/disable-xml/stats/00/?tab=achievements&xml=1';

//$url = 'http://steamcommunity.com/profiles/76561197960362967/stats/281990/?xml=1&tab=achievements';
//$url = 'http://steamcommunity.com/profiles/76561197995754090/stats/281990/?xml=1&tab=achievements';

$game = $request->game;
$names = $request->names;
$profiles = $request->profiles;
$collectAll = array();

if (count($profiles) > 0) {
    for ($i = 0; $i < count($profiles); $i++) {
        $url = 'http://steamcommunity.com/' . $profiles[$i] . '/stats/' . $game . '/?xml=1&l=german&tab=achievements';
        $xml = @simplexml_load_file($url);
        $gather = array();

        if ($xml === false || boolval($xml->error) || !isset($xml->achievements)) {
            $gather[] = null;
        } else {
            $count = 0;
            foreach ($xml->achievements->achievement as $achievement) {
                $gather[] = array(
                    'api' => (string)$achievement->apiname,
                    'name' => (string)$achievement->name,
                    'description' => (string)$achievement->description,
                    'unlock' => (int)$achievement['closed'],
                    'stamp' => (float)$achievement->unlockTimestamp,
                    'time' => (int)$achievement['closed'] ? date('d-m-y', (float)$achievement->unlockTimestamp) : '',
                    'imageClosed' => (string)$achievement->iconClosed,
                    'imageOpen' => (string)$achievement->iconOpen
                );
                if ((int)$achievement['closed'] == 1) {
                    $count++;
                }
            }

            // sort achievments
            $tmp = array();
            foreach ($gather as &$ma) {
                $tmp[] = &$ma["api"];
            }
            array_multisort($tmp, $gather);

            // build label and header
            array_unshift($gather, array(
                'api' => 'countOfUnlock',
                'player' => $names[$i],
                'count' => $count
            ));
        }

        $collectAll[] = $gather;
    }
}
/*
$xml = @simplexml_load_file($url);
//$xml = simplexml_load_string($xml);

if (!boolval($xml->error)) {
    foreach ($xml->achievements->achievement as $achievement) {

        $collectAll[] = array(
            'api' => (string)$achievement->apiname,
            'name' => (string)$achievement->name,
            'description' => (string)$achievement->description,
            'unlock' => (int)$achievement['closed'],
            'stamp' => (float)$achievement->unlockTimestamp,
            'time' => (int)$achievement['closed'] ? date('d-m-y', (float)$achievement->unlockTimestamp) : '',
            'imageClosed' => (string)$achievement->iconClosed,
            'imageOpen' => (string)$achievement->iconOpen
        );
    }

} else {
    $collectAll[] = null;
}
*/

//echo '<pre>'; print_r($gather);
echo json_encode($collectAll);
?>