<?php
if (!isset($_GET['fn'])) {
	header("Location: index.html");
	exit;
}
ini_set('display_errors', 1);
error_reporting(E_ALL);

$items = array(
	array('image' => 'trees.jpg', 'title' => 'title1', 'content' => 'Lorem ipsum dolor sit amen.', 'link' => 'http://cyclist'),
	array('image' => 'trees.jpg', 'title' => 'title2', 'content' => 'Lorem ipsum dolor sit amen.', 'link' => 'http://cyclist'),
	array('image' => 'trees.jpg', 'title' => 'title3', 'content' => 'Lorem ipsum dolor sit amen.', 'link' => 'http://cyclist'),
	array('image' => 'trees.jpg', 'title' => 'title4', 'content' => 'Lorem ipsum dolor sit amen.', 'link' => 'http://cyclist'),
	array('image' => 'trees.jpg', 'title' => 'title5', 'content' => 'Lorem ipsum dolor sit amen.', 'link' => 'http://cyclist'),
	array('image' => 'trees.jpg', 'title' => 'title6', 'content' => 'Lorem ipsum dolor sit amen.', 'link' => 'http://cyclist'),
	array('image' => 'trees.jpg', 'title' => 'title7', 'content' => 'Lorem ipsum dolor sit amen.', 'link' => 'http://cyclist'),
	array('image' => 'trees.jpg', 'title' => 'title8', 'content' => 'Lorem ipsum dolor sit amen.', 'link' => 'http://cyclist'),
	array('image' => 'trees.jpg', 'title' => 'title9', 'content' => 'Lorem ipsum dolor sit amen.', 'link' => 'http://cyclist'),
	array('image' => 'trees.jpg', 'title' => 'title10', 'content' => 'Lorem ipsum dolor sit amen.', 'link' => 'http://cyclist'),
);

function gvar($name, $default=null, $required=false) {
	if (isset($_GET[$name])) {
		return $_GET[$name];
	}
	if ($required) {
		die ("Required GETvar $name not found");
	}
	return $default;
}

header("Content-Type: application/json");
switch($_GET['fn']) {
	case '/count':
		print json_encode(count($items));
		break;
	case '/fetch':
		$start = gvar('start', 0);
		$perPage = gvar('limit', 10);
		print json_encode(array_slice($items, $start, $perPage));
		break;
	default:
		break;
}
