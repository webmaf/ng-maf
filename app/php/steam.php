<?php
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$url = 'http://steamcommunity.com/id/disable-xml/stats/00/?tab=achievements&xml=1';
$url = $request->url;

//echo $url;

$xml = @simplexml_load_file($url);
//$xml = simplexml_load_string($xml);

$gather = array();

if (!boolval($xml->error)) {
    foreach ($xml->achievements->achievement as $achievement) {
        if ($achievement['closed'] == 1) {
            $image = $achievement->iconClosed;
        } else {
            $image = $achievement->iconOpen;
        }

        $gather[] = array(
            'api' => (string)$achievement->apiname,
            'name' => (string)$achievement->name,
            'description' => (string)$achievement->description,
            'unlock' => (int)$achievement['closed'],
            'stamp' => (float)$achievement->unlockTimestamp,
            'time' =>  (int)$achievement['closed'] ? date('d.m.Y', (float)$achievement->unlockTimestamp) : '',
            'image' => (string)$image
        );
    }

} else {
    $gather[] = null;
}

//echo '<pre>'; print_r($gather);
echo json_encode($gather);
?>