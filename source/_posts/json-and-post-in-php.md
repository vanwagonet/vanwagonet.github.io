title: JSON and POST in PHP
tags:
  - file upload
  - JSON
  - multipart
  - multipart/form-data
  - php
  - POST
id: 37
categories:
  - Distributed System Design
date: 2009-02-04 22:25:03
---

As I've been trying to do Lab 2 without having to modify my ami or change my apache configuration, I've found some nice helpers.

First, trying to encode and decode JSON in PHP 5.2 is easy... you just use the built in functions json_encode() and json_decode(). However, my Fedora ami is only running PHP 5.03\. So, how do I use JSON without recompiling my php installation, or downloading 5 billion files? Michal Migurski created a php-json library that is now a part of PEAR, but he still has a copy of his original encoder/decoder at [http://mike.teczno.com/JSON/JSON.phps](http://mike.teczno.com/JSON/JSON.phps). It's licenced BSD-style so have at it.

Next, I wanted to sent http requests by POST, including file uploads, again without downloading 5 billion files or messing with my ami. My solution was to actually learn the 'application/x-www-form-urlencoded' format and 'multipart/form-data' format and send the HTTP request across a socket.

A resource that helped me with the 'application/x-www-form-urlencoded' format is on [www.wellho.net](http://www.wellho.net/resources/ex.php4?item=h110/getpost.php). For the 'multipart/form-data' format [http://chxo.com/be2/20050724_93bf.html](http://chxo.com/be2/20050724_93bf.html) was very helpful. One gotcha to remember though is that PHP heredoc strings usually use \n line endings. While this may not cause any problems, to be safe and consistent with HTTP, you should use \r\n line endings.

Putting the two together into one function gave me the following:

```php
function http_post($host, $path, $data_hash, $file = '', $file_param_name = '') {
	$boundary = md5(uniqid());
	if ($file && $file_param_name) {
		$binary = file_get_contents($file['tmp_name']);

		$content_type = "multipart/form-data; boundary=$boundary";

		$items = array();
		foreach (array_keys($data_hash) as $key) {
			array_push($items, "--$boundary\r\nContent-Disposition: form-data; name=\"$key\"\r\n\r\n{$data_hash[$key]}\r\n");
		}
		array_push($items, "--$boundary\r\nContent-Disposition: form-data; name=\"$file_param_name\"; filename=\"{$file['name']}\"\r\n");
		array_push($items, "Content-Type: {$file['type']}\r\nContent-Transfer-Encoding: binary\r\n\r\n$binary\r\n--$boundary--\r\n");
		$data = implode('', $items);
	} else {
		$content_type = 'application/x-www-form-urlencoded; charset=UTF-8';

		$items = array();
		foreach (array_keys($data_hash) as $key) {
			array_push($items, urlencode($key) . '=' . urlencode($data_hash[$key]));
		}
		$data = implode('&', $items);
	}

	$content_length = strlen($data);
	$fp = fsockopen($host, 80);
	fputs($fp, "POST $path HTTP/1.1\r\n");
	fputs($fp, "Host: $host\r\n");
	fputs($fp, "Content-Type: $content_type\r\n");
	fputs($fp, "Content-Length: $content_length\r\n");
	fputs($fp, "Connection: close\r\n\r\n");
	fputs($fp, $data, $content_length);

	$http_response = stream_get_contents($fp);
	fclose($fp);

	list($headers, $body) = explode("\r\n\r\n", $http_response, 2);
	return $body;
}
```

Note that the `$file` parameter would be `$_FILES['your-form-input-name']`, and `$file_param_name` would be `'your-form-input-name'`. `$data_hash`, I assume would be obvious. It's an associative array with key => value pairs to send. The upload file would not appear in `$data_hash`.
