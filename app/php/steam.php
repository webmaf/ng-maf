<?php
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$url = 'http://steamcommunity.com/id/disable-xml/stats/00/?tab=achievements&xml=1';

$game = $request->game;
$names = $request->names;
$profiles = $request->profiles;
$collectAll = array();

if (count($profiles) > 0) {
    for ($i = 0; $i < count($profiles); $i++) {
        $url = 'http://steamcommunity.com/' . $profiles[$i] . '/stats/' . $game . '/?xml=1&l=german&tab=achievements';
        $xml = @simplexml_load_file($url);
        $gather = array();
        $count = 0;

        if ($xml === false || boolval($xml->error) || !isset($xml->achievements)) {
            $gather[] = array(
                'error' => true,
                'api' => 'countOfUnlock',
                'player' => $names[$i],
                'count' => $count
            );
        } else {
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
echo json_encode($collectAll);
?>